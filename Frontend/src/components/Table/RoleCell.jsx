import React from 'react'
import './Table.css'

export default function RoleCell({ areaId, jerarquia, cargos, onClick }) {
	const cargosFiltrados = cargos.filter((c) => c.area_id === areaId && c.jerarquia_id === jerarquia)

	const handleClick = () => {
		const cargo = cargosFiltrados[0] || null
		onClick(cargo, jerarquia)
	}

	if (cargosFiltrados.length > 0) {
		const { nombre, personas } = cargosFiltrados[0]
		return (
			<span onClick={handleClick}>
				<p className='role-name'>{nombre}</p>|<p>{personas}</p>
			</span>
		)
	}

	return (
		<button type='button' className='empty-role' onClick={handleClick}>
			+
		</button>
	)
}
