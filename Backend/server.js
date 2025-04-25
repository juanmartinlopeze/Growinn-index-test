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

    // 1. Crear empresa
    const { data: empresaData, error: empresaError } = await supabaseAdmin
      .from("empresas")
      .insert([{ nombre, cantidad_empleados: empleados, jerarquia: 4, jerarquia1, jerarquia2, jerarquia3, jerarquia4 }])
      .select("id") // para obtener el ID
      .single();

    if (empresaError) throw empresaError;

    const empresa_id = empresaData.id;

    // 2. Insertar áreas relacionadas con la empresa
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
    const { data, error } = await supabase.from("empresa").select("*");
    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error("❌ Error al obtener empresas:", error);
    res.status(500).json({ error: "Error al obtener empresas" });
  }
});

// Actualizar nombres de áreas de una empresa
app.put("/areas/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;

  if (!nombre || nombre.trim() === "") {
    return res.status(400).json({ error: "El nombre del área es requerido" });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("areas")
      .update({ nombre })
      .eq("id", id)
      .select()
      .single(); 

    if (error) throw error;

    res.json({ message: "Área actualizada correctamente", area: data });
  } catch (error) {
    console.error("❌ Error al actualizar área:", error);
    res.status(500).json({ error: "Error al actualizar el área", detalle: error.message });
  }
});

// Crear un usuario
app.post("/usuarios", async (req, res) => {
  try {
    const { nombre, jerarquia, area_id, empresa_id, subcargo_id } = req.body;

    if (!nombre || !jerarquia || !empresa_id) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }

    const { data, error } = await supabaseAdmin
      .from("usuarios")
      .insert([{ nombre, jerarquia, area_id, empresa_id, subcargo_id }]);

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    console.error("❌ Error al crear usuario:", error);
    res.status(500).json({ error: "Error al crear usuario", detalle: error.message });
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
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

// Actualizar un usuario
app.put("/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, jerarquia, area_id, empresa_id, subcargo_id } = req.body;

  if (!nombre || nombre.trim() === "") {
    return res.status(400).json({ error: "El nombre del usuario es requerido" });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("usuarios")
      .update({ nombre, jerarquia, area_id, empresa_id, subcargo_id })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    res.json({ message: "Usuario actualizado correctamente", usuario: data });
  } catch (error) {
    console.error("❌ Error al actualizar usuario:", error);
    res.status(500).json({ error: "Error al actualizar usuario", detalle: error.message });
  }
});


// Eliminar un usuario
app.delete("/usuarios/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "ID del usuario requerido" });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("usuarios")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar usuario:", error);
    res.status(500).json({ error: "Error al eliminar usuario", detalle: error.message });
  }
});

// 📦 Obtener cargos por área
app.get("/cargos/area/:areaId", async (req, res) => {
  const { areaId } = req.params;
  try {
    const { data, error } = await supabase
      .from("cargos")
      .select("*")
      .eq("area_id", areaId);
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error("❌ Error al obtener cargos:", error);
    res.status(500).json({ error: "Error al obtener cargos", detalle: error.message });
  }
});

// 📦 Obtener subcargos por cargo
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
    console.error("❌ Error al obtener subcargos:", error);
    res.status(500).json({ error: "Error al obtener subcargos", detalle: error.message });
  }
});
// Crear área nueva (usado por handleAddArea)
app.post('/areas', async (req, res) => {
  const { nombre, empresa_id } = req.body;
  if (!nombre || !empresa_id) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }
  try {
    const { data, error } = await supabaseAdmin
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


// ✅ Crear nuevo subcargo
app.post("/subcargos", async (req, res) => {
  const { nombre, personas, cargo_id } = req.body;
  if (!nombre || !cargo_id) {
    return res.status(400).json({ error: "Faltan datos requeridos" });
  }
  try {
    const { data, error } = await supabaseAdmin
      .from("subcargos")
      .insert([{ nombre, personas, cargo_id }])
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error("❌ Error al crear subcargo:", error);
    res.status(500).json({ error: "Error al crear subcargo", detalle: error.message });
  }
});

// 🗑️ Eliminar subcargo
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


// Iniciar servidor
app.listen(3000, () => {
  console.log("🚀 Servidor corriendo en http://localhost:3000");
});