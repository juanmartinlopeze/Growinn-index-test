const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Empresa = sequelize.define(
    "Empresa", {
  empleados: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  jerarquia1: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  jerarquia2: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  jerarquia3: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  jerarquia4: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  areas: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Empresa;
