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
		<button type='button' className='empty-role group' onClick={handleClick}>
			<svg className='fill-primary-n500 group-hover:fill-neutral-50 transition-colors duration-0' width='24' height='25' viewBox='0 0 24 25' fill='none' xmlns='http://www.w3.org/2000/svg'>
				<path d='M11 13.5H5V11.5H11V5.5H13V11.5H19V13.5H13V19.5H11V13.5Z' />
			</svg>
		</button>
	)
}
