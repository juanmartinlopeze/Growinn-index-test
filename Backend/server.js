// server.js
// ─────────────────────────────────────────────────────────────────────────────
process.on('unhandledRejection', (r) => console.error('UNHANDLED REJECTION', r));
process.on('uncaughtException',  (e) => console.error('UNCAUGHT EXCEPTION', e));

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// ─────────────────────────────────────────────────────────────────────────────
// CORS configurable por variables (sin HTTPS obligatorio)
const listFromEnv = (v) =>
  (v || '').split(',').map(s => s.trim().replace(/\/$/, '')).filter(Boolean);

const allowlist = [
  ...listFromEnv(process.env.FRONTEND_ORIGIN),     // ej: https://growinn-index.onrender.com
  ...listFromEnv(process.env.ADDITIONAL_ORIGINS),  // ej: http://localhost:5173,http://localhost:3000
  ...listFromEnv(process.env.ALLOWED_ORIGINS),
];

const corsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true);               // healthchecks/server-to-server
    const o = origin.replace(/\/$/, '');
    if (allowlist.includes(o)) return cb(null, true);
    return cb(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  exposedHeaders: ['Content-Length'],
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use((_, res, next) => { res.setHeader('Vary', 'Origin'); next(); });

// ─────────────────────────────────────────────────────────────────────────────
// Endpoints de vida
app.get('/health', (_req, res) => res.status(200).send('ok'));
app.get('/ping',   (_req, res) => res.json({ pong: true, ts: Date.now() }));

// ─────────────────────────────────────────────────────────────────────────────
// Supabase: carga segura (sin relación con HTTPS)
let supabase, supabaseAdmin, supabaseAuth;
try {
  const { createClient } = require('@supabase/supabase-js');
  const URL     = process.env.SUPABASE_URL;
  const ANON    = process.env.SUPABASE_ANON_KEY;
  const SERVICE = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (URL && ANON) {
    supabase     = createClient(URL, ANON);
    supabaseAuth = createClient(URL, ANON);
  } else {
    console.warn('⚠️  Supabase client NO configurado (SUPABASE_URL o SUPABASE_ANON_KEY faltan)');
  }
  if (URL && SERVICE) {
    supabaseAdmin = createClient(URL, SERVICE);
  } else {
    console.warn('⚠️  Supabase ADMIN NO configurado (SUPABASE_SERVICE_ROLE/_KEY falta)');
  }
} catch (e) {
  console.error('❌ Error cargando @supabase/supabase-js:', e.message);
}

// ─────────────────────────────────────────────────────────────────────────────
// Montaje defensivo de routers locales
function safeUse(path, loader) {
  try { app.use(path, loader()); console.log(`✅ Router montado en ${path}`); }
  catch (e) { console.error(`❌ No se pudo montar router en ${path}:`, e.message); }
}

safeUse('/',         () => require('./routes/uploadExcel'));
safeUse('/',         () => require('./routes/excelroute'));
safeUse('/encuesta', () => require('./routes/survey'));
safeUse('/api',      () => require('./routes/analizarResultados'));

const surveyRouter = require('./routes/survey');
const mailRouter = require('./routes/mail');
const analizarResultadosRouter = require('./routes/analizarResultados');

app.use('/encuesta', surveyRouter);
app.use('/', mailRouter);
app.use('/api', analizarResultadosRouter);

// Servir archivos estáticos del frontend
const frontendPath = path.join(__dirname, '../Frontend/dist');
console.log('📁 Buscando frontend en:', frontendPath);

if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));
  console.log('✅ Frontend encontrado y sirviendo estáticos');
  
  // IMPORTANTE: Fallback para SPA (React Router)
  // Debe estar DESPUÉS de todas las rutas API
  app.get('*', (req, res) => {
    // No aplicar fallback a rutas de API
    if (req.path.startsWith('/api') || 
        req.path.startsWith('/encuesta') || 
        req.path.startsWith('/enviar-correos') ||
        req.path.startsWith('/validate-token') ||
        req.path.startsWith('/areas') ||
        req.path.startsWith('/cargos') ||
        req.path.startsWith('/subcargos') ||
        req.path.startsWith('/empresas') ||
        req.path.startsWith('/usuarios')) {
      return res.status(404).json({ error: 'API endpoint no encontrado' });
    }
    
    // Para todas las demás rutas, servir index.html
    console.log('🔄 Fallback SPA para ruta:', req.path);
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
} else {
  console.error('❌ No se encontró el build del frontend');
  app.get('*', (req, res) => {
    res.status(404).send('Frontend no encontrado. Ejecuta: cd Frontend && npm run build');
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});

// ─────────────────────────────────────────────────────────────────────────────
// 404 & errores
app.use((req, res) => res.status(404).json({ error: 'Not Found', path: req.path }));
app.use((err, _req, res, _next) => {
  console.error('ERR:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Error' });
});

// ─────────────────────────────────────────────────────────────────────────────
// Puerto (solo HTTP)
const USE_HTTPS = process.env.USE_HTTPS === 'true';

if (USE_HTTPS) {
  // ...existing HTTPS setup...
}
