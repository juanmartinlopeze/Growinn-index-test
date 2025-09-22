import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Description,
  FileUploadPreview,
  TitleSection,
} from "../../components/index";
import { useEmpresaData } from "../../components/Table/useEmpresaData";
import "./UploadPage.css";

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');

export function UploadPage() {
  const { empresaId } = useEmpresaData();
  const [file, setFile] = useState(null);
  const [generalError, setGeneralError] = useState("");
  const [excelWarnings, setExcelWarnings] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

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
