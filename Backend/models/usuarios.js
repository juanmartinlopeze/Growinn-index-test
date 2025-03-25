const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Importa la conexión a la base de datos

const Usuario = sequelize.define('usuarios', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'usuarios', // Nombre de la tabla en la base de datos
  timestamps: false // Cambia a "true" si quieres createdAt y updatedAt
});

module.exports = Usuario;
