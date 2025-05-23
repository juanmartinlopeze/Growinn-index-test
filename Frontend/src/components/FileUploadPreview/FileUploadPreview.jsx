import React from 'react';
import './FileUploadPreview.css';

export const FileUploadPreview = ({ onFileChange, file, accept }) => {
    const handlePreviewClick = e => {
        if (file) e.preventDefault(); // Evita abrir el selector si hay archivo
    };

    return (
        <div className="upload-container">
            <input
                type="file"
                id="file-upload"
                className="file-input"
                accept={accept}
                onChange={onFileChange}
            />
            <label
                htmlFor="file-upload"
                className="upload-label"
                onClick={handlePreviewClick}
            >
                {!file ? (
                    <>
                        <p>Haz click o arrastra para subir</p>
                        <span>Máx. 50 MB</span>
                    </>
                ) : (
                    <div className="preview-content">
                        {file.type.startsWith('image/') ? (
                            <img
                                src={URL.createObjectURL(file)}
                                alt="Preview"
                                className="preview-image"
                            />
                        ) : (
                            <div className="file-info">
                                <p className="file-name">{file.name}</p>
                                <p className="file-size">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </label>
        </div>
    );
};