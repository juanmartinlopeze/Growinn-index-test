import React from 'react';

export default function RoleCell({
  areaId,
  jerarquia,
  cargos,
  subcargos,
  onClick,
}) {
  // Filtrar los cargos de esta área y jerarquía
  const cargosFiltrados = cargos.filter(
    (c) => c.area_id === areaId && c.jerarquia === jerarquia
  );

  const handleClick = () => {
    const cargo = cargosFiltrados[0] || null;
    onClick(cargo);
  };

  return (
    <div className="role-cell" onClick={handleClick} style={{ cursor: 'pointer' }}>
      {cargosFiltrados.length > 0 ? (
        <div className="cargo-info">
          <strong>{cargosFiltrados[0].nombre}</strong>
          <div className="subcargos-info">
            {subcargos
              .filter((sub) => sub.cargo_id === cargosFiltrados[0].id)
              .map((sub) => (
                <div key={sub.id} style={{ fontSize: '0.75rem' }}>
                  {sub.nombre} ({sub.personas})
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div className="empty-role">+</div>
      )}
    </div>
  );
}
