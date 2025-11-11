// server.js
process.on('unhandledRejection', (r) => console.error('UNHANDLED REJECTION', r));
process.on('uncaughtException',  (e) => console.error('UNCAUGHT EXCEPTION', e));

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());

// ── CORS ─────────────────────────────────────────────────────────────────────
const listFromEnv = (v) =>
  (v || '').split(',').map(s => s.trim().replace(/\/$/, '')).filter(Boolean);

const allowlist = [
  ...listFromEnv(process.env.FRONTEND_ORIGIN),
  ...listFromEnv(process.env.ADDITIONAL_ORIGINS),
  ...listFromEnv(process.env.ALLOWED_ORIGINS),
];

app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true);
    const o = origin.replace(/\/$/, '');
    if (allowlist.includes(o)) return cb(null, true);
    return cb(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  exposedHeaders: ['Content-Length'],
}));
app.options('*', cors());

// ── Health ───────────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.status(200).send('ok'));
app.get('/ping',   (_req, res) => res.json({ pong: true, ts: Date.now() }));

// ── Montaje de APIs (TODO bajo /api) ─────────────────────────────────────────
// IMPORTANTE: mueve rutas que chocaban con el SPA.
// Antes: safeUse('/encuesta', () => require('./routes/survey'));
function safeUse(pathPrefix, loader) {
  try {
    app.use(pathPrefix, loader());
    console.log(`✅ Router montado en ${pathPrefix}`);
  } catch (e) {
    console.error(`❌ No se pudo montar router en ${pathPrefix}:`, e.message);
  }
}

// monta TODO bajo /api
safeUse('/api',        () => require('./routes/uploadExcel'));
safeUse('/api',        () => require('./routes/excelroute'));
// renombra tu ruta de encuesta a /api/survey (ajusta el archivo si exporta un router base)
safeUse('/api/survey', () => require('./routes/survey'));
safeUse('/api',        () => require('./routes/analizarResultados'));

// endpoint para enviar correos (API)
app.post('/api/enviar-correos', async (req, res) => {
  try {
    const { empresa_id } = req.body;
    if (!empresa_id) return res.status(400).json({ error: 'Falta empresa_id' });
    const sendEmail = require('./mail/mailSender');
    const result = await sendEmail(empresa_id);
    return res.json(result);
  } catch (error) {
    console.error('❌ Error enviando correos:', error);
    return res.status(500).json({ error: error.message });
  }
});

// ── Servir el frontend (build de Vite) ───────────────────────────────────────
const frontendPath = path.join(__dirname, '../Frontend/dist');
const indexPath    = path.join(frontendPath, 'index.html');

console.log('📁 Frontend path:', frontendPath);
console.log('📄 Index path:', indexPath);

if (fs.existsSync(frontendPath) && fs.existsSync(indexPath)) {
  app.use(express.static(frontendPath, { maxAge: '1d', etag: true }));
  console.log('✅ Sirviendo estáticos desde:', frontendPath);

  // ⚠️ El fallback del SPA debe ir al final y NO debe bloquear /encuesta
  app.get('*', (req, res) => {
    // Solo excluye verdaderas rutas de API
    const isApi = req.path.startsWith('/api') || req.path.startsWith('/health') || req.path.startsWith('/ping');
    if (isApi) {
      console.log('❌ API route not found:', req.path);
      return res.status(404).json({ error: 'API endpoint no encontrado' });
    }
    console.log('🔄 SPA fallback para:', req.path);
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error('❌ Error enviando index.html:', err);
        res.status(500).send('Error cargando la aplicación');
      }
    });
  });
} else {
  console.error('❌ Frontend no encontrado en:', frontendPath);
  console.error('❌ Index.html existe?', fs.existsSync(indexPath));
  app.get('*', (_req, res) => {
    res.status(503).send(`
      <h1>Aplicación no disponible</h1>
      <p>Frontend no construido. Ejecuta:</p>
      <pre>cd Frontend && npm run build</pre>
    `);
  });
}

// ── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📍 Modo: ${process.env.NODE_ENV || 'development'}`);
});
