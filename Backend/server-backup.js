const express = require("express");
const https = require("https");
const http = require("http");
const helmet = require("helmet");
const cors = require("cors");
const { supabase, supabaseAdmin } = require("./supabase/supabase");
const { getSSLOptions } = require("./config/ssl");

const uploadRouter = require("./routes/uploadExcel");
const surveyRouter = require("./routes/survey");
const excelRouter = require("./routes/excelroute");

const app = express();

// Middleware para forzar HTTPS en producción
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !req.secure && req.get('x-forwarded-proto') !== 'https') {
    return res.redirect(301, `https://${req.get('host')}${req.url}`);
  }
  next();
});

app.use(express.json({ limit: '10mb' }));

// Configuración de CORS (debe ir antes que Helmet)
app.use(cors({
    origin: ["https://localhost:5173", "https://localhost:3000", "http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

// Configuración de seguridad con Helmet (después de CORS)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.supabase.io", "wss://api.supabase.io"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  crossOriginEmbedderPolicy: false // Desactivar para evitar conflictos con CORS
}));

app.use("/", uploadRouter);
app.use("/", excelRouter);
app.use("/encuesta", surveyRouter);

/* ───────── EMPRESAS ───────── */
// Crear nueva empresa
app.post("/empresas", async (req, res) => {
  try {
    const {
      nombre,
      cantidad_empleados: empleados,
      jerarquia1,
      jerarquia2,
      jerarquia3,
      jerarquia4,
      areas,
    } = req.body;

    if (
      !nombre ||
      !empleados ||
      !jerarquia1 ||
      !jerarquia2 ||
      !jerarquia3 ||
      !jerarquia4 ||
      !areas ||
      !Array.isArray(areas) ||
      areas.length === 0
    ) {
      return res
        .status(400)
        .json({ error: "Faltan datos requeridos o áreas vacías" });
    }

    // Crear la empresa
    const { data: empresaData, error: empresaError } = await supabaseAdmin
      .from("empresas")
      .insert([
        {
          nombre,
          cantidad_empleados: empleados,
          jerarquia: 4,
          jerarquia1,
          jerarquia2,
          jerarquia3,
          jerarquia4,
        },
      ])
      .select("id")
      .single();

    if (empresaError) throw empresaError;

    const empresa_id = empresaData.id;

    // Construir los datos para insertar áreas (incluyendo jerarquías)
    const areaInserts = areas.map((nombre) => ({
      nombre,
      empresa_id,
      jerarquia1,
      jerarquia2,
      jerarquia3,
      jerarquia4,
    }));

    console.log("🧪 Insertando en áreas:", areaInserts);

    const { data: areasData, error: areasError } = await supabaseAdmin
      .from("areas")
      .insert(areaInserts);

    if (areasError) throw areasError;

    // Actualizar campo 'areas' en empresas (opcional)
    const totalAreas = areas.length;
    const { error: updateError } = await supabaseAdmin
      .from("empresas")
      .update({ areas: totalAreas })
      .eq("id", empresa_id);

    if (updateError) {
      console.error("❌ Error al actualizar campo 'areas':", updateError);
      throw updateError;
    }

    // Obtener la empresa actualizada para devolverla
    const { data: updatedEmpresa, error: fetchUpdatedError } =
      await supabaseAdmin
        .from("empresas")
        .select("*")
        .eq("id", empresa_id)
        .single();

    if (fetchUpdatedError) throw fetchUpdatedError;

    res.status(201).json({ empresa: updatedEmpresa, areas: areasData });
  } catch (error) {
    console.error("❌ Error al crear empresa y áreas:", error);
    res
      .status(500)
      .json({ error: "Error al crear empresa", detalle: error.message });
  }
});

// Obtener todas las empresas
app.get("/empresas", async (req, res) => {
  try {
    const { data, error } = await supabase.from("empresas").select("*");
    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error("❌ Error al obtener empresas:", error.message, error);
    res
      .status(500)
      .json({ error: "Error al obtener empresas", detalle: error.message });
  }
});

/* ───────── ÁREAS ───────── */

// Obtener áreas por empresa
app.get("/areas/empresa/:empresaId", async (req, res) => {
  const { empresaId } = req.params;

  try {
    const { data, error } = await supabase
      .from("areas")
      .select("*")
      .eq("empresa_id", empresaId);

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error("❌ Error al obtener áreas por empresa:", error);
    res
      .status(500)
      .json({ error: "Error al obtener áreas", detalle: error.message });
  }
});

// Obtener un área por ID
app.get("/areas/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from("areas")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error("❌ Error al obtener área por ID:", error);
    res
      .status(500)
      .json({ error: "Error al obtener área", detalle: error.message });
  }
});

// Crear área nueva
app.post("/areas", async (req, res) => {
  const { nombre, empresa_id } = req.body;

  if (!nombre || !empresa_id) {
    return res
      .status(400)
      .json({ error: "Faltan datos requeridos para crear el área" });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("areas")
      .insert([{ nombre, empresa_id }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    console.error("❌ Error al crear área:", error);
    res
      .status(500)
      .json({ error: "Error al crear área", detalle: error.message });
  }
});

// Editar área por ID
app.put("/areas/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: "El nombre del área es obligatorio" });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("areas")
      .update({ nombre })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error("❌ Error al actualizar área:", error);
    res
      .status(500)
      .json({ error: "Error al actualizar área", detalle: error.message });
  }
});

// Eliminar área por ID
app.delete("/areas/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabaseAdmin.from("areas").delete().eq("id", id);

    if (error) throw error;
    res.status(200).json({ message: "Área eliminada correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar área:", error);
    res
      .status(500)
      .json({ error: "Error al eliminar área", detalle: error.message });
  }
});

