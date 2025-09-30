import React, { memo } from 'react'
import './Table.css'

// Componente optimizado con memo
function RoleCell({ cargo, subcargos, onClick }) {
	if (cargo) {
		const { nombre, personas } = cargo
		return (
			<span onClick={onClick}>
				<p className='role-name'>{nombre}</p>|<p>{personas}</p>
			</span>
		)
	}

	return (
		<button type='button' className='empty-role group' onClick={onClick}>
			<svg className='fill-primary-n500 group-hover:fill-neutral-50 transition-colors duration-0' width='24' height='25' viewBox='0 0 24 25' fill='none' xmlns='http://www.w3.org/2000/svg'>
				<path d='M11 13.5H5V11.5H11V5.5H13V11.5H19V13.5H13V19.5H11V13.5Z' />
			</svg>
		</button>
	)
}

// Función de comparación personalizada para memo
const areEqual = (prevProps, nextProps) => {
	// Comparar cargo
	if (prevProps.cargo?.id !== nextProps.cargo?.id) return false
	if (prevProps.cargo?.nombre !== nextProps.cargo?.nombre) return false
	if (prevProps.cargo?.personas !== nextProps.cargo?.personas) return false
	
	// Comparar onClick (referencia)
	if (prevProps.onClick !== nextProps.onClick) return false
	
	// Comparar subcargos length (básico)
	if (prevProps.subcargos?.length !== nextProps.subcargos?.length) return false
	
	return true
}

export default memo(RoleCell, areEqual)
