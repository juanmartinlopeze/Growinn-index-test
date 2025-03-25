const express = require('express');
const sequelize = require('./db');
const Usuario = require('./models/usuarios');

const app = express();

app.use(express.json()); // Para recibir JSON en las peticiones

// 🟢 Obtener todos los usuarios
app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});

// 🟢 Guardar un nuevo usuario
app.post('/usuarios', async (req, res) => {
  try {
    const { name } = req.body;
    const nuevoUsuario = await Usuario.create({ name });
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
});

app.listen(3000, () => {
  console.log('🚀 Servidor corriendo en http://localhost:3000');
});
