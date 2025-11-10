// server-mail.js
require('dotenv').config();

const fs = require('fs');
const cors = require('cors');
const path = require('path');
const express = require('express');
const { v4: uuid } = require('uuid');
const { supabaseAdmin } = require('../supabase/supabase');
const { MailerSend, EmailParams, Sender, Recipient } = require('mailersend');

const app = express();
const PORT = process.env.PORT || 3001;
const mailerSend = new MailerSend({ apiKey: process.env.MAILERSEND_API_KEY });

// ===============================
// Utilidades/Helpers
// ===============================
const parseCsv = (val) =>
  (val || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

function getFrontendBaseUrl() {
  // Prioridad: FRONTEND_URL -> RENDER_EXTERNAL_URL -> (fallback opcional: BASE_URL)
  const base =
    process.env.FRONTEND_URL ||
    process.env.RENDER_EXTERNAL_URL ||
    process.env.BASE_URL;

  if (!base) {
    throw new Error(
      'No hay FRONTEND_URL/RENDER_EXTERNAL_URL/BASE_URL configurada. Define FRONTEND_URL en Render.'
    );
  }
  if (/localhost|127\.0\.0\.1/i.test(base)) {
    console.warn(`⚠️ FRONTEND_URL/BASE_URL apunta a localhost: ${base} (no servirá fuera de tu PC)`);
  }
  return base.replace(/\/+$/, ''); // sin slash final
}

function buildSurveyLink(token) {
  const base = getFrontendBaseUrl(); // p.ej. https://growinn-index.onrender.com
  const url = new URL('/encuesta', base); // ruta de tu SPA
  url.searchParams.set('token', token);
  return url.toString();
}

// ===============================
// CORS
// ===============================
const devOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
];

const allowedOrigins =
  process.env.NODE_ENV === 'production'
    ? [
        process.env.FRONTEND_URL,        // https://growinn-index.onrender.com
        process.env.RENDER_EXTERNAL_URL, // url pública de este servicio (si lo llamas desde navegador)
        ...parseCsv(process.env.ALLOWED_ORIGINS),
      ].filter(Boolean)
    : devOrigins;

app.use(
  cors({
    origin(origin, cb) {
      // Permite server-to-server (sin Origin) y orígenes permitidos
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS bloqueado para origen: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json()); // Para parsear JSON

// ===============================
// Logs de arranque
// ===============================
console.log('🔑 MailerSend API Key:', process.env.MAILERSEND_API_KEY ? '✅ Configurado' : '❌ No encontrado');
console.log('📧 From Email:', process.env.FROM_EMAIL || '(sin definir)');
console.log('🌐 FRONTEND_URL:', process.env.FRONTEND_URL || '(sin definir)');
console.log('🌐 RENDER_EXTERNAL_URL:', process.env.RENDER_EXTERNAL_URL || '(sin definir)');
console.log('🌐 ALLOWED_ORIGINS:', process.env.ALLOWED_ORIGINS || '(sin definir)');

// ===============================
// Plantilla de email (cargada 1 vez)
// ===============================
const templatePath = path.join(__dirname, 'template.html');
const rawTemplate = fs.readFileSync(templatePath, 'utf8');

// ===============================
// Rutas
// ===============================

// Health check (Render)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'mail-service',
  });
});

// Info
app.get('/', (req, res) => {
  res.json({
    service: 'Growinn Mail Service',
    version: '1.0.0',
    endpoints: [
      'GET /health - Health check',
      'GET /enviar-correos - Enviar correos de encuesta',
      'GET /preview-link?token=UUID - Previsualiza el link generado (no envía correo)',
    ],
  });
});

// Preview del link (útil para probar sin enviar correo)
app.get('/preview-link', (req, res) => {
  try {
    const token = req.query.token || uuid();
    const link = buildSurveyLink(token);
    res.json({ token, link });
  } catch (err) {
    console.error('❌ Error /preview-link:', err);
    res.status(500).json({ error: String(err?.message || err) });
  }
});

// Enviar correos
app.get('/enviar-correos', async (req, res) => {
  try {
    // 1) Usuarios con correo válido
    const { data: usuarios, error } = await supabaseAdmin
      .from('usuarios')
      .select('id, correo, nombre_completo')
      .not('correo', 'is', null)
      .neq('correo', '');

    if (error) throw error;
    if (!usuarios?.length) return res.send('No hay usuarios con correo.');

    const from = new Sender(process.env.FROM_EMAIL, 'INNLAB');
    console.log('📤 Preparando envío de correos...');
    console.log('👥 Usuarios encontrados:', usuarios.length);
    console.log('📧 Remitente:', process.env.FROM_EMAIL);

    for (const user of usuarios) {
      try {
        // 2) Crear token y guardar
        const token = uuid();
        const { error: errToken } = await supabaseAdmin
          .from('survey_tokens')
          .insert([{ user_id: user.id, token }]);
        if (errToken) {
          console.error(`❌ Error guardando token para ${user.correo}:`, errToken);
          continue;
        }

        // 3) Enlace público
        const surveyLink = buildSurveyLink(token);

        // 4) Plantilla
        const htmlBody = rawTemplate
          .replace(/{{\s*nombre_completo\s*}}/g, user.nombre_completo || 'allí')
          .replace(/{{\s*survey_link\s*}}/g, surveyLink);

        // 5) Envío
        const emailParams = new EmailParams()
          .setFrom(from)
          .setTo([new Recipient(user.correo, user.nombre_completo)])
          .setSubject(`Hola ${user.nombre_completo || ''}, ¡tu encuesta te espera!`)
          .setText(`Hola ${user.nombre_completo || ''}, completa la encuesta aquí: ${surveyLink}`)
          .setHtml(htmlBody);

        console.log(`📤 Enviando a: ${user.correo}`);
        await mailerSend.email.send(emailParams);
        console.log(`✅ Enviado a ${user.correo}`);
      } catch (errEnvio) {
        console.error(`❌ Error enviando a ${user.correo}:`, {
          message: errEnvio?.message,
          status: errEnvio?.statusCode,
          body: errEnvio?.body,
          headers: errEnvio?.headers,
        });
      }
    }

    res.send('✅ Envío de encuestas completado.');
  } catch (err) {
    console.error('💥 Error /enviar-correos:', err);
    res.status(500).send('Error interno.');
  }
});

// ===============================
// Server
// ===============================
app.listen(PORT, () => {
  console.log(`🚀 Mail Service listening on port ${PORT}`);
  console.log(`📧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('🌐 CORS origins:', allowedOrigins);
});
