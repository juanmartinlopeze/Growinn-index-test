import React from 'react';

export default function EditAreaNameForm({ areaName, onChange, onSave, onCancel }) {
  return (
    <div className="modal-container">
      <div className="overlay">
        <div className="modal-content">
          <h3>Editar nombre del área</h3>
          <input
            value={areaName}
            onChange={e => onChange(e.target.value)}
            placeholder="Nuevo nombre del área"
          />
          <div className="modal-buttons">
            <button onClick={onSave} className="submit-button">Guardar</button>
            <button onClick={onCancel} className="cancel-button">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
