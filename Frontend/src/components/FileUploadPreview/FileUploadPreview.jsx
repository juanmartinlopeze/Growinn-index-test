import React, { useState } from 'react';
import './FileUploadPreview.css';

export const FileUploadPreview = ({ onFileChange, file, accept }) => {
    const [isDragging, setIsDragging] = useState(false);

    const renderFilePreview = () => {
        if (!file) return null;

        const isExcel = file.type.includes('spreadsheetml.sheet') || file.name.endsWith('.xlsx');
        const fileSizeMB = (file.size / 1024 / 1024).toFixed(2);

        return (
            <div className="file-preview-container">
                {isExcel ? (
                    <div className="excel-preview">
                        <svg className="excel-icon" viewBox="0 0 24 24">
                            <path fill="#217346" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6m-1 1.5L18.5 9H13V3.5M7 11h10v1.8c-.9-.4-1.9-.6-3-.6-3.3 0-6 2.7-6 6 0 1.1.3 2.1.8 3H7v-8m10 8v-1.5c0-1.9 1.6-3.5 3.5-3.5h1.5v6H17z" />
                        </svg>
                        <div className="file-info">
                            <p className="file-name">{file.name}</p>
                            <p className="file-details">
                                <span className="file-type">Archivo Excel</span>
                                <span className="file-size">{fileSizeMB} MB</span>
                            </p>
                        </div>
                    </div>
                ) : file.type.startsWith('image/') ? (
                    <img
                        src={URL.createObjectURL(file)}
                        alt="Preview"
                        className="preview-image"
                    />
                ) : (
                    <div className="generic-preview">
                        <svg className="file-icon" viewBox="0 0 24 24">
                            <path fill="#666" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6m-1 1.5L18.5 9H13V3.5M14 14h-1v4h-1v-4h-1l2.5-3 2.5 3h-1m-5 2.5v.5h3v-.5c0-.3-.2-.5-.5-.5h-2c-.3 0-.5.2-.5.5Z" />
                        </svg>
                        <div className="file-info">
                            <p className="file-name">{file.name}</p>
                            <p className="file-size">{fileSizeMB} MB</p>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // El resto del componente se mantiene igual
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            handleFileValidation(droppedFile);
        }
    };

    const handleFileValidation = (file) => {
        if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            file.name.endsWith('.xlsx')) {
            onFileChange({ target: { files: [file] } });
        }
    };

    return (
        <div
            className={`upload-container ${isDragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <input
                type="file"
                id="file-upload"
                className="file-input"
                accept={accept}
                onChange={(e) => handleFileValidation(e.target.files[0])}
            />
            <label
                htmlFor="file-upload"
                className="upload-label"
            >
                {!file ? (
                    <>
                        <p>Haz click o arrastra para subir</p>
                        <span>Máx. 50 MB</span>
                    </>
                ) : (
                    renderFilePreview()
                )}
            </label>
        </div>
    );
};