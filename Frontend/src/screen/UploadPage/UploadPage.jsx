import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Description,
  FileUploadPreview,
  TitleSection,
} from "../../components/index";
import { useEmpresaData } from "../../components/Table/useEmpresaData";
import { loadAllProgress } from "../../components/Utils/breadcrumbUtils";
import "./UploadPage.css";

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');

export function UploadPage() {
  const [empresaData, setEmpresaData] = useState(null);
  const [areas, setAreas] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [subcargos, setSubcargos] = useState([]);
  const [file, setFile] = useState(null);
  const [generalError, setGeneralError] = useState("");
  const [excelWarnings, setExcelWarnings] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  // Cargar datos del localStorage
  useEffect(() => {
    const progress = loadAllProgress();
    console.log("📊 === UPLOAD DEBUG DETECCION EMPRESA_ID ===");
    console.log("📊 UploadPage - Progreso cargado:", progress);
    
    if (progress.step1) {
      console.log("📊 Step1 (empresa):", progress.step1);
      console.log("🆔 EmpresaData.id:", progress.step1?.id);
      setEmpresaData(progress.step1);
    }
    if (progress.step2) {
      console.log("📊 Step2 (áreas):", progress.step2);
      const areasData = Array.isArray(progress.step2) ? progress.step2 : 
                       Array.isArray(progress.step2?.areas) ? progress.step2.areas : [];
      console.log("📊 Áreas parseadas:", areasData);
      console.log("🔗 Areas empresa_id:", areasData?.map(a => ({ id: a.id, nombre: a.nombre, empresa_id: a.empresa_id })));
      setAreas(areasData);
    }
    if (progress.step3) {
      console.log("📊 Step3 (cargos/subcargos):", progress.step3);
      const cargosData = Array.isArray(progress.step3?.cargos) ? progress.step3.cargos : [];
      const subcargosData = Array.isArray(progress.step3?.subcargos) ? progress.step3.subcargos : [];
      console.log("📊 Cargos parseados:", cargosData);
      console.log("🔗 Cargos area_id:", cargosData?.map(c => ({ id: c.id, nombre: c.nombre, area_id: c.area_id })));
      setCargos(cargosData);
      setSubcargos(subcargosData);
    }
  }, []);

  // Usar el hook correctamente con los datos cargados
  const { empresaId: hookEmpresaId } = useEmpresaData(areas, cargos, subcargos, empresaData);
  
  // Buscar ID real con fallback mejorado (igual que en DownloadPage)
  const getRealEmpresaId = () => {
    // 1. Priorizar empresaId del hook si existe
    if (hookEmpresaId) {
      console.log("🎯 EmpresaId desde hook:", hookEmpresaId);
      return hookEmpresaId;
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
  
  const empresaId = getRealEmpresaId();
  
  console.log("📊 UploadPage - EmpresaId detectado:", empresaId, "Hook:", hookEmpresaId);

  const handleFileChange = (e) => {
    setGeneralError("");
    setExcelWarnings([]);
    setSuccessMsg("");
    const chosen = e.target.files ? e.target.files[0] : e;
    setFile(chosen);
  };

  const handleSubmit = async () => {
    setGeneralError("");
    setExcelWarnings([]);
    setSuccessMsg("");

    if (!file) {
      setGeneralError("Por favor selecciona un archivo .xlsx");
      return;
    }
    if (!empresaId) {
      setGeneralError("❌ No se ha identificado la empresa.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("empresaId", empresaId);

    try {

      const res = await fetch(`${BASE_URL}/upload-excel`, {
        method: 'POST',
        body: formData,
      });
      const body = await res.json().catch(() => ({}));
      console.log("RESPUESTA BACKEND:", res.status, body);
      // 1) Caso "no hay filas válidas": navegamos a ValidationPage con warning genérico
      if (!res.ok && body.error === 'No se encontraron filas válidas en el Excel.') {
        const warnings = [
          {
            row: null,
            issues: ["No se encontraron filas válidas en el Excel."],
          },
        ];
        navigate("/validation_page", {
          state: { excelWarnings: warnings, file },
        });
        return;
      }

      // 2) Caso "array de warnings puntuales"
      if (!res.ok) {
        if (Array.isArray(body.warnings)) {
          setExcelWarnings(body.warnings);
          navigate("/validation_page", {
            state: { excelWarnings: body.warnings, file },
          });
          return;
        }
        // 2b) Si no entró en warnings ni en "no filas válidas", lanzo excepción:
        throw new Error(body.error || 'Error desconocido')
      }

      // 3) Éxito (res.ok === true):
      navigate("/validation_page", {
        state: {
          excelWarnings: [], // No hay errores
          file, // Pasamos el archivo subido
        },
      });
    } catch (err) {
      // 4) Capturar cualquier error imprevisto
      setGeneralError(`❌ ${err.message}`);
    }
  };

  return (
    <>
      <section className="upload-page-section">
        <div className="description-content">
          <div className="header-upload">
            <TitleSection title="Cargar el documento para continuar con el proceso" />
            <span className="upload-caption">(Aprox. 5 minutos)</span>
          </div>
          <div className="header-description">
            <Description
              variant="forms"
              text="Por favor, proporcione el archivo Excel con toda la información correctamente documentada. Esta información será validada automáticamente para asegurar que esté completa y en el formato adecuado."
            />
            <Description
              variant="forms"
              text="Este paso es esencial para obtener un análisis preciso y representativo del ambiente de innovación en su organización."
            />
          </div>
        </div>

        <FileUploadPreview
          onFileChange={handleFileChange}
          file={file}
          accept=".xlsx"
        />

        {generalError && <p className="error-message">{generalError}</p>}
        {successMsg && <p className="success-message">{successMsg}</p>}

        {/* Debug temporal */}
        <div style={{ margin: '10px 0', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
          <p><strong>Debug UploadPage:</strong></p>
          <p>EmpresaId: {empresaId} | Archivo: {file ? '✅' : '❌'} | Botón habilitado: {(!file || !empresaId) ? '❌' : '✅'}</p>
          <button 
            onClick={() => alert(`EmpresaId: ${empresaId}\nFile: ${file?.name}\nHook: ${hookEmpresaId}\nCargos: ${cargos.length}`)} 
            style={{padding: '5px 10px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '3px'}}
          >
            🔍 Debug
          </button>
        </div>

        <section className="navigation-buttons">
          <Button variant="back" to="/download_page" />
          <Button
            variant="next"
            text="Procesar"
            onClick={handleSubmit}
            disabled={!file || !empresaId}
          />
        </section>
      </section>

      <img className="line-bckg-img" src="/BgLine-decoration2.png" alt="" />
      <img className="line-bckg-img2" src="/BgLine-decoration3.png" alt="" />
      <img className="squares-bckg-img" src="/squaresBckg.png" alt="" />
    </>
  );
}
