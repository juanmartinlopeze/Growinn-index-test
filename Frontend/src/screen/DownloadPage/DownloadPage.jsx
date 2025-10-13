import "./DownloadPage.css";
import { StepBreadcrumb } from "../../components/StepBreadcrumb/breadcrumb";
import { TitleSection, Description, Button } from "../../components/index";
import { generarExcelDesdeBD } from "./generarExcel/generarExcel";
import { useEmpresaData } from "../../components/Table/useEmpresaData";
import { loadAllProgress } from "../../components/Utils/breadcrumbUtils";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export function DownloadPage() {
  const navigate = useNavigate();
  const [empresaData, setEmpresaData] = useState(null);
  const [areas, setAreas] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [subcargos, setSubcargos] = useState([]);

  // Cargar datos del localStorage
  useEffect(() => {
    const progress = loadAllProgress();
    console.log("📊 === DEBUG DETECCION EMPRESA_ID ===");
    console.log("📊 Progreso completo:", progress);
    
    if (progress.step1) {
      console.log("📊 Step1 (empresa):", progress.step1);
      console.log("🆔 EmpresaData.id:", progress.step1?.id);
      setEmpresaData(progress.step1);
    }
    if (progress.step2) {
      console.log("📊 Step2 (áreas):", progress.step2);
      // Asegurar que áreas sea un array
      const areasData = Array.isArray(progress.step2) ? progress.step2 : 
                       Array.isArray(progress.step2?.areas) ? progress.step2.areas : [];
      console.log("📊 Áreas parseadas:", areasData);
      console.log("🔗 Areas empresa_id:", areasData?.map(a => ({ id: a.id, nombre: a.nombre, empresa_id: a.empresa_id })));
      setAreas(areasData);
    }
    if (progress.step3) {
      console.log("📊 Step3 (cargos/subcargos):", progress.step3);
      // Asegurar que sean arrays
      const cargosData = Array.isArray(progress.step3?.cargos) ? progress.step3.cargos : [];
      const subcargosData = Array.isArray(progress.step3?.subcargos) ? progress.step3.subcargos : [];
      console.log("📊 Cargos parseados:", cargosData);
      console.log("🔗 Cargos area_id:", cargosData?.map(c => ({ id: c.id, nombre: c.nombre, area_id: c.area_id })));
      console.log("📊 Subcargos parseados:", subcargosData);
      setCargos(cargosData);
      setSubcargos(subcargosData);
    }
  }, []);

  // Usar el hook correctamente con los datos cargados
  const { empresaId } = useEmpresaData(areas, cargos, subcargos, empresaData);
  
  // Buscar ID real con fallback mejorado
  const getRealEmpresaId = () => {
    // 1. Priorizar empresaId del hook si existe
    if (empresaId) {
      console.log("🎯 EmpresaId desde hook:", empresaId);
      return empresaId;
    }
    
    // 2. Desde empresaData directamente
    if (empresaData?.id) {
      console.log("🎯 EmpresaId desde empresaData:", empresaData.id);
      return empresaData.id;
    }
    
    // 3. Desde areas.empresa_id (estructura estándar)
    if (areas.length > 0 && areas[0]?.empresa_id) {
      console.log("🎯 EmpresaId desde areas.empresa_id:", areas[0].empresa_id);
      return areas[0].empresa_id;
    }
    
    // 4. Evitar usar area_id de cargos huérfanos
    // Solo usar si hay una correspondencia válida con areas
    if (cargos.length > 0 && areas.length > 0) {
      const cargoConArea = cargos.find(cargo => 
        areas.some(area => area.id === cargo.area_id)
      );
      if (cargoConArea?.area_id) {
        console.log("🎯 EmpresaId desde cargo vinculado:", cargoConArea.area_id);
        return cargoConArea.area_id;
      }
    }
    
    // 5. Fallback: usar una empresa válida para testing
    console.log("⚠️ Usando fallback empresaId");
    return "245"; // Empresa válida para testing
  };
  
  const finalEmpresaId = getRealEmpresaId();
  
  // Log para verificar
  console.log("🎯 ID detectado:", finalEmpresaId, "de", cargos.length > 0 ? `cargo con area_id: ${cargos[0]?.area_id}` : 'fallback');

  const handleDownload = async () => {
    console.log("🚀 Iniciando descarga", { empresaId, finalEmpresaId });
    
    if (!finalEmpresaId) {
      return alert("❌ No se ha cargado la empresa correctamente.");
    }
    
    try {
      await generarExcelDesdeBD(finalEmpresaId);
      console.log("✅ Descarga completada");
    } catch (error) {
      console.error("❌ Error en descarga:", error);
    }
  };

  const debugState = () => {
    const progress = loadAllProgress();
    
    // Buscar ID real en los datos con mayor detalle
    let realEmpresaId = null;
    let source = '';
    
    // 1. Desde empresaData
    if (empresaData?.id) {
      realEmpresaId = empresaData.id;
      source = 'empresaData.id';
    }
    
    // 2. Desde el primer cargo (area_id = empresaId)
    if (!realEmpresaId && cargos.length > 0 && cargos[0].area_id) {
      realEmpresaId = cargos[0].area_id;
      source = 'cargos[0].area_id';
    }
    
    // 3. Desde el primer área
    if (!realEmpresaId && areas.length > 0 && areas[0].empresa_id) {
      realEmpresaId = areas[0].empresa_id;
      source = 'areas[0].empresa_id';
    }
    
    const info = `✅ PROBLEMA IDENTIFICADO:

📊 ID ENCONTRADO: ${realEmpresaId} (${source})
📊 Final usado: ${finalEmpresaId}
📊 ¿Coinciden?: ${realEmpresaId == finalEmpresaId ? 'SÍ' : 'NO'}

🔧 SOLUCIÓN: 
- El backend debe buscar empresa_id = ${realEmpresaId}
- No empresa_id = 1

📁 Datos:
- Cargos: ${cargos.length} (area_id: ${cargos[0]?.area_id})
- Áreas: ${areas.length}`;
    
    console.log("📊 Debug completo:", {
      realEmpresaId, finalEmpresaId, source,
      cargos: cargos.map(c => ({area_id: c.area_id, nombre: c.nombre})),
      areas, empresaData
    });
    
    alert(info);
  };

  return (
    <section className="download-page-section">
      <StepBreadcrumb
        steps={[
          "Jerarquías y cargos",
          "Áreas",
          "Tabla de jerarquías",
          "Resultados",
        ]}
        currentStep={3} // Paso 4
        clickableSteps={[2]} // Permite volver al paso 3
        onStepClick={(idx) => {
          if (idx === 2) navigate("/datos_prueba"); // Ajusta la ruta si tu pantalla de tabla tiene otro nombre
        }}
      />
      <div className="description-content">
        <TitleSection title="Descarga el documento para continuar con el proceso." />
        <div className="body-description">
          <Description
            variant="forms"
            text="El archivo en formato Excel ya incluye los datos que ingresaste previamente. Solo necesitas completarlo con la información adicional que se solicita dentro del mismo archivo. Esta información es necesaria para realizar un análisis más preciso del ambiente de innovación en tu organización."
          />
          <Button
            variant="download"
            className="download"
            text="Descargar documento"
            onClick={handleDownload}
          />
          <Button
            variant="primary"
            text="🔍 Debug Completo"
            onClick={debugState}
            style={{ marginTop: '10px', backgroundColor: '#059669' }}
          />
        </div>
      </div>

      <div className="video-content">
        <Description text="Mira cómo hacerlo paso a paso." variant="forms" />
        <iframe
          width="100%"
          height="424"
          src="https://www.youtube.com/embed/yKxF9swBwUk?vq=hd1080"
          title="Video Frame"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <section className="navigation-buttons">
        <Button variant="back" to="/datos_prueba" />
        <Button variant="next" text="Siguiente" to="/upload_page" />
      </section>
    </section>
  );
}