// EditRoleModal.jsx
import React from 'react';
import { Button, Alert } from '../index';
import { useAlert } from '../Alerts/useAlert';
import { v4 as uuidv4 } from 'uuid'; // npm i uuid
import './Table.css';

export default function EditRoleModal({
  title,
  position,
  employees,
  subcargos,
  onPositionChange,
  onEmployeesChange,
  onSubcargosChange,
  onClose,
  onSave,
  onDeleteSubcargo,
  onDeleteRole
}) {
  const { alertInfo, showAlert } = useAlert();

  // Botón “Eliminar subcargo” (servidor + local)
  const handleSubcargoDelete = async (index, subcargo) => {
    const confirmed = await showAlert(
      'delete',
      'Eliminar el subcargo',
      `¿Estás seguro de eliminar "${subcargo.nombre}"? Esta acción no se puede deshacer.`
    );
    if (!confirmed) return;

    try {
      // 1. Borra en BD
      if (subcargo.id) {
        await onDeleteSubcargo(subcargo.id);
      }
      // 2. Borra localmente del array
      const updated = [...subcargos];
      updated.splice(index, 1);
      onSubcargosChange(updated);
      // 3. Mensaje informativo
      showAlert('complete', 'Subcargo eliminado', '✅ Subcargo eliminado correctamente');
    } catch (err) {
      console.error('❌ Error eliminando subcargo:', err);
      showAlert('error', 'Error', '❌ Error al eliminar subcargo');
    }
  };

  // “+ Agregar Subcargo” (solo local, con UID único)
  const handleAddLocalSubcargo = () => {
    const provisional = {
      uid: uuidv4(),
      nombre: '',
      personas: 0,
      // cargo_id: ... (no hace falta hasta guardar)
    };
    onSubcargosChange([...subcargos, provisional]);
  };

  return (
    <div className='modal-container'>
      <div className='overlay'>
        <div className='modal-content'>
          {alertInfo && (
            <Alert
              {...alertInfo}
              position="top-center"
              onConfirm={alertInfo.onConfirm}
              onCancel={alertInfo.onCancel}
            />
          )}
          <form
            onSubmit={e => {
              e.preventDefault();
              onSave();
            }}
          >
            <h3>{title}</h3>

            <div className='input-row'>
              <div className='input-group'>
                <label htmlFor='position'>Cargo</label>
                <input
                  id='position'
                  value={position}
                  onChange={e => onPositionChange(e.target.value)}
                  placeholder='Nombre del cargo'
                />
              </div>

              <div className='input-group'>
                <label htmlFor='employees'>Empleados</label>
                <input
                  id='employees'
                  type='number'
                  value={employees}
                  onChange={e => {
                    const num = parseInt(e.target.value, 10);
                    onEmployeesChange(isNaN(num) ? 0 : num);
                  }}
                  placeholder='Cantidad de empleados'
                />
              </div>
            </div>

            <div className='divider' />

            <div className='subcargos-section'>
              <label>Subcargos</label>
              {subcargos.map((sub, index) => {
                // Usa key = sub.id si existe; si no, usa sub.uid
                const keyValue = sub.id ?? sub.uid;
                return (
                  <div key={keyValue} className='subcargo-row'>
                    <div className='subcargo-input-group'>
                      <input
                        value={sub.nombre}
                        onChange={e => {
                          const updated = [...subcargos];
                          updated[index] = {
                            ...updated[index],
                            nombre: e.target.value,
                          };
                          onSubcargosChange(updated);
                        }}
                        placeholder={`Subcargo ${index + 1}`}
                      />
                    </div>
                    <div className='subcargo-input-group'>
                      <input
                        type='number'
                        value={sub.personas}
                        onChange={e => {
                          const val = parseInt(e.target.value, 10);
                          const updated = [...subcargos];
                          updated[index] = {
                            ...updated[index],
                            personas: isNaN(val) ? 0 : val,
                          };
                          onSubcargosChange(updated);
                        }}
                        placeholder='Cantidad de empleados'
                      />
                      {(sub.id || sub.uid) && (
                        <button
                          type='button'
                          className='delete-subcargo-button'
                          onClick={() => handleSubcargoDelete(index, sub)}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              <button
                type='button'
                className='add-subcargo-link'
                onClick={handleAddLocalSubcargo}
              >
                + Agregar Subcargo
              </button>
            </div>

            <div className='action-buttons'>
              <Button
                type='submit'
                variant='submit'
                className='small-button'
              >
                Guardar
              </Button>
              <Button
                type='button'
                variant='cancel'
                className='small-button'
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button
                type='button'
                variant='delete'
                className='small-button'
                onClick={onDeleteRole}
              >
                Eliminar Cargo
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
