const Empresa = require("./empresa");
const Rol = require("./rol");

Rol.belongsTo(Empresa, { foreignKey: "empresaId", onDelete: "CASCADE" });
Empresa.hasMany(Rol, { foreignKey: "empresaId" });

module.exports = { Empresa, Rol };