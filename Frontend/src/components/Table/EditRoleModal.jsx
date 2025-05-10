
export default function EditRoleModal({
  position,
  employees,
  subcargos,
  onPositionChange,
  onEmployeesChange,
  onSubcargosChange,
  onClose,
  onSave,
  onDeleteSubcargo,
  onDeleteRole,
}) {
  const handleSubcargoDelete = async (index, subcargo) => {
    const confirmDelete = window.confirm(`¿Eliminar el subcargo "${subcargo.nombre}"?`);
    if (!confirmDelete) return;

    try {
      await onDeleteSubcargo(subcargo.id); // Para subcargos ya guardados
      const updated = [...subcargos];
      updated.splice(index, 1);
      onSubcargosChange(updated);
      alert('✅ Subcargo eliminado correctamente');
    } catch (err) {
      console.error('❌ Error eliminando subcargo:', err);
      alert('❌ Error al eliminar subcargo');
    }
  };

  const handleAddLocalSubcargo = () => {
    const updated = [...subcargos, { nombre: '', personas: 0 }];
    onSubcargosChange(updated);
  };

  return (
    <div className='modal-container'>
      <div className='overlay'>
        <div className='modal-content'>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSave(); // El gran guardado de cargo + subcargos
            }}
          >
            <h3>Editar Cargo</h3>

            <label>Cargo</label>
            <input
              value={position}
              onChange={(e) => onPositionChange(e.target.value)}
              placeholder='Nombre del cargo'
            />

            <label>Empleados</label>
            <input
              type='number'
              value={employees}
              onChange={(e) => onEmployeesChange(e.target.value)}
              placeholder='Cantidad de empleados'
            />

            <div className='subcargos-section'>
              <label>Subcargos:</label>
              {subcargos.map((sub, index) => (
                <div key={sub.id || index} className='subcargo-item' style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    value={sub.nombre || ''}
                    onChange={(e) => {
                      const updated = [...subcargos];
                      updated[index] = { ...updated[index], nombre: e.target.value };
                      onSubcargosChange(updated);
                    }}
                    placeholder={`Subcargo ${index + 1}`}
                  />
                  <input
                    type='number'
                    value={sub.personas || ''}
                    onChange={(e) => {
                      const updated = [...subcargos];
                      updated[index] = { ...updated[index], personas: parseInt(e.target.value) || 0 };
                      onSubcargosChange(updated);
                    }}
                    style={{ width: '80px' }}
                    placeholder='Personas'
                  />
                  {sub.id && (
                    <button type='button' onClick={() => handleSubcargoDelete(index, sub)}>
                      ✕
                    </button>
                  )}
                </div>
              ))}

              <button
                type='button'
                onClick={handleAddLocalSubcargo}
                style={{ marginTop: '12px' }}
              >
                Añadir Subcargo
              </button>
            </div>

            <div className='modal-buttons'>
              <button type='submit' className='submit-button'>
                Guardar
              </button>
              <button type='button' onClick={onClose} className='cancel-button'>
                Cancelar
              </button>
              <button
                type='button'
                onClick={onDeleteRole}
                className='delete-button'
                style={{ backgroundColor: '#e74c3c', color: 'white' }}
              >
                Eliminar Cargo
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
