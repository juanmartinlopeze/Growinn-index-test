import React from 'react'

export default function EditRoleModal({
	selectedArea,
	selectedHierarchy,
	position,
	employees,
	subcargos,
	onPositionChange,
	onEmployeesChange,
	onSubcargosChange,
	onClose,
	onSave,
	onDelete,
	empresaId,
}) {
	const handleSubcargoDelete = async (index, name) => {
		const confirmDelete = window.confirm(`¿Eliminar el subcargo "${name}"?`)
		if (!confirmDelete) return

		try {
			const res = await fetch(`http://localhost:3000/roles/empresa/${empresaId}`)
			const allRoles = await res.json()
			const role = allRoles.find((r) => r.area === selectedArea && r.jerarquia === selectedHierarchy && r.position === position)
			const roleId = role?.id
			if (!roleId) {
				alert('⚠️ No se pudo encontrar el rol en la base de datos.')
				return
			}

			const deleteRes = await fetch(`http://localhost:3000/roles/${roleId}/subcargos/${encodeURIComponent(name)}`, { method: 'DELETE' })

			if (!deleteRes.ok) {
				const data = await deleteRes.json()
				throw new Error(data.error || 'Error al eliminar')
			}

			const updated = [...subcargos]
			updated.splice(index, 1)
			onSubcargosChange(updated)

			alert('✅ Subcargo eliminado correctamente')
		} catch (err) {
			console.error('❌ Error eliminando subcargo:', err)
			alert('❌ Error al eliminar subcargo')
		}
	}

	return (
		<div className='modal-container'>
			<div className='overlay'>
				<div className='modal-content'>
					<form onSubmit={onSave}>
						<h3>
							Agregar Cargo en {selectedArea} - {selectedHierarchy}
						</h3>
						<label htmlFor='position'>Cargo</label>
						<input value={position} onChange={(e) => onPositionChange(e.target.value)} placeholder='Nombre del cargo' id='position' />

						<label htmlFor='employees'>Empleados</label>
						<input value={employees} onChange={(e) => onEmployeesChange(e.target.value)} type='number' placeholder='Cantidad de empleados' id='employees' />

						<div className='subcargos-section'>
							<label>Subcargos:</label>
							{subcargos.map((sub, index) => (
								<div key={index} className='subcargo-item' style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
									<input
										value={sub.name || ''}
										onChange={(e) => {
											const updated = [...subcargos]
											updated[index].name = e.target.value
											onSubcargosChange(updated)
										}}
										placeholder={`Subcargo ${index + 1}`}
									/>
									<input
										type='number'
										value={sub.employees || ''}
										onChange={(e) => {
											const updated = [...subcargos]
											updated[index].employees = parseInt(e.target.value)
											onSubcargosChange(updated)
										}}
										style={{ width: '80px' }}
										placeholder='Empleados'
									/>
									<button type='button' onClick={() => handleSubcargoDelete(index, sub.name)}>
										✕
									</button>
								</div>
							))}
							<button type='button' className='add-subcargo-button' onClick={() => onSubcargosChange([...subcargos, { name: '', employees: '' }])}>
								Añadir Subcargo
							</button>
						</div>

						<div className='modal-buttons'>
							<button type='submit' className='submit-button'>
								Guardar
							</button>
							<button type='button' onClick={onDelete} className='delete-button'>
								Eliminar
							</button>
							<button type='button' onClick={onClose} className='cancel-button'>
								Cancelar
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}
