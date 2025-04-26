import React from 'react';
import './ProgressBar.css';

export const ProgressBar = ({ empleadosAsignados, empleadosPlaneados }) => {
  const porcentaje = empleadosPlaneados === 0 ? 0 : (empleadosAsignados / empleadosPlaneados) * 100;

  return (
    <div className="progress-bar-container">
      <div
        className="progress-bar-fill"
        style={{ width: `${porcentaje}%` }}
      ></div>
      <div className="progress-bar-text">
        <img src="../../../public/icon-people.png" alt="" />
        {empleadosAsignados} / {empleadosPlaneados}
      </div>
    </div>
  );
};
