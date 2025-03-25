const express = require("express");
const cors = require("cors");
const sequelize = require("./db");
const Usuario = require("./models/usuarios");

const app = express();
app.use(express.json());
app.use(cors());

// Sincronizar la base de datos sin eliminar datos existentes
sequelize.sync({ alter: true }).then(() => {
  console.log("✅ Base de datos sincronizada");
});

// ✅ Ruta para crear un usuario (con nombre y email)
app.post("/usuarios", async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }
    const usuario = await Usuario.create({ name, email });
    res.status(201).json(usuario);
  } catch (error) {
    res.status(500).json({ error: "Error al crear usuario" });
  }
});

// ✅ Ruta para obtener todos los usuarios
app.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

app.listen(3000, () => {
  console.log("🚀 Servidor corriendo en http://localhost:3000");
});
