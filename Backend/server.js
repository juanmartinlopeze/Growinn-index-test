const express = require("express");
const cors = require("cors");
const sequelize = require("./db");
const { Empresa, Rol } = require("./models/associations");

const app = express();
app.use(express.json());
app.use(cors());

// Sincronizar la base de datos sin eliminar datos existentes
sequelize.sync({ alter: true }).then(() => {
  console.log("✅ Base de datos sincronizada");
});

// Crear nueva empresa
app.post("/empresas", async (req, res) => {
  try {
    console.log("📦 Datos recibidos:", req.body);
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
      empleados == null ||
      jerarquia1 == null ||
      jerarquia2 == null ||
      jerarquia3 == null ||
      jerarquia4 == null ||
      areas == null
    ) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }

    const empresa = await Empresa.create({
      empleados,
      jerarquia1,
      jerarquia2,
      jerarquia3,
      jerarquia4,
      areas,
      areas_nombres: areas_nombres || [],
    });

    res.status(201).json(empresa);
  } catch (error) {
    console.error("❌ Error al crear empresa:", error);
    res.status(500).json({ error: "Error al crear empresa", detalle: error.message });
  }
});

// Obtener todas las empresas
app.get("/empresas", async (req, res) => {
  try {
    const empresas = await Empresa.findAll();
    res.status(200).json(empresas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener empresas" });
  }
});

// Actualizar nombres de áreas de una empresa
app.put("/empresas/:id", async (req, res) => {
  const { id } = req.params;
  const { areas_nombres } = req.body;

  try {
    const [updatedRows] = await Empresa.update(
      { areas_nombres },
      { where: { id } }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ error: "Empresa no encontrada o sin cambios" });
    }

    const empresaActualizada = await Empresa.findByPk(id);
    res.json({ message: "Área(s) actualizada(s)", empresa: empresaActualizada });
  } catch (err) {
    console.error("❌ Error al actualizar empresa:", err);
    res.status(500).json({ error: "Error al actualizar la empresa" });
  }
});

// Crear un nuevo rol
app.post("/roles", async (req, res) => {
  try {
    const { area, jerarquia, position, employees, subcargos, empresaId } = req.body;

    if (!area || !jerarquia || !position || !employees || !empresaId) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }

    const rol = await Rol.create({ area, jerarquia, position, employees, subcargos, empresaId });
    res.status(201).json(rol);
  } catch (error) {
    console.error("Error al crear rol:", error);
    res.status(500).json({ error: "Error al crear rol" });
  }
});

// Obtener todos los roles de una empresa por empresaId
app.get("/roles/empresa/:empresaId", async (req, res) => {
  const { empresaId } = req.params;
  try {
    const roles = await Rol.findAll({
      where: { empresaId },
    });
    res.status(200).json(roles);
  } catch (error) {
    console.error("❌ Error al obtener roles:", error);
    res.status(500).json({ error: "Error al obtener roles" });
  }
});

// Eliminar un rol completo por ID
app.delete("/roles/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Rol.destroy({ where: { id } });

    if (deleted === 0) {
      return res.status(404).json({ error: "Rol no encontrado" });
    }

    res.status(200).json({ message: "Rol eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar rol:", error);
    res.status(500).json({ error: "Error al eliminar rol" });
  }
});

// Eliminar un subcargo de un rol
app.delete("/roles/:rolId/subcargos/:subcargoName", async (req, res) => {
  const { rolId, subcargoName } = req.params;
  console.log("🧹 Eliminando subcargo:", subcargoName, "del rol", rolId);

  try {
    const rol = await Rol.findByPk(rolId);
    if (!rol) return res.status(404).json({ error: "Rol no encontrado" });

    const subcargos = rol.subcargos || [];
    const nuevosSubcargos = subcargos.filter((sub) => sub.name !== subcargoName);

    if (nuevosSubcargos.length === subcargos.length) {
      return res.status(404).json({ error: "Subcargo no encontrado" });
    }

    rol.subcargos = nuevosSubcargos;
    await rol.save();

    res.json({ message: "Subcargo eliminado correctamente", rol });
  } catch (error) {
    console.error("❌ Error al eliminar subcargo:", error);
    res.status(500).json({ error: "Error interno al eliminar subcargo" });
  }
});

// Eliminar un área específica de una empresa
app.delete("/areas/:empresaId/:areaName", async (req, res) => {
  const { empresaId, areaName } = req.params;

  try {
    console.log(`🧹 Eliminando área "${areaName}" de la empresa con ID ${empresaId}`);

    const empresa = await Empresa.findByPk(empresaId);
    if (!empresa) {
      return res.status(404).json({ error: "Empresa no encontrada" });
    }

    const areas = empresa.areas_nombres || [];
    if (!areas.includes(areaName)) {
      return res.status(404).json({ error: "Área no encontrada en la empresa" });
    }

    const updatedAreas = areas.filter((area) => area !== areaName);
    empresa.areas_nombres = updatedAreas;

    await empresa.save();

    res.status(200).json({ message: "Área eliminada correctamente", areas_nombres: updatedAreas });
  } catch (error) {
    console.error("❌ Error al eliminar el área:", error);
    res.status(500).json({ error: "Error al eliminar el área" });
  }
});

// Iniciar servidor
app.listen(3000, () => {
  console.log("🚀 Servidor corriendo en http://localhost:3000");
});