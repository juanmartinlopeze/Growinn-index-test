const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Empresa = require("./empresa");

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
    type: DataTypes.JSON,
    allowNull: true,
  },
  empresaId: { 
    type: DataTypes.INTEGER,
    allowNull: false,
  }
});

module.exports = Rol;
