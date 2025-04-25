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
      empleados,
      jerarquia1,
      jerarquia2,
      jerarquia3,
      jerarquia4,
      areas,
      areas_nombres,
    } = req.body;

    if (
      !empleados ||
      !jerarquia1 ||
      !jerarquia2 ||
      !jerarquia3 ||
      !jerarquia4 ||
      !areas
    ) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }

    const { data, error } = await supabaseAdmin
      .from("Empresa")
      .insert([{ empleados, jerarquia1, jerarquia2, jerarquia3, jerarquia4, areas, areas_nombres }]);

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    console.error("❌ Error al crear empresa:", error);
    res.status(500).json({ error: "Error al crear empresa", detalle: error.message });
  }
});

// Obtener todas las empresas
app.get("/empresas", async (req, res) => {
  try {
    const { data, error } = await supabase.from("Empresa").select("*");
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

  try {
    const { data, error } = await supabaseAdmin
      .from("areas")
      .update({nombre})
      .eq("id", id);

    if (error) throw error;

    res.json({ message: "Área(s) actualizada(s)", empresa: data });
  } catch (error) {
    console.error("❌ Error al actualizar empresa:", error);
    res.status(500).json({ error: "Error al actualizar la empresa" });
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

  try {
    const { data, error } = await supabaseAdmin
      .from("usuarios")
      .update({ nombre, jerarquia, area_id, empresa_id, subcargo_id })
      .eq("id", id);

    if (error) throw error;

    res.json({ message: "Usuario actualizado correctamente", usuario: data });
  } catch (error) {
    console.error("❌ Error al actualizar usuario:", error);
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
});

// Eliminar un usuario
app.delete("/usuarios/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabaseAdmin
      .from("usuarios")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.status(200).json({ message: "Usuario eliminado correctamente", data });
  } catch (error) {
    console.error("❌ Error al eliminar usuario:", error);
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
});

// Iniciar servidor
app.listen(3000, () => {
  console.log("🚀 Servidor corriendo en http://localhost:3000");
});