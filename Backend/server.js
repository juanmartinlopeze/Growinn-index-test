// server.js
// ─────────────────────────────────────────────────────────────────────────────
// Robustez ante errores no capturados (evita caídas silenciosas → 502)
process.on('unhandledRejection', (r) => console.error('UNHANDLED REJECTION', r));
process.on('uncaughtException',  (e) => console.error('UNCAUGHT EXCEPTION', e));

require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const app = express();
app.use(express.json());

// ─────────────────────────────────────────────────────────────────────────────
// CORS configurable por variables (acepta varios nombres de ENV)
const listFromEnv = (v) =>
  (v || '')
    .split(',')
    .map((s) => s.trim().replace(/\/$/, ''))
    .filter(Boolean);

const allowlist = [
  ...listFromEnv(process.env.FRONTEND_ORIGIN),     // ej: https://growinn-index.onrender.com
  ...listFromEnv(process.env.ADDITIONAL_ORIGINS),  // ej: http://localhost:5173,http://localhost:3000
  ...listFromEnv(process.env.ALLOWED_ORIGINS),     // compatibilidad con tu config anterior
];

const corsOptions = {
  origin(origin, cb) {
    // Permite healthchecks y llamadas sin header Origin (server-to-server)
    if (!origin) return cb(null, true);
    const o = origin.replace(/\/$/, '');
    if (allowlist.includes(o)) return cb(null, true);
    return cb(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Length'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use((_, res, next) => { res.setHeader('Vary', 'Origin'); next(); });

// ─────────────────────────────────────────────────────────────────────────────
// Endpoints de vida (antes de cargar dependencias que podrían fallar)
app.get('/health', (_req, res) => res.status(200).send('ok'));
app.get('/ping',   (_req, res) => res.json({ pong: true, ts: Date.now() }));

// ─────────────────────────────────────────────────────────────────────────────
// Supabase: carga segura (no tumba el proceso si faltan variables)
let supabase, supabaseAdmin, supabaseAuth;
try {
  const { createClient } = require('@supabase/supabase-js');
  const URL     = process.env.SUPABASE_URL;
  const ANON    = process.env.SUPABASE_ANON_KEY;
  const SERVICE = process.env.SUPABASE_SERVICE_ROLE;

  if (URL && ANON) {
    supabase     = createClient(URL, ANON);   // lecturas si RLS lo permite
    supabaseAuth = createClient(URL, ANON);   // verificación de JWT (getUser)
  } else {
    console.warn('⚠️  Supabase client NO configurado (SUPABASE_URL o SUPABASE_ANON_KEY faltan)');
  }

  if (URL && SERVICE) {
    supabaseAdmin = createClient(URL, SERVICE); // escribe/omite RLS
  } else {
    console.warn('⚠️  Supabase ADMIN NO configurado (SUPABASE_SERVICE_ROLE falta)');
  }
} catch (e) {
  console.error('❌ Error cargando @supabase/supabase-js:', e.message);
}

// ─────────────────────────────────────────────────────────────────────────────
// Montaje defensivo de routers locales (no tumban el server si fallan al require)
function safeUse(path, loader) {
  try {
    app.use(path, loader());
    console.log(`✅ Router montado en ${path}`);
  } catch (e) {
    console.error(`❌ No se pudo montar router en ${path}:`, e.message);
  }
}

safeUse('/',        () => require('./routes/uploadExcel'));
safeUse('/',        () => require('./routes/excelroute'));
safeUse('/encuesta',() => require('./routes/survey'));

// ─────────────────────────────────────────────────────────────────────────────
// Auth middleware (Supabase JWT) — opcional
async function requireAuth(req, res, next) {
  if (!supabaseAuth) return res.status(500).json({ error: 'Auth no configurado' });

  const auth  = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;

  if (!token) return res.status(401).json({ error: 'Missing Bearer token' });

  const { data, error } = await supabaseAuth.auth.getUser(token);
  if (error || !data?.user) return res.status(401).json({ error: 'Invalid or expired token' });

  req.user = data.user;
  next();
}

app.get('/auth/me', requireAuth, (req, res) => res.json({ user: req.user }));

// ─────────────────────────────────────────────────────────────────────────────
// === RUTAS DE NEGOCIO (adaptadas con guards y clients seguros) ==============

// Helpers para elegir cliente
const dbRead  = () => supabaseAdmin || supabase; // preferimos admin si está
const dbWrite = () => supabaseAdmin;             // escrituras requieren admin

/* ───────── EMPRESAS ───────── */
// Crear nueva empresa (usa admin)
app.post('/empresas', async (req, res) => {
  try {
    const admin = dbWrite();
    if (!admin) return res.status(500).json({ error: 'Supabase admin no configurado' });

    const {
      nombre,
      cantidad_empleados: empleados,
      jerarquia1, jerarquia2, jerarquia3, jerarquia4,
      areas
    } = req.body;

    if (!nombre || !empleados || !jerarquia1 || !jerarquia2 || !jerarquia3 || !jerarquia4 ||
        !areas || !Array.isArray(areas) || areas.length === 0) {
      return res.status(400).json({ error: 'Faltan datos requeridos o áreas vacías' });
    }

    // Crear empresa
    const { data: empresaData, error: empresaError } = await admin
      .from('empresas')
      .insert([{
        nombre,
        cantidad_empleados: empleados,
        jerarquia: 4,
        jerarquia1, jerarquia2, jerarquia3, jerarquia4,
      }])
      .select('id')
      .single();

    if (empresaError) throw empresaError;

    const empresa_id = empresaData.id;

    // Insertar áreas (con jerarquías)
    const areaInserts = areas.map((nombre) => ({
      nombre, empresa_id, jerarquia1, jerarquia2, jerarquia3, jerarquia4,
    }));

    const { data: areasData, error: areasError } = await admin
      .from('areas')
      .insert(areaInserts);

    if (areasError) throw areasError;

    // Actualizar contador de áreas
    const totalAreas = areas.length;
    const { error: updateError } = await admin
      .from('empresas')
      .update({ areas: totalAreas })
      .eq('id', empresa_id);

    if (updateError) throw updateError;

    // Devolver empresa actualizada
    const { data: updatedEmpresa, error: fetchUpdatedError } = await admin
      .from('empresas')
      .select('*')
      .eq('id', empresa_id)
      .single();

    if (fetchUpdatedError) throw fetchUpdatedError;

    res.status(201).json({ empresa: updatedEmpresa, areas: areasData });
  } catch (error) {
    console.error('❌ Error al crear empresa y áreas:', error);
    res.status(500).json({ error: 'Error al crear empresa', detalle: error.message });
  }
});

// Obtener todas las empresas (read/admin preferente)
app.get('/empresas', async (_req, res) => {
  try {
    const client = dbRead();
    if (!client) return res.status(500).json({ error: 'Supabase no configurado' });

    const { data, error } = await client.from('empresas').select('*');
    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error('❌ Error al obtener empresas:', error.message, error);
    res.status(500).json({ error: 'Error al obtener empresas', detalle: error.message });
  }
});

/* ───────── ÁREAS ───────── */
// Áreas por empresa
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

// Área por ID
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

// Crear área
app.post('/areas', async (req, res) => {
  try {
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
    res.status(201).json(data);
  } catch (error) {
    console.error('❌ Error al crear área:', error);
    res.status(500).json({ error: 'Error al crear área', detalle: error.message });
  }
});

// Actualizar área
app.put('/areas/:id', async (req, res) => {
  try {
    const admin = dbWrite();
    if (!admin) return res.status(500).json({ error: 'Supabase admin no configurado' });

    const { id } = req.params;
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ error: 'El nombre del área es obligatorio' });

    const { data, error } = await admin
      .from('areas')
      .update({ nombre })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error('❌ Error al actualizar área:', error);
    res.status(500).json({ error: 'Error al actualizar área', detalle: error.message });
  }
});

// Eliminar área
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
// Crear cargo
app.post('/cargos', async (req, res) => {
  try {
    const admin = dbWrite();
    if (!admin) return res.status(500).json({ error: 'Supabase admin no configurado' });

    const { nombre, personas, area_id, jerarquia_id } = req.body;
    if (!nombre || !area_id || !jerarquia_id) {
      return res.status(400).json({ error: 'Faltan datos requeridos para crear el cargo' });
    }

    const { data, error } = await admin
      .from('cargos')
      .insert([{ nombre, personas: personas || 0, area_id, jerarquia_id }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('❌ Error al crear cargo:', error);
    res.status(500).json({ error: 'Error al crear cargo', detalle: error.message });
  }
});

// Listar cargos
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

// Actualizar cargo
app.put('/cargos/:id', async (req, res) => {
  try {
    const admin = dbWrite();
    if (!admin) return res.status(500).json({ error: 'Supabase admin no configurado' });

    const { id } = req.params;
    const { nombre, personas } = req.body;

    const { data, error } = await admin
      .from('cargos')
      .update({ nombre, personas })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error('❌ Error al actualizar cargo:', error);
    res.status(500).json({ error: 'Error al actualizar cargo', detalle: error.message });
  }
});

// Eliminar cargo
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
// Listar subcargos
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

// Subcargos por cargo
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

// Crear subcargo
app.post('/subcargos', async (req, res) => {
  try {
    const admin = dbWrite();
    if (!admin) return res.status(500).json({ error: 'Supabase admin no configurado' });

    const { nombre, personas, cargo_id } = req.body;
    if (!nombre || !cargo_id) {
      return res.status(400).json({ error: 'Faltan datos requeridos para crear el subcargo' });
    }

    const { data, error } = await admin
      .from('subcargos')
      .insert([{ nombre, personas: personas || 0, cargo_id }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('❌ Error al crear subcargo:', error);
    res.status(500).json({ error: 'Error al crear subcargo', detalle: error.message });
  }
});

// Actualizar subcargo
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
      ...(nombre   !== undefined ? { nombre } : {}),
      ...(personas !== undefined ? { personas } : {}),
    };

    const { data, error } = await admin
      .from('subcargos')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error('❌ Error al actualizar subcargo:', error.message);
    res.status(500).json({ error: 'Error al actualizar subcargo', detalle: error.message });
  }
});

// Eliminar subcargo
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

/* ───────── USUARIOS ───────── */
app.get('/usuarios', async (_req, res) => {
  try {
    const client = dbRead();
    if (!client) return res.status(500).json({ error: 'Supabase no configurado' });

    const { data, error } = await client.from('usuarios').select('*');
    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios', detalle: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 404 & handler de errores (incluye CORS denegado)
app.use((req, res) => res.status(404).json({ error: 'Not Found', path: req.path }));
app.use((err, _req, res, _next) => {
  console.error('ERR:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Error' });
});

// ─────────────────────────────────────────────────────────────────────────────
// Puerto Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
