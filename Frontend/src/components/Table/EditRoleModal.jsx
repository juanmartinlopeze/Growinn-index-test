import React from 'react'
import { Button } from '../Buttons/Button'
import { deleteSubcargo, fetchAllRoles } from './api'

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
			const allRoles = await fetchAllRoles(empresaId)
			const role = allRoles.find((r) => r.area === selectedArea && r.jerarquia === selectedHierarchy && r.position === position)
			const roleId = role?.id

			if (!roleId) {
				alert('⚠️ No se pudo encontrar el rol en la base de datos.')
				return
			}

			await deleteSubcargo(roleId, name)

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
							Agregar Cargo en ({selectedArea} - {selectedHierarchy})
						</h3>
						<div className='input-row'>
							<div className='input-group'>
								<label htmlFor='position'>Cargo</label>
								<input value={position} onChange={(e) => onPositionChange(e.target.value)} placeholder='Nombre del cargo' id='position' />
							</div>
							<div className='input-group'>
								<label htmlFor='employees'>Empleados</label>
								<input value={employees} onChange={(e) => onEmployeesChange(e.target.value)} type='number' placeholder='Cantidad de empleados' id='employees' />
							</div>
						</div>
						<div className='divider'></div>
						<div className='subcargos-section'>
							<label>Subcargos</label>
							{subcargos.map((sub, index) => (
								<div key={index} className='subcargo-row'>
									<div className='subcargo-input-group'>
										<input
											value={sub.name || ''}
											onChange={(e) => {
												const updated = [...subcargos]
												updated[index].name = e.target.value
												onSubcargosChange(updated)
											}}
											placeholder='Nombre del subcargo'
										/>
									</div>
									<div className='subcargo-input-group'>
										<input
											id='subcargo-employees'
											type='number'
											value={sub.employees || ''}
											onChange={(e) => {
												const updated = [...subcargos]
												updated[index].employees = parseInt(e.target.value)
												onSubcargosChange(updated)
											}}
											placeholder='Cantidad de empleados'
										/>
										<button type='button' className='delete-subcargo-button' onClick={() => handleSubcargoDelete(index, sub.name)}>
											{
												<svg className='deleteSvg' width='15' height='16' viewBox='0 0 15 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
													<path
														d='M13.5004 3.78579C11.1694 3.55479 8.82437 3.43579 6.48638 3.43579C5.10038 3.43579 3.71438 3.50579 2.32839 3.64579L0.900391 3.78579'
														stroke-width='1.5'
														stroke-linecap='round'
														stroke-linejoin='round'
													/>
													<path
														d='M4.75098 3.079L4.90498 2.162C5.01698 1.497 5.10098 1 6.28397 1H8.11797C9.30097 1 9.39197 1.525 9.49697 2.169L9.65097 3.079'
														stroke-width='1.5'
														stroke-linecap='round'
														stroke-linejoin='round'
													/>
													<path
														d='M11.9962 5.9978L11.5412 13.0468C11.4642 14.1458 11.4012 14.9998 9.44823 14.9998H4.95424C3.00125 14.9998 2.93825 14.1458 2.86125 13.0468L2.40625 5.9978'
														stroke-width='1.5'
														stroke-linecap='round'
														stroke-linejoin='round'
													/>
													<path d='M6.03125 11.1499H8.36224' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' />
													<path d='M5.4502 8.3501H8.95019' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' />
												</svg>
											}
										</button>
									</div>
								</div>
							))}

							<button type='button' className='add-subcargo-link' onClick={() => onSubcargosChange([...subcargos, { name: '', employees: '' }])}>
								{
									<svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
										<path
											d='M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z'
											stroke='#F56F10'
											stroke-width='1.5'
											stroke-linecap='round'
											stroke-linejoin='round'
										/>
										<path d='M8 12H16' stroke='#F56F10' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' />
										<path d='M12 16V8' stroke='#F56F10' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' />
									</svg>
								}{' '}
								Agregar Subcargo
							</button>
						</div>

						<div className='action-buttons'>
							<Button type='button' variant='cancel' className='small-button' onClick={onClose}>
								Cancelar
							</Button>
							<Button type='button' variant='delete' className='small-button' onClick={onDelete}>
								Eliminar
							</Button>
							<Button type='submit' variant='submit' className='small-button' onClick={onSave}>
								Guardar
							</Button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}
