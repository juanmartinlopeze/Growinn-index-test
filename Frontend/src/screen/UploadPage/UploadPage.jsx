import React, { useState } from 'react';
import './UploadPage.css';
import { TitleSection, Description, Button, FileUploadPreview } from '../../components/index';
import { useEmpresaData } from '../../components/Table/useEmpresaData';

export function UploadPage() {
  const { empresaId } = useEmpresaData();
  const [file, setFile] = useState(null);
  const [generalError, setGeneralError] = useState('');
  const [excelWarnings, setExcelWarnings] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');

  const handleFileChange = e => {
    setGeneralError('');
    setExcelWarnings([]);
    setSuccessMsg('');

    const chosen = e.target.files ? e.target.files[0] : e;
    setFile(chosen);
  };

  const handleSubmit = async () => {
    setGeneralError('');
    setExcelWarnings([]);
    setSuccessMsg('');

    if (!file) {
      setGeneralError('Por favor selecciona un archivo .xlsx');
      return;
    }
    if (!empresaId) {
      setGeneralError('❌ No se ha identificado la empresa.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('empresaId', empresaId);

    try {
      const res = await fetch('http://localhost:3000/upload-excel', {
        method: 'POST',
        body: formData,
      });
      const body = await res.json().catch(() => ({}));

      if (!res.ok && Array.isArray(body.warnings)) {
        setExcelWarnings(body.warnings);
        return;
      }
      if (!res.ok) {
        throw new Error(body.error || 'Error desconocido');
      }

      setSuccessMsg(`✔️ Procesadas ${body.inserted} filas correctamente.`);
      setFile(null);
    } catch (err) {
      console.error('Error al subir Excel:', err);
      setGeneralError(`❌ ${err.message}`);
    }
  };

  return (
    <section className="upload-page-section">
      <div className="description-content">
        <TitleSection title="Cargar archivo." />
        <Description
          variant="p"
          text="Por favor, sube el Excel con los datos finales para procesarlos."
        />
      </div>

      <FileUploadPreview
        onFileChange={handleFileChange}
        file={file}
        accept=".xlsx"
      />

      {generalError && <p className="error-message">{generalError}</p>}
      {successMsg && <p className="success-message">{successMsg}</p>}

      {excelWarnings.length > 0 && (
        <div className="excel-warnings">
          <h4>Advertencias en el Excel:</h4>
          <ul>
            {excelWarnings.map(({ row, issues }) => (
              <li key={row}>
                <strong>Fila {row}:</strong> {issues.join('; ')}
              </li>
            ))}
          </ul>
        </div>
      )}

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
  );
}
