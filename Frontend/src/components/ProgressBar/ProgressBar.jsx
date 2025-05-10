import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ empleadosAsignados, empleadosPlaneados }) => {
  const porcentaje = empleadosPlaneados > 0
    ? Math.min((empleadosAsignados / empleadosPlaneados) * 100, 100)
    : 0;

  return (
    <div className="progress-bar-container">
      <div
        className="progress-bar-fill"
        style={{ width: `${porcentaje}%` }}
      ></div>
      <div className="progress-bar-text">
        <img src="/icon-people.png" alt="Icono personas" />
        {empleadosAsignados} / {empleadosPlaneados}
      </div>
    </div>
  );
};

export default ProgressBar;
