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
      areas_nombres
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
      areas_nombres: areas_nombres || []
    });

    res.status(201).json(empresa); // ✅ IMPORTANTE
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

app.get("/roles/:empresaId", async (req, res) => {
  const { empresaId } = req.params;
  console.log("🔍 Buscando roles para empresaId:", empresaId);
  try {
    const roles = await Rol.findAll({ where: { empresaId } });
    res.status(200).json(roles);
  } catch (err) {
    console.error("Error al obtener roles:", err);
    res.status(500).json({ error: "Error al obtener roles", detalle: err.message });
  }
});



// Iniciar servidor
app.listen(3000, () => {
  console.log("🚀 Servidor corriendo en http://localhost:3000");
});
