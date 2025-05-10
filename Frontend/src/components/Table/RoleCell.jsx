export default function RoleCell({
  areaId,
  jerarquia,
  cargos,
  subcargos,
  onClick,
}) {
  // Filtrar los cargos de esta área y jerarquía
  const cargosFiltrados = cargos.filter(
    (c) => c.area_id === areaId && c.jerarquia_id === jerarquia
  );

  console.log('Cargos recibidos en RoleCell:', cargos);
  console.log('areaId:', areaId, 'jerarquia:', jerarquia);
  console.log('Subcargos recibidos en RoleCell:', subcargos);
  console.log('Cargos filtrados en RoleCell:', cargosFiltrados);

  const handleClick = () => {
    const cargo = cargosFiltrados[0] || null;
    onClick(cargo, jerarquia); 
  };

  return (
    <div className="role-cell" onClick={handleClick} style={{ cursor: 'pointer' }}>
      {cargosFiltrados.length > 0 ? (
        <div className="cargo-info">
          <strong>{cargosFiltrados[0].nombre}</strong>
          <div style={{ fontSize: '0.75rem' }}>
            {cargosFiltrados[0].personas}
          </div>
        </div>
      ) : (
        <div className="empty-role">+</div>
      )}
    </div>
  );
}
