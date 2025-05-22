// routes/uploadExcel.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const ExcelJS = require('exceljs');
const { supabaseAdmin } = require('../supabase/supabase');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload-excel', upload.single('file'), async (req, res) => {
  try {
    const empresaId = req.body.empresaId;
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ningún archivo' });
    }
    if (!empresaId) {
      return res.status(400).json({ error: 'Falta el parámetro empresaId' });
    }

    // 1️⃣ Leer Excel
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);
    const sheet = workbook.worksheets[0];
    if (!sheet) {
      return res.status(400).json({ error: 'El Excel no contiene ninguna hoja' });
    }

    // 2️⃣ Traer áreas y cargos de Supabase
    const { data: areas, error: errAreas } = await supabaseAdmin
      .from('areas')
      .select('id, nombre')
      .eq('empresa_id', empresaId);
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
      if (rowNumber === 1) return; // salta cabecera

      // Defensivamente: row.values puede ser null
      const raw = row.values || [];
      // extraigo valores desde la columna 1 (ignoro índice 0)
      const vals = raw.slice(1);
      // si no hay celdas o todas están vacías, salto
      if (!Array.isArray(vals) || vals.length === 0 || vals.every(v => v == null || v === '')) {
        return;
      }

      const [nombre, cedula, correo, cargoName, areaName, , jerarquiaText] = vals;
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

      // “Jerarquía N” → “JN”
      const m = jerarquiaText?.match(/Jerarqu[ií]a\s+(\d+)/i);
      const jerarquiaId = m ? `J${m[1]}` : null;
      if (!jerarquiaId || (cargo && cargo.jerarquia_id !== jerarquiaId)) {
        rowIssues.push(`jerarquía “${jerarquiaText}” no coincide`);
      }

      if (rowIssues.length) {
        warnings.push({ row: rowNumber, issues: rowIssues });
      } else {
        rowsToInsert.push({
          empresa_id:      parseInt(empresaId, 10),
          area_id:         areaId,
          cargo_id:        cargo.id,
          jerarquia_id:    jerarquiaId,
          nombre_completo: nombre,
          cedula,
          correo
        });
      }
    });

    // 4️⃣ Si hay advertencias, las devolvemos
    if (warnings.length) {
      return res.status(400).json({ warnings });
    }

    // 4.1️⃣ Sin filas válidas
    if (rowsToInsert.length === 0) {
      return res.status(400).json({ error: 'No se encontraron filas válidas en el Excel.' });
    }

    // 5️⃣ Insertar en 'empleados'
    const { data: inserted, error: errInsert } = await supabaseAdmin
      .from('empleados')
      .insert(rowsToInsert);
    if (errInsert) throw errInsert;

    return res.json({ inserted: inserted.length });
  } catch (error) {
    console.error('❌ Error procesando Excel:', error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
