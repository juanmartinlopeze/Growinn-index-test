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

    const areaNames = areas.map(a => a.nombre);
    const areaMap = Object.fromEntries(areas.map(a => [a.id, a.nombre]));

    // 2️⃣ Traer cargos (incluye número de personas) vinculados a esas áreas
    const areaIds = areas.map(a => a.id);
    const { data: cargos, error: errCargos } = await supabaseAdmin
      .from("cargos")
      .select("id, nombre, jerarquia_id, area_id, personas")
      .in("area_id", areaIds);
    if (errCargos) throw errCargos;

    // 3️⃣ Traer subcargos relacionados
    const cargoIds = cargos.map(c => c.id);
    const { data: subcargos, error: errSubs } = await supabaseAdmin
      .from("subcargos")
      .select("id, nombre, personas, cargo_id")
      .in("cargo_id", cargoIds);
    if (errSubs) throw errSubs;

    // 4️⃣ Preparar el libro y hoja con estilos
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Estructura");

    sheet.columns = [
      { header: "Nombre completo", key: "nombre", width: 25 },
      { header: "Número de Cédula", key: "cedula", width: 20 },
      { header: "Correo", key: "correo", width: 30 },
      { header: "Cargo", key: "cargo", width: 30 },
      { header: "Área", key: "area", width: 20 },
      { header: "Código de área", key: "codigo_area", width: 15 },
      { header: "Jerarquía", key: "jerarquia", width: 15 },
    ];

    // Freeze header and add autofilter
    sheet.views = [{ state: 'frozen', ySplit: 1 }];
    sheet.autoFilter = 'A1:G1';

    // Bold header row
    sheet.getRow(1).font = { bold: true };

    // 5️⃣ Rellenar filas: cargos con y sin subcargos
    for (const cargo of cargos) {
      const areaNombre = areaMap[cargo.area_id] || "Desconocida";
      const codigo_area = areaNames.findIndex(n => n === areaNombre) + 1;
      const jerarquiaLabel = `Jerarquía ${cargo.jerarquia_id?.replace(/^J/, '')}`;

      const subs = subcargos.filter(s => s.cargo_id === cargo.id);
      if (subs.length) {
        for (const sub of subs) {
          const text = `${cargo.nombre} - ${sub.nombre}`;
          const veces = sub.personas || 1;
          for (let i = 0; i < veces; i++) {
            sheet.addRow({
              nombre: "",
              cedula: "",
              correo: "",
              cargo: text,
              area: areaNombre,
              codigo_area,
              jerarquia: jerarquiaLabel
            });
          }
        }
      } else {
        const veces = cargo.personas || 1;
        for (let i = 0; i < veces; i++) {
          sheet.addRow({
            nombre: "",
            cedula: "",
            correo: "",
            cargo: cargo.nombre,
            area: areaNombre,
            codigo_area,
            jerarquia: jerarquiaLabel
          });
        }
      }
    }

    // 6️⃣ Enviar Excel al cliente
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