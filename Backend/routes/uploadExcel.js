const express = require('express');
const router = express.Router();
const multer = require('multer');
const ExcelJS = require('exceljs');
const { supabaseAdmin } = require('../supabase/supabase');

// Configura multer (en memoria)
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload-excel', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ningún archivo' });
    }

    // 1️⃣ Leer el buffer con ExcelJS
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);
    const sheet = workbook.worksheets[0];

    // 2️⃣ Iterar filas (saltando encabezado)
    const rows = [];
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // header
      const [
        nombreCell,
        cedulaCell,
        correoCell,
        cargoCell,
        areaCell,
        codigoAreaCell,
        jerarquiaCell
      ] = row.values.slice(1); // row.values[0] es null

      rows.push({
        nombre:   nombreCell || '',
        cedula:   cedulaCell || '',
        correo:   correoCell || '',
        cargo:    cargoCell || '',
        area:     areaCell || '',
        codigo_area: codigoAreaCell || null,
        jerarquia: jerarquiaCell || ''
      });
    });

    // 3️⃣ Validación básica
    const invalid = rows.find(r => !r.nombre || !r.cedula || !r.correo);
    if (invalid) {
      return res.status(400).json({ error: 'Hay filas sin nombre, cédula o correo.' });
    }

    // 4️⃣ Insertar en Supabase (tabla `usuarios`)
    // Ajusta la tabla y campos a tu esquema real
    const insertData = rows.map(r => ({
      nombre_completo: r.nombre,
      cedula:          r.cedula,
      correo:          r.correo,
      cargo:           r.cargo,
      area:            r.area,
      codigo_area:     r.codigo_area,
      jerarquia:       r.jerarquia,
      empresa_id:      req.body.empresaId || null  // si lo envías desde el frontend
    }));

    const { data, error } = await supabaseAdmin
      .from('usuarios')
      .insert(insertData);

    if (error) throw error;

    return res.json({ inserted: data.length });
  } catch (error) {
    console.error('❌ Error procesando Excel:', error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