/* ───────── CARGOS ───────── */

// Crear nuevo cargo
app.post("/cargos", async (req, res) => {
  const { nombre, personas, area_id, jerarquia_id } = req.body;

  if (!nombre || !area_id || !jerarquia_id) {
    return res
      .status(400)
      .json({ error: "Faltan datos requeridos para crear el cargo" });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("cargos")
      .insert([{ nombre, personas: personas || 0, area_id, jerarquia_id }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    console.error("❌ Error al crear cargo:", error);
    res
      .status(500)
      .json({ error: "Error al crear cargo", detalle: error.message });
  }
});

// Obtener todos los cargos
app.get("/cargos", async (req, res) => {
  try {
    const { data, error } = await supabase.from("cargos").select("*");

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error("❌ Error al obtener cargos:", error);
    res
      .status(500)
      .json({ error: "Error al obtener cargos", detalle: error.message });
  }
});

// Actualizar cargo
app.put("/cargos/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, personas } = req.body;

  try {
    const { data, error } = await supabaseAdmin
      .from("cargos")
      .update({ nombre, personas })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error("❌ Error al actualizar cargo:", error);
    res
      .status(500)
      .json({ error: "Error al actualizar cargo", detalle: error.message });
  }
});

// Eliminar cargo
app.delete("/cargos/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabaseAdmin.from("cargos").delete().eq("id", id);

    if (error) throw error;

    res.status(200).json({ message: "Cargo eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar cargo:", error);
    res
      .status(500)
      .json({ error: "Error al eliminar cargo", detalle: error.message });
  }
});

/* ───────── SUBCARGOS ───────── */

// Obtener todos los subcargos
app.get("/subcargos", async (req, res) => {
  try {
    const { data, error } = await supabase.from("subcargos").select("*");

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error("❌ Error al obtener subcargos:", error);
    res
      .status(500)
      .json({ error: "Error al obtener subcargos", detalle: error.message });
  }
});

// Obtener subcargos por cargo
app.get("/subcargos/cargo/:cargoId", async (req, res) => {
  const { cargoId } = req.params;
  try {
    const { data, error } = await supabase
      .from("subcargos")
      .select("*")
      .eq("cargo_id", cargoId);

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error("❌ Error al obtener subcargos por cargo:", error);
    res
      .status(500)
      .json({ error: "Error al obtener subcargos", detalle: error.message });
  }
});

// Crear subcargo
app.post("/subcargos", async (req, res) => {
  const { nombre, personas, cargo_id } = req.body;

  if (!nombre || !cargo_id) {
    return res
      .status(400)
      .json({ error: "Faltan datos requeridos para crear el subcargo" });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("subcargos")
      .insert([{ nombre, personas: personas || 0, cargo_id }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error("❌ Error al crear subcargo:", error);
    res
      .status(500)
      .json({ error: "Error al crear subcargo", detalle: error.message });
  }
});
app.put("/subcargos/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, personas } = req.body;

  // Validación opcional
  if (!nombre && typeof personas !== "number") {
    return res
      .status(400)
      .json({
        error: "Debes enviar al menos nombre o personas para actualizar",
      });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("subcargos")
      .update({
        // Solo actualiza los campos que vinieron en el body
        ...(nombre !== undefined ? { nombre } : {}),
        ...(personas !== undefined ? { personas } : {}),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error("❌ Error al actualizar subcargo:", error.message);
    res
      .status(500)
      .json({ error: "Error al actualizar subcargo", detalle: error.message });
  }
});

// Eliminar subcargo
app.delete("/subcargos/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabaseAdmin
      .from("subcargos")
      .delete()
      .eq("id", id);

    if (error) throw error;
    res.status(200).json({ message: "Subcargo eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar subcargo:", error);
    res
      .status(500)
      .json({ error: "Error al eliminar subcargo", detalle: error.message });
  }
});

/* ───────── USUARIOS ───────── */

app.get("/usuarios", async (req, res) => {
  try {
    const { data, error } = await supabase.from("usuarios").select("*");

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error);
    res
      .status(500)
      .json({ error: "Error al obtener usuarios", detalle: error.message });
  }
});

/* ───────── INICIO DEL SERVIDOR ───────── */

const PORT = process.env.PORT || 3000;
const sslOptions = getSSLOptions();

if (sslOptions) {
  // Crear servidor HTTPS
  const httpsServer = https.createServer(sslOptions, app);
  
  httpsServer.listen(PORT, () => {
    console.log(`🔒 Servidor HTTPS corriendo en https://localhost:${PORT}`);
  });
  
  // Opcional: Crear servidor HTTP que redirija a HTTPS
  const httpApp = express();
  httpApp.use((req, res) => {
    const httpsUrl = `https://${req.headers.host.replace(/:\d+/, `:${PORT}`)}${req.url}`;
    console.log(`🔄 Redirigiendo HTTP a HTTPS: ${httpsUrl}`);
    res.redirect(301, httpsUrl);
  });
  
  const httpServer = http.createServer(httpApp);
  httpServer.listen(8080, () => {
    console.log(`� Servidor HTTP (redirige a HTTPS) corriendo en http://localhost:8080`);
  });
} else {
  // Fallback a HTTP si no hay certificados
  const httpServer = http.createServer(app);
  httpServer.listen(PORT, () => {
    console.log(`⚠️  Servidor HTTP corriendo en http://localhost:${PORT} (modo fallback sin SSL)`);
  });
}
