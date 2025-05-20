const express = require('express');
const router = express.Router();
const multer = require('multer');
const ExcelJS = require('exceljs');
const { supabaseAdmin } = require('../supabase/supabase');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload-excel', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No se subió ningún archivo' });

    // 1️⃣ Leer Excel
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);
    const sheet = workbook.worksheets[0];

    // 2️⃣ Cargar catálogos desde Supabase
    const { data: areas, error: errAreas } = await supabaseAdmin
      .from('areas')
      .select('id, nombre')
      .eq('empresa_id', req.body.empresaId);
    if (errAreas) throw errAreas;
    const areaMap = Object.fromEntries(areas.map(a => [a.nombre, a.id]));

    const { data: cargos, error: errCargos } = await supabaseAdmin
      .from('cargos')
      .select('id, nombre, jerarquia_id, area_id')
      .in('area_id', areas.map(a => a.id));
    if (errCargos) throw errCargos;
    const cargoMap = Object.fromEntries(cargos.map(c => [c.nombre, c]));

    // 3️⃣ Leer filas y validar
    const warnings = [];
    const rowsToInsert = [];

    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // salta header
      const [
        nombre,
        cedula,
        correo,
        cargoName,
        areaName,
        codigoArea,
        jerarquiaText
      ] = row.values.slice(1);

      const rowIssues = [];
      if (!nombre) rowIssues.push('nombre vacío');
      if (!cedula) rowIssues.push('cédula vacía');
      if (!correo) rowIssues.push('correo vacío');

      const areaId = areaMap[areaName];
      if (!areaId) rowIssues.push(`área “${areaName}” no existe`);

      const cargo = cargoMap[cargoName];
      if (!cargo) {
        rowIssues.push(`cargo “${cargoName}” no existe`);
      } else if (cargo.area_id !== areaId) {
        rowIssues.push(`cargo “${cargoName}” no pertenece al área “${areaName}”`);
      }

      // jerarquía extraída de texto: “Jerarquía 2” → “J2”
      const match = jerarquiaText?.match(/Jerarqu[ií]a\s+(\d+)/i);
      const jerarquiaId = match ? `J${match[1]}` : null;
      if (!jerarquiaId || (cargo && cargo.jerarquia_id !== jerarquiaId)) {
        rowIssues.push(`jerarquía “${jerarquiaText}” no coincide`);
      }

      if (rowIssues.length) {
        warnings.push({ row: rowNumber, issues: rowIssues });
      } else {
        // Preparamos objeto a insertar vinculando por ID
        rowsToInsert.push({
          nombre_completo: nombre,
          cedula,
          correo,
          cargo_id:      cargo.id,
          area_id:       areaId,
          jerarquia_id:  jerarquiaId,
          empresa_id:    req.body.empresaId
        });
      }
    });

    // 4️⃣ Si hay advertencias, no insertamos
    if (warnings.length) {
      return res.status(400).json({ warnings });
    }

    // 5️⃣ Insertar todos los usuarios nuevos
    const { data: inserted, error: errInsert } = await supabaseAdmin
      .from('usuarios')
      .insert(rowsToInsert);
    if (errInsert) throw errInsert;

    return res.json({ inserted: inserted.length });
  } catch (error) {
    console.error('❌ Error procesando Excel:', error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;