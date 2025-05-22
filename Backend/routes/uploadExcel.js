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

      const raw = row.values || [];
      const vals = raw.slice(1);
      if (!Array.isArray(vals) || vals.every(v => v == null || v === '')) {
        return; // fila vacía
      }

      const [nombre, cedula, correo, cargoName, areaName, , jerarquiaText] = vals;
      const issues = [];

      if (!nombre)   issues.push('nombre vacío');
      if (!cedula)   issues.push('cédula vacía');
      if (!correo)   issues.push('correo vacío');

      const areaId = areaMap[areaName];
      if (!areaId) issues.push(`área “${areaName}” no existe`);

      const cargo = cargoMap[cargoName];
      if (!cargo) {
        issues.push(`cargo “${cargoName}” no existe`);
      } else if (cargo.area_id !== areaId) {
        issues.push(`cargo “${cargoName}” no pertenece al área “${areaName}”`);
      }

      const m = jerarquiaText?.match(/Jerarqu[ií]a\s+(\d+)/i);
      const jerarquiaId = m ? `J${m[1]}` : null;
      if (!jerarquiaId || (cargo && cargo.jerarquia_id !== jerarquiaId)) {
        issues.push(`jerarquía “${jerarquiaText}” no coincide`);
      }

      if (issues.length) {
        warnings.push({ row: rowNumber, issues });
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

    // 4️⃣ Devolver warnings si los hay
    if (warnings.length) {
      return res.status(400).json({ warnings });
    }
    if (rowsToInsert.length === 0) {
      return res.status(400).json({ error: 'No se encontraron filas válidas en el Excel.' });
    }

    // 5️⃣ Insertar en la nueva tabla singular "usuario"
    const { data: inserted, error: errInsert } = await supabaseAdmin
      .from('usuario')
      .insert(rowsToInsert);
    if (errInsert) throw errInsert;

    return res.json({ inserted: inserted.length });
  } catch (error) {
    console.error('❌ Error procesando Excel:', error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
//wuenasessssssssssssssssssssss SIUUUUUUUUUUUUUUU