// mailSender.js
require('dotenv').config();
const fs   = require('fs');
const path = require('path');
const express = require('express');
const { supabaseAdmin } = require('../supabase/supabase');
const { MailerSend, EmailParams, Sender, Recipient } = require('mailersend');

const app = express();  
const PORT = process.env.PORT || 3001;
const mailerSend = new MailerSend({ apiKey: process.env.MAILERSEND_API_KEY });

// Carga la plantilla _una sola vez_ al iniciar
const templatePath = path.join(__dirname, 'template.html');
const rawTemplate  = fs.readFileSync(templatePath, 'utf8');

console.log('Plantilla cargada desde:',rawTemplate.slice(0, 100) + '...'); // Muestra los primeros 50 caracteres

app.get('/enviar-correos', async (req, res) => {
  try {
    const { data: usuarios, error } = await supabaseAdmin
      .from('usuarios')
      .select('correo, nombre_completo')
      .not('correo', 'is', null);

    if (error) {
      console.error(error);
      return res.status(500).send('Error al leer la BD');
    }
    if (!usuarios.length) {
      return res.send('No hay usuarios con correo.');
    }

    const from = new Sender(process.env.FROM_EMAIL, 'INNLAB');
    for (const user of usuarios) {
      const htmlBody = rawTemplate.replace(
        /{{\s*nombre_completo\s*}}/g,
        user.nombre_completo
      );

      const emailParams = new EmailParams()
        .setFrom(from)
        .setTo([ new Recipient(user.correo, user.nombre_completo) ])
        .setSubject(`Hola ${user.nombre_completo}!`)
        .setText(`¡Hola ${user.nombre_completo}! Responde la encuesta aquí: https://forms.gle/ENLACE_EJEMPLO`)
        .setHtml(htmlBody);

      try {
        await mailerSend.email.send(emailParams);
        console.log(`📤 Correo enviado a ${user.correo}`);
      } catch (err) {
        console.error(`❌ Error enviando a ${user.correo}:`, err);
      }
    }

    res.send('✅ Envío completado.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error interno.');
  }
});

app.listen(PORT, () => console.log(`Escuchando en http://localhost:${PORT}`));
