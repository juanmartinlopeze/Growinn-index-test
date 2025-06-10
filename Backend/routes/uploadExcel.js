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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const warnings = [];
    const rowsToInsert = [];

    // 3️⃣ Validar cada fila con nuevo mapeo de columnas (sin subcargo)
    // Columnas:
    // A(1): Nombre completo
    // B(2): Número de cédula
    // C(3): Correo
    // D(4): Cargo (puede traer "Principal - Subcargo" solo visual)
    // E(5): Área (nombre)
    // F(6): Código de área (solo referencia, no se usa para validación)
    // G(7): Jerarquía
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;

      const nombre = String(row.getCell(1).value || '').trim();
      const cedula = String(row.getCell(2).value || '').trim();
      const rawCorreo = row.getCell(3).value;
      const correo = rawCorreo && typeof rawCorreo === 'object' && rawCorreo.text
        ? rawCorreo.text.trim()
        : String(rawCorreo || '').trim();

      // Detectar cargo principal ignorando subcargo visual
      const fullCargoValue = String(row.getCell(4).value || '').trim();
      let cargoExcelName = fullCargoValue;
      if (fullCargoValue.includes(' - ')) {
        cargoExcelName = fullCargoValue.split(' - ')[0].trim();
      }

      const areaName = String(row.getCell(5).value || '').trim();
      // const codigoArea = String(row.getCell(6).value || '').trim(); // opcional
      const jerarquiaText = String(row.getCell(7).value || '').trim();

      const issues = [];

      // Validaciones básicas
      if (!nombre) issues.push('nombre vacío');
      if (!cedula) issues.push('cédula vacía');
      if (!correo) issues.push('correo vacío');
      else if (!emailRegex.test(correo)) issues.push(`correo “${correo}” inválido`);

      // Validar área
      const areaId = areaMap[areaName] || null;
      if (!areaName) issues.push('área vacía');
      else if (!areaId) issues.push(`área “${areaName}” no existe`);

      // Validar cargo principal
      let finalCargoId = null;
      let finalJerarquiaId = null;
      const associatedCargo = cargoMap[cargoExcelName];
      if (associatedCargo) {
        finalCargoId = associatedCargo.id;
        finalJerarquiaId = associatedCargo.jerarquia_id;
        if (areaId && associatedCargo.area_id !== areaId) {
          issues.push(`cargo “${cargoExcelName}” no pertenece al área “${areaName}”`);
        }
      } else {
        issues.push(`cargo “${cargoExcelName}” no existe`);
      }

      // Validar jerarquía
      const match = jerarquiaText.match(/(\d+)/);
      const jerarquiaIdFromExcel = match ? `J${match[1]}` : null;
      if (!jerarquiaText) issues.push('jerarquía vacía');
      else if (!jerarquiaIdFromExcel) issues.push(`jerarquía “${jerarquiaText}” mal formateada`);
      else if (associatedCargo && associatedCargo.jerarquia_id !== jerarquiaIdFromExcel) {
        issues.push(`jerarquía “${jerarquiaText}” no coincide para el cargo “${cargoExcelName}” (esperado: ${associatedCargo.jerarquia_id})`);
      }

      if (issues.length) {
        warnings.push({ row: rowNumber, issues });
      } else {
        rowsToInsert.push({
          empresa_id:      parseInt(empresaId, 10),
          area_id:         areaId,
          cargo_id:        finalCargoId,
          jerarquia_id:    finalJerarquiaId,
          nombre_completo: nombre,
          cedula,
          correo
        });
      }
    });

    // 4️⃣ Devolver warnings si existen
    if (warnings.length) return res.status(400).json({ warnings });
    if (!rowsToInsert.length) return res.status(400).json({ error: 'No se encontraron filas válidas en el Excel.' });

    // 5️⃣ Insertar en usuarios
    const { error: errInsert } = await supabaseAdmin
      .from('usuarios')
      .insert(rowsToInsert);
    if (errInsert) throw errInsert;

    return res.json({ message: 'Todos los registros fueron validados e insertados correctamente.' });

  } catch (error) {
    console.error('❌ Error procesando Excel:', error);
    return res.status(500).json({ error: error.message, stack: error.stack });
  }
});

module.exports = router;
