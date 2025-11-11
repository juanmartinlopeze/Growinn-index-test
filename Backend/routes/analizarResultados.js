const express = require('express');
const router = express.Router();
const { supabase, supabaseAdmin } = require('../supabase/supabase');
const categorizeResponses = require('../constants/categorizeAnswer');
const calculateScore = require('../constants/calculateScore');

// Configurable por ENV; por defecto 'evaluaciones'
const EVAL_TABLE = process.env.EVAL_TABLE || 'evaluaciones';

/**
 * POST /api/analizar-resultados
 * body: { empresa_id: number, usuario_id?: number, version?: string }
 */
router.post('/analizar-resultados', async (req, res) => {
  try {
    const { empresa_id, usuario_id = null, version = '1.0' } = req.body || {};
    if (!empresa_id) {
      return res.status(400).json({ error: 'Falta empresa_id' });
    }
    if (!supabase)      return res.status(500).json({ error: 'Supabase no configurado' });
    if (!supabaseAdmin) return res.status(500).json({ error: 'Supabase admin no configurado para escrituras' });

    // 1) Obtener usuarios de la empresa
    const { data: usuarios, error: errorUsuarios } = await supabase
      .from('usuarios')
      .select('id, jerarquia_id')
      .eq('empresa_id', empresa_id);

    if (errorUsuarios) {
      console.error('Error obteniendo usuarios:', errorUsuarios);
      return res.status(500).json({ error: 'Error obteniendo usuarios', details: errorUsuarios });
    }

    const userMap = {};
    const userIds = [];
    for (const u of usuarios || []) {
      userMap[u.id] = u.jerarquia_id;
      userIds.push(u.id);
    }

    // 2) Obtener respuestas de esos usuarios
    const { data: surveyResponses, error: errorResp } = await supabase
      .from('survey_responses')
      .select('user_id, answers, completed_at')
      .in('user_id', userIds.length ? userIds : [-1]); // evita error si vacío

    if (errorResp) {
      console.error('Error obteniendo respuestas:', errorResp);
      return res.status(500).json({ error: 'Error obteniendo respuestas', details: errorResp });
    }

    // 3) Flatten + asignar jerarquía
    const respuestas = [];
    for (const resp of surveyResponses || []) {
      if (!resp.answers) continue;
      const jerarquia = userMap[resp.user_id] || null;
      for (const [questionId, answer] of Object.entries(resp.answers)) {
        respuestas.push({
          questionId: String(questionId).toUpperCase(),
          answer: Number(answer),
          jerarquia,
          raw: { questionId, answer, user_id: resp.user_id, jerarquia },
        });
      }
    }

    // 4) Calcular resultados (tu lógica ya existente)
    const categorizado = categorizeResponses(respuestas);
    const resultados_json = calculateScore(categorizado);

    // Para métrica adicional
    const total_respuestas = respuestas.length;
    const fecha_evaluacion = new Date().toISOString();

    // 5) Guardar en la tabla con Service Role
    const payload = {
      empresa_id,
      usuario_id,                    // opcional
      fecha_evaluacion,              // timestamptz
      resultados_json,               // jsonb
      version,                       // '1.0' por defecto
      created_at: fecha_evaluacion,
      updated_at: fecha_evaluacion,
    };

    const { data: inserted, error: insertError } = await supabaseAdmin
      .from(EVAL_TABLE)
      .insert(payload)
      .select('id')
      .single();

    if (insertError) {
      console.error('❌ Error al guardar evaluación:', insertError);
      return res.status(500).json({ error: 'No se pudo guardar la evaluación' });
    }

    // 6) Responder al front como espera tu componente
    return res.json({
      ok: true,
      evaluacion_id: inserted.id,
      total_respuestas,
      total_usuarios: userIds.length,
      fecha: fecha_evaluacion,
      // opcional para depurar:
      // resultados_json,
    });
  } catch (err) {
    console.error('💥 Error en /api/analizar-resultados:', err);
    return res.status(500).json({ error: 'Error interno durante el análisis' });
  }
});

module.exports = router;
