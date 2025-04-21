import React from 'react';

const ProgressBar = ({ empleadosAsignados, empleadosPlaneados }) => {
  const porcentaje = empleadosPlaneados === 0 ? 0 : (empleadosAsignados / empleadosPlaneados) * 100;

  return (
    <div className="progress-bar-container">
      <div
        className="progress-bar-fill"
        style={{ width: `${porcentaje}%` }}
      ></div>
      <div className="progress-bar-text">
        {empleadosAsignados} / {empleadosPlaneados}
      </div>
    </div>
  );
};

export default ProgressBar;