import React, { useState } from 'react';
import './UploadPage.css';
import { TitleSection, Description, Button } from '../../components/index';

export function UploadPage() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = e => {
    setError('');
    setSuccess('');
    const chosen = e.target.files[0];
    if (chosen && chosen.type === 
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      setFile(chosen);
    } else {
      setFile(null);
      setError('Solo se permite .xlsx');
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Por favor selecciona un archivo .xlsx');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:3000/upload-excel', {
        method: 'POST',
        body: formData,
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Error desconocido');
      setSuccess('✔️ Archivo procesado correctamente.');
    } catch (err) {
      console.error('Error al subir Excel:', err);
      setError(`❌ ${err.message}`);
    }
  };

  return (
    <section className='upload-page-section'>
      <div className='description-content'>
        <TitleSection title="Cargar archivo." />
        <Description variant="p" text="Por favor, proporcione el archivo Excel con toda la información correctamente documentada. Esta información será validada automáticamente para asegurar que esté completa y en el formato adecuado." />
        <Description variant="p" text="Este paso es esencial para obtener un análisis preciso y representativo del ambiente de innovación en su organización." />
      </div>

      <div className="upload-container">
        <input
          type="file"
          id="file-upload"
          className="file-input"
          accept=".xlsx"
          onChange={handleFileChange}
        />
        <label htmlFor="file-upload" className="upload-label">
          <p>Click to upload or drag and drop</p>
          <span>Maximum file size 50 MB</span>
        </label>
      </div>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <section className='navigation-buttons'>
        <Button variant='back' to="/download_page" />
        <Button variant='next' text='Procesar' onClick={handleSubmit} />
      </section>
    </section>
  );
}
