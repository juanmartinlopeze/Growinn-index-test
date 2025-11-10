const express = require('express');
const router = express.Router();
const { supabase } = require('../supabase/supabase');
const categorizeResponses = require('../constants/categorizeAnswer');
const calculateScore = require('../constants/calculateScore');

// POST /api/analizar-resultados
router.post('/analizar-resultados', async (req, res) => {
  const { empresa_id } = req.body;
  if (!empresa_id) {
    return res.status(400).json({ error: 'Falta empresa_id' });
  }

  try {
    // 1. Obtener usuarios de la empresa
    const { data: usuarios, error: errorUsuarios } = await supabase
      .from('usuarios')
      .select('id, jerarquia_id')
      .eq('empresa_id', empresa_id);
    if (errorUsuarios) {
      console.error('Error obteniendo usuarios:', errorUsuarios);
      return res.status(500).json({ error: 'Error obteniendo usuarios', details: errorUsuarios });
    }
    console.log('Usuarios encontrados para empresa', empresa_id, ':', usuarios);
    const userMap = {};
    const userIds = [];
    for (const u of usuarios || []) {
      userMap[u.id] = u.jerarquia_id;
      userIds.push(u.id);
    }
    console.log('userIds usados para filtrar survey_responses:', userIds);

    // 2. Obtener respuestas de esos usuarios
    const { data: surveyResponses, error } = await supabase
      .from('survey_responses')
      .select('user_id, answers, completed_at')
      .in('user_id', userIds);

    console.log('surveyResponses crudas de la DB:', surveyResponses);
    if (error) {
      console.error('Error obteniendo respuestas:', error);
      return res.status(500).json({ error: 'Error obteniendo respuestas', details: error });
    }

    // 3. Unificar todas las respuestas individuales en un solo array plano, asignando jerarquia
    let respuestas = [];
    for (const resp of surveyResponses || []) {
      if (!resp.answers) continue;
      const jerarquia = userMap[resp.user_id] || null;
      for (const [questionId, answer] of Object.entries(resp.answers)) {
        respuestas.push({
          questionId: questionId.toUpperCase(),
          answer: Number(answer),
          jerarquia,
          raw: { questionId, answer, user_id: resp.user_id, jerarquia }
        });
      }
    }
    console.log('Respuestas planas para categorizar (detallado):');
    respuestas.forEach(r => console.log(r));

    // 4. Procesar respuestas
    const categorizado = categorizeResponses(respuestas);
    const resultados = calculateScore(categorizado);

    console.log('Resultados calculados:', Object.keys(resultados));

    // 5. Guardar en tabla evaluaciones
    const usuario_id = req.user?.id || req.body.usuario_id || null;
    
    const payload = {
      empresa_id,
      usuario_id,
      fecha_evaluacion: new Date().toISOString(),
      resultados_json: resultados,
      version: '1.0'
    };

    console.log('💾 Guardando evaluación en DB...');
    console.log('Payload:', {
      empresa_id: payload.empresa_id,
      usuario_id: payload.usuario_id,
      fecha_evaluacion: payload.fecha_evaluacion,
      categorias: Object.keys(payload.resultados_json),
      version: payload.version
    });

    const { data: saved, error: saveError } = await supabase
      .from('evaluaciones')
      .insert([payload])
      .select()
      .single();

    if (saveError) {
      console.error('❌ Error guardando evaluación en DB:', saveError);
      // Devolver resultados aunque falle el guardado
      return res.status(200).json({ 
        resultados, 
        warning: 'Evaluación calculada pero no guardada en DB',
        error_guardado: saveError.message 
      });
    }

    console.log('✅ Evaluación guardada exitosamente con ID:', saved?.id);

    return res.status(200).json({ 
      resultados, 
      evaluacion_id: saved?.id,
      mensaje: 'Análisis completado y guardado exitosamente',
      fecha_evaluacion: saved?.fecha_evaluacion
    });

  } catch (err) {
    console.error('💥 Error inesperado en análisis:', err);
    return res.status(500).json({ 
      error: 'Error inesperado al procesar análisis', 
      details: err.message 
    });
  }
});

module.exports = router;
