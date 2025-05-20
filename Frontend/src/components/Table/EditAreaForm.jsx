import React, { useState } from 'react'
import { Button } from '../index'
import { useAlert } from '../Alerts/useAlert'

export default function EditAreaForm({ areaName, onChange, onSave, onCancel, onDelete }) {
	const [error, setError] = useState('')
	const { alertInfo, showAlert } = useAlert()

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
					{alertInfo && (
						<Alert
							{...alertInfo}
							position="top-center"
							onConfirm={alertInfo.onConfirm}
							onCancel={alertInfo.onCancel}
						/>
					)}
					<h3>Editar Área</h3>
					<input
						type="text"
						value={areaName}
						onChange={(e) => onChange(e.target.value)}
					/>
					<div className='action-buttons'>
						<Button variant="submit" onClick={onSave}>
							Guardar
						</Button>
						<Button variant="cancel" onClick={onCancel}>
							Cancelar
						</Button>
						<Button variant="delete" onClick={onDelete}>
							Eliminar Área
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
