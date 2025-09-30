const express = require("express");
const router = express.Router();
const ExcelJS = require("exceljs");
const { supabaseAdmin } = require("../supabase/supabase");

// ⚠️ IMPORTANTE: Rutas específicas DEBEN ir ANTES que rutas con parámetros
// Ruta de prueba para verificar conectividad
router.get("/excel/test-connection", (req, res) => {
  console.log("🔧 Test de conectividad recibido");
  res.status(200).send("✅ Servidor Excel funcionando correctamente");
});

// Ruta para generar Excel por empresa (DEBE ir después de rutas específicas)
router.get("/excel/:empresaId", async (req, res) => {
  const { empresaId } = req.params;

  try {
    // Validación: empresaId debe ser un número válido
    if (!empresaId || isNaN(empresaId)) {
      return res.status(400).json({ 
        error: "ID de empresa inválido", 
        received: empresaId,
        expected: "Número válido"
      });
    }

    console.log("🔍 Generando Excel para empresa:", empresaId);
    console.log("📥 Headers de la petición:", req.headers);

    // 🔍 DEBUGGING: Primero verificar qué estructuras tenemos
    console.log("🔍 === VERIFICANDO ESTRUCTURA DE DATOS ===");
    
    // Verificar si existe como empresa_id en areas
    const { data: areasByEmpresa, error: errAreasByEmpresa } = await supabaseAdmin
      .from("areas")
      .select("id, nombre, empresa_id")
      .eq("empresa_id", empresaId);
    console.log("🔍 Áreas por empresa_id:", areasByEmpresa?.length || 0, areasByEmpresa);

    // Verificar si existe como id en areas  
    const { data: areasById, error: errAreasById } = await supabaseAdmin
      .from("areas")
      .select("id, nombre, empresa_id")
      .eq("id", empresaId);
    console.log("🔍 Áreas por id:", areasById?.length || 0, areasById);

    // Verificar cargos por area_id (lo que vemos en frontend)
    const { data: cargosByArea, error: errCargosByArea } = await supabaseAdmin
      .from("cargos")
      .select("id, nombre, jerarquia_id, area_id, personas")
      .eq("area_id", empresaId);
    console.log("🔍 Cargos por area_id:", cargosByArea?.length || 0, cargosByArea);

    // Decidir qué enfoque usar basado en los datos encontrados
    let areas = [];
    let finalCargos = [];
    
    if (areasByEmpresa && areasByEmpresa.length > 0) {
      console.log("✅ Usando enfoque: empresa_id en areas");
      areas = areasByEmpresa;
      // Continuar con la lógica original...
    } else if (cargosByArea && cargosByArea.length > 0) {
      console.log("✅ Usando enfoque: empresaId como area_id directamente");
      // Crear área virtual
      areas = [{ id: empresaId, nombre: "Área Principal" }];
      finalCargos = cargosByArea;
    } else if (areasById && areasById.length > 0) {
      console.log("✅ Usando enfoque: empresaId como id de área");
      areas = areasById;
    } else {
      console.warn("❌ No se encontraron datos para empresaId:", empresaId);
      return res.status(404).json({ 
        error: "No se encontraron datos para esta empresa", 
        empresaId,
        checked: {
          areasByEmpresa: areasByEmpresa?.length || 0,
          areasById: areasById?.length || 0, 
          cargosByArea: cargosByArea?.length || 0
        }
      });
    }

    const areaNames = areas.map(a => a.nombre);
    const areaMap = Object.fromEntries(areas.map(a => [a.id, a.nombre]));

    // 2️⃣ Traer cargos solo si no los tenemos ya
    if (finalCargos.length === 0) {
      console.log("🔍 Buscando cargos para áreas:", areas.map(a => a.id));
      const areaIds = areas.map(a => a.id);
      const { data: cargosFromAreas, error: errCargos } = await supabaseAdmin
        .from("cargos")
        .select("id, nombre, jerarquia_id, area_id, personas")
        .in("area_id", areaIds);
      if (errCargos) throw errCargos;
      finalCargos = cargosFromAreas || [];
    }

    console.log("👥 Cargos finales:", finalCargos?.length || 0, finalCargos);

    // 3️⃣ Traer subcargos relacionados
    const cargoIds = finalCargos.map(c => c.id);
    const { data: subcargos, error: errSubs } = await supabaseAdmin
      .from("subcargos")
      .select("id, nombre, personas, cargo_id")
      .in("cargo_id", cargoIds);
    if (errSubs) throw errSubs;

    console.log("📋 Subcargos encontrados:", subcargos?.length || 0);

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
    for (const cargo of finalCargos) {
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
    console.log("📤 Preparando headers de respuesta...");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=estructura_empresa_${empresaId}.xlsx`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    console.log("📝 Escribiendo archivo Excel...");
    await workbook.xlsx.write(res);
    res.end();

    console.log("✅ Excel enviado correctamente");
  } catch (error) {
    console.error("❌ Error al generar Excel:", error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

module.exports = router;