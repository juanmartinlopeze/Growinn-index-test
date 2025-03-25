const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Usuario = sequelize.define(
  "usuarios",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "usuarios",
    timestamps: false,
  }
);

module.exports = Usuario;
