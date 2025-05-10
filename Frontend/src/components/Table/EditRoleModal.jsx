import React from 'react'
import { Button } from '../Buttons/Button'
import './Table.css'

export default function EditRoleModal({ position, employees, subcargos, onPositionChange, onEmployeesChange, onSubcargosChange, onClose, onSave, onDeleteSubcargo, onDeleteRole }) {
	const handleSubcargoDelete = async (index, subcargo) => {
		const confirmDelete = window.confirm(`¿Eliminar el subcargo "${subcargo.nombre}"?`)
		if (!confirmDelete) return

		try {
			onDeleteSubcargo(subcargo.id)

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
					<form
						onSubmit={(e) => {
							e.preventDefault()
							onSave()
						}}
					>
						<h3>Editar Cargo</h3>

						<div className='input-row'>
							<div className='input-group'>
								<label htmlFor='position'>Cargo</label>
								<input id='position' value={position} onChange={(e) => onPositionChange(e.target.value)} placeholder='Nombre del cargo' />
							</div>
							<div className='input-group'>
								<label htmlFor='employees'>Empleados</label>
								<input id='employees' type='number' value={employees} onChange={(e) => onEmployeesChange(e.target.value)} placeholder='Cantidad de empleados' />
							</div>
						</div>

						<div className='divider' />

						<div className='subcargos-section'>
							<label>Subcargos</label>
							{subcargos.map((subcargo, index) => (
								<div key={index} className='subcargo-row'>
									<div className='subcargo-input-group'>
										<input
											value={subcargo.nombre || ''}
											onChange={(e) => {
												const updated = [...subcargos]
												updated[index].nombre = e.target.value
												onSubcargosChange(updated)
											}}
											placeholder='Nombre del subcargo'
										/>
									</div>
									<div className='subcargo-input-group'>
										<input
											id='subcargo-employees'
											type='number'
											value={subcargo.personas || ''}
											onChange={(e) => {
												const updated = [...subcargos]
												updated[index].personas = parseInt(e.target.value, 10)
												onSubcargosChange(updated)
											}}
											placeholder='Cantidad de empleados'
										/>
										<button type='button' className='delete-subcargo-button' onClick={() => handleSubcargoDelete(index, subcargo)}>
											{
												<svg width='15' height='16' viewBox='0 0 15 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
													<path
														d='M13.5001 3.78603C11.1691 3.55503 8.82413 3.43604 6.48613 3.43604C5.10014 3.43604 3.71414 3.50604 2.32814 3.64603L0.900146 3.78603'
														stroke-width='1.5'
														stroke-linecap='round'
														stroke-linejoin='round'
													/>
													<path
														d='M4.75049 3.07912L4.90449 2.16212C5.01649 1.49712 5.10049 1.00012 6.28348 1.00012H8.11748C9.30048 1.00012 9.39148 1.52512 9.49648 2.16912L9.65048 3.07912'
														stroke-width='1.5'
														stroke-linecap='round'
														stroke-linejoin='round'
													/>
													<path
														d='M11.9957 5.99792L11.5407 13.0469C11.4637 14.1459 11.4007 14.9999 9.44775 14.9999H4.95376C3.00076 14.9999 2.93776 14.1459 2.86076 13.0469L2.40576 5.99792'
														stroke-width='1.5'
														stroke-linecap='round'
														stroke-linejoin='round'
													/>
													<path d='M6.03125 11.15H8.36224' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' />
													<path d='M5.4502 8.3501H8.95019' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' />
												</svg>
											}
										</button>
									</div>
								</div>
							))}

							<button type='button' className='add-subcargo-link' onClick={() => onSubcargosChange([...subcargos, { nombre: '', personas: '' }])}>
								{
									<svg width='20' height='20' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
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
							<Button type='button' variant='delete' className='small-button' onClick={onDeleteRole}>
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
