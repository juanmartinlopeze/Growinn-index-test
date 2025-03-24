// Requerir dependencias
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Configuración de dotenv para cargar variables de entorno
dotenv.config();

// Inicializar la app de express
const app = express();

// Usar middlewares
app.use(cors());
app.use(express.json());

// Requerir la configuración de la base de datos
const sequelize = require('./config/db'); // Aquí se importa la configuración de la base de datos

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡Servidor en funcionamiento!');
});

// Conectar al servidor de base de datos si es necesario
// Ya lo hemos hecho con el `require('./config/db')`

// Puerto donde el servidor escuchará
const PORT = process.env.PORT || 5000;

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
