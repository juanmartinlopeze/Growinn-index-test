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
			<svg xmlns='http://www.w3.org/2000/svg' width='15' height='15' fill='none' viewBox='0 0 15 15'>
				<path fill='#E9683B' d='M6.8 8.5h-6v-2h6v-6h2v6h6v2h-6v6h-2z' />
			</svg>
		</button>
	)
}
