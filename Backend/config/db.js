require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    logging: false // Desactiva logs de SQL
  }
);

// Prueba la conexión
sequelize.authenticate()
  .then(() => console.log('✅ Conexión establecida con PostgreSQL'))
  .catch(err => console.error('❌ Error al conectar con PostgreSQL:', err));

module.exports = sequelize;