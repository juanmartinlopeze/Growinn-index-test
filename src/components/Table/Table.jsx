import React, { useState } from 'react'
import areasData from '../../data/data'
import './Table.css'

export function Table() {
	const [modal, setModal] = useState(false)
	const [tableData, setTableData] = useState(areasData)
	const [selectedHierarchy, setSelectedHierarchy] = useState(null)
	const [selectedArea, setSelectedArea] = useState(null)
	const [position, setPosition] = useState('')
	const [employees, setEmployees] = useState('')

	const svg = (
		<svg width='24' height='25' viewBox='0 0 24 25' fill='none' xmlns='http://www.w3.org/2000/svg'>
			<path
				d='M12 22.0646C17.5 22.0646 22 17.5646 22 12.0646C22 6.56458 17.5 2.06458 12 2.06458C6.5 2.06458 2 6.56458 2 12.0646C2 17.5646 6.5 22.0646 12 22.0646Z'
				stroke='#292D32'
				stroke-width='1.5'
				stroke-linecap='round'
				stroke-linejoin='round'
			/>
			<path d='M12 8.06458V13.0646' stroke='#292D32' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' />
			<path d='M11.9945 16.0646H12.0035' stroke='#292D32' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' />
		</svg>
	)

	function handleSave(e) {
		e.preventDefault()

		if (!position || !employees) {
			alert('Todos los campos son obligatorios')
			return
		}

		setTableData((prevData) =>
			prevData.map((area) => {
				if (area.name === selectedArea) {
					return {
						...area,
						roles: area.roles.map((role) => (role.hierarchy === selectedHierarchy ? { ...role, position, employees } : role)),
					}
				}
				return area
			})
		)

		setPosition('')
		setEmployees('')
		toggleModal()
	}

	function toggleModal() {
		setModal(!modal)
	}

	return (
		<>
			<div className='table-container'>
				<table>
					<thead>
						<tr>
							<th id='blank'></th>
							<th className='jerarquia'>
								<div>J1{svg}</div>
							</th>
							<th className='jerarquia'>
								<div>J2{svg}</div>
							</th>
							<th className='jerarquia'>
								<div>J3{svg}</div>
							</th>
							<th className='jerarquia'>
								<div>J4{svg}</div>
							</th>
						</tr>
					</thead>
					<tbody>
						{tableData.map((area, index) => (
							<tr key={index}>
								<th className='area-row' scope='row'>
									<div className='area-name'>
										{area.name}
										{svg}
									</div>
								</th>
								{area.roles.map((role, roleIndex) => {
									const isRowFilled = area.roles.some((r) => r.position !== null)

									return (
										<td key={roleIndex}>
											{role.position ? (
												<span>
													<p className='role-name'>{role.position}</p> | <p>{role.employees}</p>
												</span>
											) : (
												<button
													disabled={isRowFilled}
													className={isRowFilled ? 'btn-disabled' : ''}
													onClick={() => {
														setSelectedArea(area.name) //Puede ser merged en 1 obj
														setSelectedHierarchy(role.hierarchy) //
														toggleModal()
													}}
												>
													+
												</button>
											)}
										</td>
									)
								})}
							</tr>
						))}
					</tbody>
				</table>
			</div>
			{modal && (
				<div className='modal-container'>
					<div className='overlay'>
						<div className='modal-content'>
							<form onSubmit={handleSave}>
								<label htmlFor='position'>Cargo</label>
								<input type='text' id='position' value={position} onChange={(e) => setPosition(e.target.value)} />
								<label htmlFor='employees'>Empleados</label>
								<input type='number' id='employees' value={employees} onChange={(e) => setEmployees(e.target.value >= 0 ? e.target.value : '')} />
								<button type='submit'>Guardar</button>
							</form>
						</div>
					</div>
				</div>
			)}
		</>
	)
}
