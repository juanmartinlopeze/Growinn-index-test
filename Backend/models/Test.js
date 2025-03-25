const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Asegúrate de que la ruta es correcta

const Test = sequelize.define('Test', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'usuarios', // Nombre de la tabla en la BD
  timestamps: false, // Evita crear `createdAt` y `updatedAt`
});

module.exports = Test; // Solo exporta el modelo, NO lo uses aquí
