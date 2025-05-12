// EditRoleModal.jsx
import React from 'react'
import { Button } from '../Buttons/Button'
import './Table.css'

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
  onDeleteRole
}) {
  // Elimina sólo en el servidor y luego en local
  const handleSubcargoDelete = async (index, subcargo) => {
    const confirmDelete = window.confirm(`¿Eliminar el subcargo "${subcargo.nombre}"?`)
    if (!confirmDelete) return

    try {
      // Esperamos a que el backend borre el subcargo
      await onDeleteSubcargo(subcargo.id)
      // Luego lo quitamos del state local
      const updated = [...subcargos]
      updated.splice(index, 1)
      onSubcargosChange(updated)
      alert('✅ Subcargo eliminado correctamente')
    } catch (err) {
      console.error('❌ Error eliminando subcargo:', err)
      alert('❌ Error al eliminar subcargo')
    }
  }

  // Añade sólo en local un nuevo subcargo en blanco
  const handleAddLocalSubcargo = () => {
    onSubcargosChange([...subcargos, { nombre: '', personas: 0 }])
  }

  return (
    <div className='modal-container'>
      <div className='overlay'>
        <div className='modal-content'>
          <form
            onSubmit={e => {
              e.preventDefault()
              onSave()
            }}
          >
            <h3>Editar Cargo</h3>

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
                  onChange={e => onEmployeesChange(e.target.value)}
                  placeholder='Cantidad de empleados'
                />
              </div>
            </div>

            <div className='divider' />

            <div className='subcargos-section'>
              <label>Subcargos</label>
              {subcargos.map((sub, index) => (
                <div key={sub.id ?? index} className='subcargo-row'>
                  <div className='subcargo-input-group'>
                    <input
                      value={sub.nombre || ''}
                      onChange={e => {
                        const updated = [...subcargos]
                        updated[index] = { ...updated[index], nombre: e.target.value }
                        onSubcargosChange(updated)
                      }}
                      placeholder={`Subcargo ${index + 1}`}
                    />
                  </div>
                  <div className='subcargo-input-group'>
                    <input
                      type='number'
                      value={sub.personas ?? ''}
                      onChange={e => {
                        const updated = [...subcargos]
                        updated[index] = {
                          ...updated[index],
                          personas: parseInt(e.target.value, 10) || 0
                        }
                        onSubcargosChange(updated)
                      }}
                      placeholder='Cantidad de empleados'
                    />
                    {sub.id && (
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
              ))}

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
  )
}
