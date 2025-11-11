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
app.use(express.json());

// ─────────────────────────────────────────────────────────────────────────────
// CORS - Configuración específica para producción
const isProduction = process.env.NODE_ENV === 'production';

const corsOptions = {
  origin: function (origin, callback) {
    // Lista de orígenes permitidos
    const allowedOrigins = [
      'https://growinn-index.onrender.com',
      'http://localhost:5173',
      'http://localhost:3000',
      process.env.FRONTEND_ORIGIN,
      process.env.ADDITIONAL_ORIGINS,
    ].filter(Boolean);

    console.log('🔍 CORS - Origin:', origin);
    console.log('✅ Allowed origins:', allowedOrigins);

    // Permitir requests sin origin (como Postman, curl, etc.)
    if (!origin) {
      console.log('✅ CORS - Sin origin, permitido');
      return callback(null, true);
    }

    // Verificar si el origin está permitido
    if (allowedOrigins.some(allowed => origin.includes(allowed) || allowed.includes(origin))) {
      console.log('✅ CORS - Origin permitido');
      return callback(null, true);
    }

    console.warn('❌ CORS - Origin bloqueado:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-Total-Count'],
  maxAge: 86400, // 24 horas
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Headers adicionales
app.use((req, res, next) => {
  res.setHeader('Vary', 'Origin');
  next();
});

// ─────────────────────────────────────────────────────────────────────────────
// Endpoints de vida
app.get('/health', (_req, res) => {
  console.log('✅ Health check');
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/ping', (_req, res) => {
  console.log('🏓 Ping');
  res.json({ pong: true, ts: Date.now() });
});

// ─────────────────────────────────────────────────────────────────────────────
// Supabase: carga segura
let supabase, supabaseAdmin, supabaseAuth;
try {
  const { createClient } = require('@supabase/supabase-js');
  const URL = process.env.SUPABASE_URL;
  const ANON = process.env.SUPABASE_ANON_KEY;
  const SERVICE = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (URL && ANON) {
    supabase = createClient(URL, ANON);
    supabaseAuth = createClient(URL, ANON);
    console.log('✅ Supabase client configurado');
  } else {
    console.warn('⚠️  Supabase client NO configurado (faltan SUPABASE_URL o SUPABASE_ANON_KEY)');
  }
  
  if (URL && SERVICE) {
    supabaseAdmin = createClient(URL, SERVICE);
    console.log('✅ Supabase ADMIN configurado');
  } else {
    console.warn('⚠️  Supabase ADMIN NO configurado (falta SUPABASE_SERVICE_ROLE_KEY)');
  }
} catch (e) {
  console.error('❌ Error cargando @supabase/supabase-js:', e.message);
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers DB
const dbRead = () => {
  const client = supabaseAdmin || supabase;
  if (!client) console.warn('⚠️  dbRead: No hay cliente Supabase disponible');
  return client;
};

const dbWrite = () => {
  if (!supabaseAdmin) console.warn('⚠️  dbWrite: No hay cliente ADMIN disponible');
  return supabaseAdmin;
};

// ─────────────────────────────────────────────────────────────────────────────
// Montaje defensivo de routers
function safeUse(path, loader) {
  try {
    app.use(path, loader());
    console.log(`✅ Router montado en ${path}`);
  } catch (e) {
    console.error(`❌ No se pudo montar router en ${path}:`, e.message);
  }
}

safeUse('/', () => require('./routes/uploadExcel'));
safeUse('/', () => require('./routes/excelroute'));
safeUse('/encuesta', () => require('./routes/survey'));
safeUse('/api', () => require('./routes/analizarResultados'));

// Ruta para enviar correos
app.post('/enviar-correos', async (req, res) => {
  try {
    const { empresa_id } = req.body;
    if (!empresa_id) {
      return res.status(400).json({ error: 'Falta empresa_id' });
    }
    const sendEmail = require('./mail/mailSender');
    const result = await sendEmail(empresa_id);
    return res.json(result);
  } catch (error) {
    console.error('❌ Error enviando correos:', error);
    return res.status(500).json({ error: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Auth middleware
async function requireAuth(req, res, next) {
  if (!supabaseAuth) return res.status(500).json({ error: 'Auth no configurado' });
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing Bearer token' });

  const { data, error } = await supabaseAuth.auth.getUser(token);
  if (error || !data?.user) return res.status(401).json({ error: 'Invalid or expired token' });

  req.user = data.user;
  next();
}

app.get('/auth/me', requireAuth, (req, res) => res.json({ user: req.user }));

// ─────────────────────────────────────────────────────────────────────────────
// RUTAS API

/* ───────── EMPRESAS ───────── */
app.post('/empresas', async (req, res) => {
  try {
    console.log('📝 POST /empresas - Body:', req.body);
    const admin = dbWrite();
    if (!admin) return res.status(500).json({ error: 'Supabase admin no configurado' });

    const { nombre, cantidad_empleados: empleados, jerarquia1, jerarquia2, jerarquia3, jerarquia4, areas } = req.body;

    if (!nombre || !empleados || !jerarquia1 || !jerarquia2 || !jerarquia3 || !jerarquia4 || !Array.isArray(areas) || areas.length === 0) {
      return res.status(400).json({ error: 'Faltan datos requeridos o áreas vacías' });
    }

    const { data: empresaData, error: empresaError } = await admin
      .from('empresas')
      .insert([{ nombre, cantidad_empleados: empleados, jerarquia: 4, jerarquia1, jerarquia2, jerarquia3, jerarquia4 }])
      .select('id')
      .single();

    if (empresaError) throw empresaError;
    const empresa_id = empresaData.id;

    const areaInserts = areas.map((nombre) => ({ nombre, empresa_id, jerarquia1, jerarquia2, jerarquia3, jerarquia4 }));
    const { data: areasData, error: areasError } = await admin
      .from('areas')
      .insert(areaInserts)
      .select('id,nombre,empresa_id,jerarquia1,jerarquia2,jerarquia3,jerarquia4');

    if (areasError) throw areasError;

    const totalAreas = areas.length;
    await admin.from('empresas').update({ areas: totalAreas }).eq('id', empresa_id);

    const { data: updatedEmpresa } = await admin.from('empresas').select('*').eq('id', empresa_id).single();

    console.log('✅ Empresa creada:', empresa_id);
    res.status(201).json({ empresa: updatedEmpresa, areas: areasData || [] });
  } catch (error) {
    console.error('❌ Error al crear empresa y áreas:', error);
    res.status(500).json({ error: 'Error al crear empresa', detalle: error.message });
  }
});

app.get('/empresas', async (_req, res) => {
  try {
    console.log('📋 GET /empresas');
    const client = dbRead();
    if (!client) return res.status(500).json({ error: 'Supabase no configurado' });
    const { data, error } = await client.from('empresas').select('*');
    if (error) throw error;
    console.log(`✅ Empresas encontradas: ${data?.length || 0}`);
    res.status(200).json(data);
  } catch (error) {
    console.error('❌ Error al obtener empresas:', error);
    res.status(500).json({ error: 'Error al obtener empresas', detalle: error.message });
  }
});

/* ───────── ÁREAS ───────── */
app.get('/areas/empresa/:empresaId', async (req, res) => {
  try {
    const client = dbRead();
    if (!client) return res.status(500).json({ error: 'Supabase no configurado' });
    const { empresaId } = req.params;
    const { data, error } = await client.from('areas').select('*').eq('empresa_id', empresaId);
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error('❌ Error al obtener áreas por empresa:', error);
    res.status(500).json({ error: 'Error al obtener áreas', detalle: error.message });
  }
});

app.get('/areas/:id', async (req, res) => {
  try {
    const client = dbRead();
    if (!client) return res.status(500).json({ error: 'Supabase no configurado' });
    const { id } = req.params;
    const { data, error } = await client.from('areas').select('*').eq('id', id).single();
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error('❌ Error al obtener área por ID:', error);
    res.status(500).json({ error: 'Error al obtener área', detalle: error.message });
  }
});

app.post('/areas', async (req, res) => {
  try {
    console.log('📝 POST /areas - Body:', req.body);
    const admin = dbWrite();
    if (!admin) return res.status(500).json({ error: 'Supabase admin no configurado' });
    
    const { nombre, empresa_id } = req.body;
    if (!nombre || !empresa_id) {
      return res.status(400).json({ error: 'Faltan datos requeridos para crear el área' });
    }
    
    const { data, error } = await admin
      .from('areas')
      .insert([{ nombre, empresa_id }])
      .select()
      .single();
      
    if (error) throw error;
    console.log('✅ Área creada:', data.id);
    res.status(201).json(data);
  } catch (error) {
    console.error('❌ Error al crear área:', error);
    res.status(500).json({ error: 'Error al crear área', detalle: error.message });
  }
});

app.put('/areas/:id', async (req, res) => {
  try {
    const admin = dbWrite();
    if (!admin) return res.status(500).json({ error: 'Supabase admin no configurado' });
    const { id } = req.params;
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ error: 'El nombre del área es obligatorio' });
    const { data, error } = await admin.from('areas').update({ nombre }).eq('id', id).select().single();
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error('❌ Error al actualizar área:', error);
    res.status(500).json({ error: 'Error al actualizar área', detalle: error.message });
  }
});

app.delete('/areas/:id', async (req, res) => {
  try {
    const admin = dbWrite();
    if (!admin) return res.status(500).json({ error: 'Supabase admin no configurado' });
    const { id } = req.params;
    const { error } = await admin.from('areas').delete().eq('id', id);
    if (error) throw error;
    res.status(200).json({ message: 'Área eliminada correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar área:', error);
    res.status(500).json({ error: 'Error al eliminar área', detalle: error.message });
  }
});

/* ───────── CARGOS ───────── */
app.post('/cargos', async (req, res) => {
  try {
    const admin = dbWrite();
    if (!admin) return res.status(500).json({ error: 'Supabase admin no configurado' });
    const { nombre, personas, area_id, jerarquia_id } = req.body;
    if (!nombre || !area_id || !jerarquia_id) {
      return res.status(400).json({ error: 'Faltan datos requeridos para crear el cargo' });
    }
    const { data, error } = await admin.from('cargos').insert([{ nombre, personas: personas || 0, area_id, jerarquia_id }]).select().single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('❌ Error al crear cargo:', error);
    res.status(500).json({ error: 'Error al crear cargo', detalle: error.message });
  }
});

app.get('/cargos', async (_req, res) => {
  try {
    const client = dbRead();
    if (!client) return res.status(500).json({ error: 'Supabase no configurado' });
    const { data, error } = await client.from('cargos').select('*');
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error('❌ Error al obtener cargos:', error);
    res.status(500).json({ error: 'Error al obtener cargos', detalle: error.message });
  }
});

app.put('/cargos/:id', async (req, res) => {
  try {
    const admin = dbWrite();
    if (!admin) return res.status(500).json({ error: 'Supabase admin no configurado' });
    const { id } = req.params;
    const { nombre, personas } = req.body;
    const { data, error } = await admin.from('cargos').update({ nombre, personas }).eq('id', id).select().single();
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error('❌ Error al actualizar cargo:', error);
    res.status(500).json({ error: 'Error al actualizar cargo', detalle: error.message });
  }
});

app.delete('/cargos/:id', async (req, res) => {
  try {
    const admin = dbWrite();
    if (!admin) return res.status(500).json({ error: 'Supabase admin no configurado' });
    const { id } = req.params;
    const { error } = await admin.from('cargos').delete().eq('id', id);
    if (error) throw error;
    res.status(200).json({ message: 'Cargo eliminado correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar cargo:', error);
    res.status(500).json({ error: 'Error al eliminar cargo', detalle: error.message });
  }
});

/* ───────── SUBCARGOS ───────── */
app.get('/subcargos', async (_req, res) => {
  try {
    const client = dbRead();
    if (!client) return res.status(500).json({ error: 'Supabase no configurado' });
    const { data, error } = await client.from('subcargos').select('*');
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error('❌ Error al obtener subcargos:', error);
    res.status(500).json({ error: 'Error al obtener subcargos', detalle: error.message });
  }
});

app.get('/subcargos/cargo/:cargoId', async (req, res) => {
  try {
    const client = dbRead();
    if (!client) return res.status(500).json({ error: 'Supabase no configurado' });
    const { cargoId } = req.params;
    const { data, error } = await client.from('subcargos').select('*').eq('cargo_id', cargoId);
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error('❌ Error al obtener subcargos por cargo:', error);
    res.status(500).json({ error: 'Error al obtener subcargos', detalle: error.message });
  }
});

app.post('/subcargos', async (req, res) => {
  try {
    const admin = dbWrite();
    if (!admin) return res.status(500).json({ error: 'Supabase admin no configurado' });
    const { nombre, personas, cargo_id } = req.body;
    if (!nombre || !cargo_id) {
      return res.status(400).json({ error: 'Faltan datos requeridos para crear el subcargo' });
    }
    const { data, error } = await admin.from('subcargos').insert([{ nombre, personas: personas || 0, cargo_id }]).select().single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('❌ Error al crear subcargo:', error);
    res.status(500).json({ error: 'Error al crear subcargo', detalle: error.message });
  }
});

app.put('/subcargos/:id', async (req, res) => {
  try {
    const admin = dbWrite();
    if (!admin) return res.status(500).json({ error: 'Supabase admin no configurado' });
    const { id } = req.params;
    const { nombre, personas } = req.body;
    if (!nombre && typeof personas !== 'number') {
      return res.status(400).json({ error: 'Debes enviar al menos nombre o personas para actualizar' });
    }
    const payload = {
      ...(nombre !== undefined ? { nombre } : {}),
      ...(personas !== undefined ? { personas } : {}),
    };
    const { data, error } = await admin.from('subcargos').update(payload).eq('id', id).select().single();
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error('❌ Error al actualizar subcargo:', error);
    res.status(500).json({ error: 'Error al actualizar subcargo', detalle: error.message });
  }
});

app.delete('/subcargos/:id', async (req, res) => {
  try {
    const admin = dbWrite();
    if (!admin) return res.status(500).json({ error: 'Supabase admin no configurado' });
    const { id } = req.params;
    const { error } = await admin.from('subcargos').delete().eq('id', id);
    if (error) throw error;
    res.status(200).json({ message: 'Subcargo eliminado correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar subcargo:', error);
    res.status(500).json({ error: 'Error al eliminar subcargo', detalle: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// SERVIR FRONTEND (solo en producción)
if (isProduction) {
  const frontendPath = path.join(__dirname, '../Frontend/dist');
  const indexPath = path.join(frontendPath, 'index.html');

  console.log('📁 Buscando frontend en:', frontendPath);

  if (fs.existsSync(frontendPath) && fs.existsSync(indexPath)) {
    app.use(express.static(frontendPath, { maxAge: '1d', etag: true }));
    console.log('✅ Sirviendo archivos estáticos del frontend');

    app.get('*', (req, res) => {
      const apiPrefixes = ['/api', '/encuesta', '/enviar-correos', '/validate-token', '/areas', '/cargos', '/subcargos', '/empresas', '/usuarios', '/health', '/ping', '/auth'];
      
      if (apiPrefixes.some(prefix => req.path.startsWith(prefix))) {
        return res.status(404).json({ error: 'API endpoint no encontrado', path: req.path });
      }

      console.log('🔄 SPA fallback para:', req.path);
      res.sendFile(indexPath);
    });
  } else {
    console.warn('⚠️  Frontend no encontrado en producción');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Manejo de errores
app.use((err, _req, res, _next) => {
  console.error('💥 Error no manejado:', err);
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Iniciar servidor (SOLO HTTP)
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('\n🚀 ================================');
  console.log(`🚀 Servidor HTTP corriendo en puerto ${PORT}`);
  console.log(`📍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
  console.log('🚀 ================================\n');
});

// Manejo de cierre graceful
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM recibido, cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });
});