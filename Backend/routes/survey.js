    const express = require('express');
    const router  = express.Router();
    const { supabaseAdmin } = require('../supabase/supabase');

    // POST /encuesta
    router.post('/', async (req, res) => {
    try {
        const { token, ...answers } = req.body;

        if (!token) {
        return res.status(400).json({ error: 'Token es requerido.' });
        }

        // 1️⃣ Validar token
        const { data: tokenRow, error: tokenError } = await supabaseAdmin
        .from('survey_tokens')
        .select('user_id, used, expires_at')
        .eq('token', token)
        .single();

        if (tokenError || !tokenRow) {
        return res.status(400).json({ error: 'Token inválido.' });
        }
        if (tokenRow.used) {
        return res.status(400).json({ error: 'Token ya usado.' });
        }
        if (new Date(tokenRow.expires_at) < new Date()) {
        return res.status(400).json({ error: 'Token expirado.' });
        }

        // 2️⃣ Guardar respuestas
        const { error: respError } = await supabaseAdmin
        .from('survey_responses')
        .insert([{ user_id: tokenRow.user_id, answers, completed_at: new Date().toISOString() }]);

        if (respError) {
        console.error('Error guardando respuestas:', respError);
        return res.status(500).json({ error: 'Error guardando respuestas.' });
        }

        // 3️⃣ Marcar token como usado
        const { error: markError } = await supabaseAdmin
        .from('survey_tokens')
        .update({ used: true })
        .eq('token', token);
        if (markError) console.error('Error marcando token como usado:', markError);

        // 4️⃣ Responder éxito
        res.json({ ok: true });
    } catch (err) {
        console.error('Error en /encuesta:', err);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
    });

    module.exports = router;
