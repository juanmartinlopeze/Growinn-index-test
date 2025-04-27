import React from 'react'
import { Button } from '../index'

export default function EditAreaForm({ areaName, onChange, onSave, onCancel, onDelete }) {
	return (
		<div className='modal-container'>
			<div className='overlay'>
				<div className='modal-content'>
					<h3>Editar nombre del área</h3>
					<input value={areaName} onChange={(e) => onChange(e.target.value)} placeholder='Nuevo nombre del área' />
					<div className='modal-buttons'>
						<Button variant='submit' className='submit-button' onClick={onSave} />
						<Button variant='delete' className='delete-button' onClick={onDelete} />
						<Button variant='cancel' className='cancel-button' onClick={onCancel} />
					</div>
				</div>
			</div>
		</div>
	)
}
