import React, { useState } from 'react'
import { Button } from '../index'

export default function EditAreaForm({ areaName, onChange, onSave, onCancel, onDelete }) {
	const [error, setError] = useState('')

	const handleSave = () => {
		if (!areaName.trim()) {
			setError('El nombre del área no puede estar vacío.')
			return
		}
		setError('')
		onSave()
	}

	return (
		<div className='modal-container'>
			<div className='overlay'>
				<div className='modal-content'>
					<h3>Editar nombre del área</h3>
					<input value={areaName} onChange={(e) => onChange(e.target.value)} placeholder='Nuevo nombre del área' />
					{error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
					<div className='action-buttons'>
						<Button type='button' variant='cancel' className='small-button' onClick={onCancel}>
							Cancelar
						</Button>
						<Button type='button' variant='delete' className='small-button' onClick={onDelete}>
							Eliminar
						</Button>
						<Button type='submit' variant='submit' className='small-button' onClick={handleSave}>
							Guardar
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
