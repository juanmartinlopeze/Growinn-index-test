import React from 'react';

export default function RoleCell({ areaId, jerarquia, cargos, subcargos, usuarios, onClick }) {
  // Filtrar cargos que pertenezcan a esta área y jerarquía
  const cargosFiltrados = cargos.filter(c => c.area_id === areaId && c.jerarquia === jerarquia);

  if (cargosFiltrados.length === 0) {
    return <button onClick={() => onClick(null, null)}>+</button>;
  }

  return (
    <div className="role-cell">
      {cargosFiltrados.map(cargo => (
        <div key={cargo.id} onClick={() => onClick(cargo, null)} className="cargo-container">
          <p className="role-name">{cargo.nombre}</p>
          <div className="subcargos-list">
            {subcargos.filter(s => s.cargo_id === cargo.id).map(sub => (
              <div key={sub.id} className="subcargo-item" onClick={() => onClick(cargo, sub)}>
                <p>{sub.nombre}</p> | <p>{usuarios.filter(u => u.subcargo_id === sub.id).length}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
