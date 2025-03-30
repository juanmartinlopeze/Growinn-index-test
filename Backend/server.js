const express = require("express");
const cors = require("cors");
const sequelize = require("./db");
const Empresa = require("./models/empresa");
const Usuario = require("./models/usuarios");
const Rol = require("./models/rol");

const app = express();
app.use(express.json());
app.use(cors());

// Sincronizar la base de datos sin eliminar datos existentes
sequelize.sync({ alter: true }).then(() => {
  console.log("✅ Base de datos sincronizada");
});

app.post("/empresas", async (req, res) => {
  try {
    const { empleados, jerarquia1, jerarquia2, jerarquia3, jerarquia4, areas } = req.body;
    if (!empleados || !jerarquia1 || !jerarquia2 || !jerarquia3 || !jerarquia4 || !areas) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }
    const empresa = await Empresa.create({ empleados, jerarquia1, jerarquia2, jerarquia3, jerarquia4, areas });
    res.status(201).json(empresa);
  } catch (error) {
    res.status(500).json({ error: "Error al crear empresa" });
  }
});

app.get("/empresas", async (req, res) => {
  try {
    const empresas = await Empresa.findAll();
    res.status(200).json(empresas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener empresas" });
  }
});

app.put("/empresas/:id", async (req, res) => {
  const { id } = req.params;
  const { area_nombres } = req.body;

  try {
    const empresa = await Empresa.findByPk(id);
    if (!empresa) {
      return res.status(404).json({ error: "Empresa no encontrada" });
    }

    empresa.area_nombres = area_nombres;
    await empresa.save();

    res.json({ message: "Área(s) actualizada(s)", empresa });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar la empresa" });
  }
});

app.post("/roles", async (req, res) => {
  try {
    const { area, jerarquia, position, employees, subcargos } = req.body;

    if (!area || !jerarquia || !position || !employees || !subcargos) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }

    const rol = await Rol.create({ area, jerarquia, position, employees, subcargos });
    res.status(201).json(rol);
  } catch (error) {
    console.error("Error al crear rol:", error);
    res.status(500).json({ error: "Error al crear rol" });
  }
});

app.get("/roles", async (req, res) => {
  try {
    const roles = await Rol.findAll();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener roles" });
  }
});

app.listen(3000, () => {
  console.log("🚀 Servidor corriendo en http://localhost:3000");
});
