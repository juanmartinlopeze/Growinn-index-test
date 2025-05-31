require('dotenv').config();
const fs      = require('fs');
const path    = require('path');
const express = require('express');
const { v4: uuid } = require('uuid');
const { supabaseAdmin } = require('../supabase/supabase');
const { MailerSend, EmailParams, Sender, Recipient } = require('mailersend');

const app        = express();  
const PORT       = process.env.PORT || 3001;
const mailerSend = new MailerSend({ apiKey: process.env.MAILERSEND_API_KEY });

// Carga la plantilla _una sola vez_
const templatePath = path.join(__dirname, 'template.html');
const rawTemplate  = fs.readFileSync(templatePath, 'utf8');

app.get('/enviar-correos', async (req, res) => {
  try {
    // 1️⃣ Trae usuarios con correo y su id
    const { data: usuarios, error } = await supabaseAdmin
      .from('usuarios')
      .select('id, correo, nombre_completo')
      .not('correo', 'is', null);

    if (error) throw error;
    if (!usuarios.length) return res.send('No hay usuarios con correo.');

    const from = new Sender(process.env.FROM_EMAIL, 'INNLAB');

    for (const user of usuarios) {
      // 2️⃣ Genera token y lo guarda en survey_tokens
      const token = uuid();
      const { error: errToken } = await supabaseAdmin
        .from('survey_tokens')
        .insert([{ user_id: user.id, token }]);

      if (errToken) {
        console.error(`❌ Error guardando token para ${user.correo}:`, errToken);
        continue; // sigue con el próximo usuario
      }

      // 3️⃣ Construye el enlace dinámico
      const surveyLink = `${process.env.BASE_URL}/encuesta?token=${token}`;

      // 4️⃣ Reemplaza placeholders en la plantilla
      const htmlBody = rawTemplate
        .replace(/{{\s*nombre_completo\s*}}/g, user.nombre_completo)
        .replace(/{{\s*survey_link\s*}}/g, surveyLink);

      // 5️⃣ Prepara y envía el correo
      const emailParams = new EmailParams()
        .setFrom(from)
        .setTo([ new Recipient(user.correo, user.nombre_completo) ])
        .setSubject(`Hola ${user.nombre_completo}, ¡tu encuesta te espera!`)
        .setText(`Hola ${user.nombre_completo}, completa la encuesta aquí: ${surveyLink}`)
        .setHtml(htmlBody);

      try {
        await mailerSend.email.send(emailParams);
        console.log(`📤 Correo enviado a ${user.correo}`);
      } catch (err) {
        console.error(`❌ Error enviando a ${user.correo}:`, err);
      }
    }

    res.send('✅ Envío de encuestas completado.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error interno.');
  }
});

app.listen(PORT, () => console.log(`Escuchando en http://localhost:${PORT}`));
