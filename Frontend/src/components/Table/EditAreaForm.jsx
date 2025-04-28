import React from 'react'
import { Button } from '../index'

export default function EditAreaForm({ areaName, onChange, onSave, onCancel, onDelete }) {
	return (
		<div className='modal-container'>
			<div className='overlay'>
				<div className='modal-content'>
					<h3>Editar nombre del área</h3>
					<input value={areaName} onChange={(e) => onChange(e.target.value)} placeholder='Nuevo nombre del área' />
					<div className='action-buttons'>
						<Button type='button' variant='cancel' className='small-button' onClick={onCancel}>
							Cancelar
						</Button>
						<Button type='button' variant='delete' className='small-button' onClick={onDelete}>
							Eliminar
						</Button>
						<Button type='submit' variant='submit' className='small-button' onClick={onSave}>
							Guardar
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
