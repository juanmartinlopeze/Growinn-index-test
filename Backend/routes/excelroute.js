const express = require("express");
const router = express.Router();
const ExcelJS = require("exceljs");
const Rol = require("../models/rol");
const Empresa = require("../models/empresa"); // importar empresa

router.get("/excel/:empresaId", async (req, res) => {
  const { empresaId } = req.params;
  try {
    // 🏢 Cargar la empresa para obtener el orden de las áreas
    const empresa = await Empresa.findByPk(empresaId);
    if (!empresa) return res.status(404).json({ error: "Empresa no encontrada" });

    const areasNombres = empresa.areas_nombres || [];

    // Obtener roles de la empresa
    const roles = await Rol.findAll({ where: { empresaId } });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Estructura");

    worksheet.columns = [
      { header: "Nombre completo", key: "nombre", width: 25 },
      { header: "Número de Cédula", key: "cedula", width: 20 },
      { header: "Correo", key: "correo", width: 30 },
      { header: "Cargo", key: "cargo", width: 25 },
      { header: "Área", key: "area", width: 20 },
      { header: "Código de área", key: "codigo_area", width: 15 },
      { header: "Jerarquía", key: "jerarquia", width: 15 }
    ];

    roles.forEach(rol => {
      const subcargos = rol.subcargos || [];

      // ✅ Buscar el índice del área en el array de nombres de área
      const codigo_area = areasNombres.findIndex(nombre => nombre === rol.area) + 1;

      subcargos.forEach(sub => {
        const cantidad = sub.employees || 1;
        for (let i = 0; i < cantidad; i++) {
          worksheet.addRow({
            nombre: "",
            cedula: "",
            correo: "",
            cargo: sub.name || rol.position,
            area: rol.area,
            codigo_area: codigo_area || 0,
            jerarquia: `Jerarquía ${rol.jerarquia.replace("J", "")}`
          });
        }
      });
    });

    res.setHeader("Content-Disposition", `attachment; filename=estructura_empresa_${empresaId}.xlsx`);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("❌ Error al generar Excel:", error);
    res.status(500).json({ error: "Error al generar el archivo Excel" });
  }
});

module.exports = router;
