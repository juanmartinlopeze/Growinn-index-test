const express = require("express");
const router = express.Router();
const ExcelJS = require("exceljs");
const { supabaseAdmin } = require("../supabase/supabase");

router.get("/excel/:empresaId", async (req, res) => {
  const { empresaId } = req.params;

  try {
    console.log("🔍 Generando Excel para empresa:", empresaId);

    // 1️⃣ Traer todas las áreas de la empresa
    const { data: areas, error: errAreas } = await supabaseAdmin
      .from("areas")
      .select("id, nombre")
      .eq("empresa_id", empresaId);
    if (errAreas) throw errAreas;

    // Extraemos el array de nombres en el orden que nos da la DB
    const areaNames = areas.map(a => a.nombre);

    // Map id → nombre
    const areaMap = Object.fromEntries(areas.map(a => [a.id, a.nombre]));

    // 2️⃣ Traer todos los cargos vinculados a esas áreas
    const areaIds = areas.map(a => a.id);
    const { data: cargos, error: errCargos } = await supabaseAdmin
      .from("cargos")
      .select("id, nombre, jerarquia_id, area_id")
      .in("area_id", areaIds);
    if (errCargos) throw errCargos;

    // 3️⃣ Traer todos los subcargos para esos cargos
    const cargoIds = cargos.map(c => c.id);
    const { data: subcargos, error: errSubs } = await supabaseAdmin
      .from("subcargos")
      .select("nombre, personas, cargo_id")
      .in("cargo_id", cargoIds);
    if (errSubs) throw errSubs;

    // 4️⃣ Prepara el Excel
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Estructura");
    sheet.columns = [
      { header: "Nombre completo", key: "nombre", width: 25 },
      { header: "Número de Cédula", key: "cedula", width: 20 },
      { header: "Correo", key: "correo", width: 30 },
      { header: "Cargo", key: "cargo", width: 25 },
      { header: "Área", key: "area", width: 20 },
      { header: "Código de área", key: "codigo_area", width: 15 },
      { header: "Jerarquía", key: "jerarquia", width: 15 },
    ];

    // 5️⃣ Agrega filas: por cada subcargo, N veces ‘personas’
    for (const sub of subcargos) {
      const cargo = cargos.find(c => c.id === sub.cargo_id);
      const areaNombre = areaMap[cargo.area_id] || "Desconocida";
      // buscamos su índice dentro de areaNames
      const codigo_area = areaNames.findIndex(n => n === areaNombre) + 1;
      const jerarquiaLabel = `Jerarquía ${
        cargo.jerarquia_id?.replace("J", "") || cargo.jerarquia_id
      }`;

      for (let i = 0; i < (sub.personas || 1); i++) {
        sheet.addRow({
          nombre:      "",
          cedula:      "",
          correo:      "",
          cargo:       cargo.nombre,
          area:        areaNombre,
          codigo_area,
          jerarquia:   jerarquiaLabel
        });
      }
    }

    // 6️⃣ Envía el Excel al cliente
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=estructura_empresa_${empresaId}.xlsx`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    await workbook.xlsx.write(res);
    res.end();
    console.log("✅ Excel enviado correctamente");

  } catch (error) {
    console.error("❌ Error al generar Excel:", error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

module.exports = router;
