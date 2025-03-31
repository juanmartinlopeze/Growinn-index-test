const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Rol = sequelize.define("Rol", {
  area: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  jerarquia: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  position: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  employees: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  subcargos: {
    type: DataTypes.STRING,
    allowNull: true,
  }
});

module.exports = Rol;
