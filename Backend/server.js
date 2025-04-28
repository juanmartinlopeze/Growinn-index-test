const express = require("express");
const cors = require("cors");
const { supabase, supabaseAdmin } = require("./supabase/supabase");

const app = express();
app.use(express.json());
app.use(cors());

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
      !nombre || !empleados ||
      !jerarquia1 || !jerarquia2 || !jerarquia3 || !jerarquia4 ||
      !areas || !Array.isArray(areas) || areas.length === 0
    ) {
      return res.status(400).json({ error: "Faltan datos requeridos o áreas vacías" });
    }

    const { data: empresaData, error: empresaError } = await supabaseAdmin
      .from("empresas")
      .insert([{ nombre, cantidad_empleados: empleados, jerarquia: 4, jerarquia1, jerarquia2, jerarquia3, jerarquia4 }])
      .select("id")
      .single();

    if (empresaError) throw empresaError;

    const empresa_id = empresaData.id;

    const areaInserts = areas.map(nombre => ({ nombre, empresa_id }));

    const { data: areasData, error: areasError } = await supabaseAdmin
      .from("areas")
      .insert(areaInserts);

    if (areasError) throw areasError;

    res.status(201).json({ empresa: empresaData, areas: areasData });
  } catch (error) {
    console.error("❌ Error al crear empresa y áreas:", error);
    res.status(500).json({ error: "Error al crear empresa", detalle: error.message });
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
    res.status(500).json({ error: "Error al obtener empresas", detalle: error.message });
  }
});

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
    res.status(500).json({ error: "Error al obtener áreas", detalle: error.message });
  }
});

// Crear nuevo cargo
app.post("/cargos", async (req, res) => {
  const { nombre, personas, area_id } = req.body;

  if (!nombre || !area_id) {
    return res.status(400).json({ error: "Faltan datos requeridos para crear el cargo" });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("cargos")
      .insert([{ nombre, personas: personas || 0, area_id }])
      .select()
      .single();

    if (error) throw error;

    console.log('✅ Cargo creado:', data);
    res.status(201).json(data);
  } catch (error) {
    console.error("❌ Error al crear cargo:", error);
    res.status(500).json({ error: "Error al crear cargo", detalle: error.message });
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
    res.status(500).json({ error: "Error al obtener cargos", detalle: error.message });
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
    res.status(500).json({ error: "Error al obtener subcargos", detalle: error.message });
  }
});

// Obtener todos los subcargos
app.get("/subcargos", async (req, res) => {
  try {
    const { data, error } = await supabase.from("subcargos").select("*");

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error("❌ Error al obtener subcargos:", error);
    res.status(500).json({ error: "Error al obtener subcargos", detalle: error.message });
  }
});

// Crear nuevo subcargo
app.post("/subcargos", async (req, res) => {
  const { nombre, personas, cargo_id } = req.body;

  if (!nombre || !cargo_id) {
    return res.status(400).json({ error: "Faltan datos requeridos para crear el subcargo" });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("subcargos")
      .insert([{ nombre, personas: personas || 0, cargo_id }])
      .select()
      .single();

    if (error) throw error;

    console.log('✅ Subcargo creado:', data);
    res.status(201).json(data);
  } catch (error) {
    console.error("❌ Error al crear subcargo:", error);
    res.status(500).json({ error: "Error al crear subcargo", detalle: error.message });
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
    res.status(500).json({ error: "Error al eliminar subcargo", detalle: error.message });
  }
});

// Obtener todos los usuarios
app.get("/usuarios", async (req, res) => {
  try {
    const { data, error } = await supabase.from("usuarios").select("*");

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error al obtener usuarios", detalle: error.message });
  }
});

// Crear área nueva
app.post("/areas", async (req, res) => {
  const { nombre, empresa_id } = req.body;

  if (!nombre || !empresa_id) {
    return res.status(400).json({ error: "Faltan datos requeridos para crear el área" });
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
    res.status(500).json({ error: "Error al crear área", detalle: error.message });
  }
});

// Iniciar servidor
app.listen(3000, () => {
  console.log("🚀 Servidor corriendo en http://localhost:3000");
});