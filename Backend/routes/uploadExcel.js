const express = require('express');
const router = express.Router();
const multer = require('multer');
const ExcelJS = require('exceljs');
const { supabaseAdmin } = require('../supabase/supabase');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload-excel', upload.single('file'), async (req, res) => {
  try {
    const empresaId = req.body.empresaId;
    console.log("🔍 === UPLOAD EXCEL DEBUG ===");
    console.log("📊 EmpresaId recibido:", empresaId);
    console.log("📊 Archivo recibido:", req.file ? req.file.originalname : 'No');
    
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ningún archivo' });
    }
    if (!empresaId) {
      return res.status(400).json({ error: 'Falta el parámetro empresaId' });
    }

    // 🔍 Verificar que la empresa existe
    console.log("🔍 Verificando que empresa_id existe:", empresaId);
    const { data: empresa, error: errEmpresa } = await supabaseAdmin
      .from('empresas')
      .select('id, nombre')
      .eq('id', empresaId)
      .single();
    
    if (errEmpresa || !empresa) {
      console.log("❌ Empresa no encontrada:", errEmpresa);
      // Mostrar empresas disponibles para debug
      const { data: todasEmpresas } = await supabaseAdmin
        .from('empresas')
        .select('id, nombre')
        .limit(10);
      console.log("📊 Empresas disponibles:", todasEmpresas);
      
      return res.status(400).json({ 
        error: `La empresa con ID ${empresaId} no existe en la base de datos.`,
        empresasDisponibles: todasEmpresas?.map(e => `${e.id}: ${e.nombre}`) || []
      });
    }
    
    console.log("✅ Empresa encontrada:", empresa.nombre);

    // 1️⃣ Leer Excel
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);
    const sheet = workbook.worksheets[0];
    if (!sheet) {
      return res.status(400).json({ error: 'El Excel no contiene ninguna hoja' });
    }

    // 2️⃣ Traer áreas y cargos de Supabase
    console.log("🔍 Buscando áreas con empresa_id:", empresaId);
    const { data: areas, error: errAreas } = await supabaseAdmin
      .from('areas')
      .select('id, nombre')
      .eq('empresa_id', empresaId);
    if (errAreas) throw errAreas;
    console.log("📊 Áreas encontradas:", areas?.length || 0, areas);
    
    if (!areas || areas.length === 0) {
      console.log("⚠️ No se encontraron áreas, verificando estructura alternativa...");
      // Verificar si los datos están como cargos con area_id = empresaId
      const { data: cargosByArea, error: errCargos2 } = await supabaseAdmin
        .from('cargos')
        .select('id, nombre, jerarquia_id, area_id')
        .eq('area_id', empresaId);
      console.log("📊 Cargos con area_id = empresaId:", cargosByArea?.length || 0, cargosByArea);
      
      if (cargosByArea && cargosByArea.length > 0) {
        console.log("✅ Usando estructura alternativa: empresaId como area_id");
        // Crear área virtual y usar los cargos encontrados
        const virtualArea = { id: empresaId, nombre: "Área Principal" };
        const areas = [virtualArea];
        const cargos = cargosByArea;
        
        const areaMap = { "Área Principal": empresaId };
        const cargoMap = Object.fromEntries(cargos.map(c => [c.nombre, c]));
        
        console.log("📊 Configuración virtual:", {
          areaMap,
          cargoMapKeys: Object.keys(cargoMap)
        });
        
        // Continuar con la validación usando esta estructura
        return await processExcelWithAlternativeStructure(sheet, areaMap, cargoMap, empresaId, res);
      } else {
        return res.status(400).json({ 
          error: 'No se encontraron datos para esta empresa',
          empresaId,
          encontrado: {
            areas: 0,
            cargosByAreaId: 0
          }
        });
      }
    }
    
    const areaMap = Object.fromEntries(areas.map(a => [a.nombre, a.id]));

    console.log("🔍 Buscando cargos para áreas:", areas.map(a => a.id));
    const { data: cargos, error: errCargos } = await supabaseAdmin
      .from('cargos')
      .select('id, nombre, jerarquia_id, area_id')
      .in('area_id', areas.map(a => a.id));
    if (errCargos) throw errCargos;
    console.log("📊 Cargos encontrados:", cargos?.length || 0, cargos);
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

// Función para procesar Excel con estructura alternativa (cargos.area_id)
async function processExcelWithAlternativeStructure(sheet, areaMap, cargoMap, empresaId, res) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const warnings = [];
  const rowsToInsert = [];

  console.log("🔍 === PROCESANDO CON ESTRUCTURA ALTERNATIVA ===");

  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Skip header

    const nombre = String(row.getCell(1).value || '').trim();
    const cedula = String(row.getCell(2).value || '').trim();
    const rawCorreo = row.getCell(3).value;
    const correo = rawCorreo && typeof rawCorreo === 'object' && rawCorreo.text
      ? rawCorreo.text.trim()
      : String(rawCorreo || '').trim();

    const fullCargoValue = String(row.getCell(4).value || '').trim();
    let cargoExcelName = fullCargoValue;
    if (fullCargoValue.includes(' - ')) {
      cargoExcelName = fullCargoValue.split(' - ')[0].trim();
    }

    const areaName = String(row.getCell(5).value || '').trim();
    const jerarquiaText = String(row.getCell(7).value || '').trim();

    console.log(`🔍 Fila ${rowNumber}:`, { nombre, cedula, correo, cargoExcelName, areaName });

    const issues = [];

    // Validaciones básicas
    if (!nombre) issues.push('nombre vacío');
    if (!cedula) issues.push('cédula vacía');
    if (!correo) issues.push('correo vacío');
    else if (!emailRegex.test(correo)) issues.push(`correo "${correo}" inválido`);

    // Validar área (debe ser "Área Principal")
    const areaId = areaMap[areaName] || null;
    if (!areaName) {
      issues.push('área vacía');
    } else if (!areaId) {
      issues.push(`área "${areaName}" no existe (debe ser "Área Principal")`);
    }

    // Validar cargo
    let finalCargoId = null;
    let finalJerarquiaId = null;
    
    if (!cargoExcelName) {
      issues.push('cargo vacío');
    } else {
      const cargoInfo = cargoMap[cargoExcelName] || null;
      if (!cargoInfo) {
        issues.push(`cargo "${cargoExcelName}" no existe (disponibles: ${Object.keys(cargoMap).join(', ')})`);
      } else {
        finalCargoId = cargoInfo.id;
        finalJerarquiaId = cargoInfo.jerarquia_id;
      }
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

  console.log("📊 Resultado procesamiento:", {
    warnings: warnings.length,
    rowsToInsert: rowsToInsert.length
  });

  // Devolver warnings si existen
  if (warnings.length) return res.status(400).json({ warnings });
  if (!rowsToInsert.length) return res.status(400).json({ error: 'No se encontraron filas válidas en el Excel.' });

  // Insertar en usuarios
  const { error: errInsert } = await supabaseAdmin
    .from('usuarios')
    .insert(rowsToInsert);
  if (errInsert) {
    console.error("❌ Error insertando en usuarios:", errInsert);
    throw errInsert;
  }

  console.log("✅ Inserción exitosa!");
  return res.json({ message: 'Todos los registros fueron validados e insertados correctamente.' });
}

module.exports = router;
