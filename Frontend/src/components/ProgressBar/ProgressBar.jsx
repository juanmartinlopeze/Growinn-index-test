import React from 'react'
import './ProgressBar.css'

const ProgressBar = ({ empleadosAsignados, empleadosPlaneados }) => {
	const porcentaje = empleadosPlaneados > 0 ? Math.min((empleadosAsignados / empleadosPlaneados) * 100, 100) : 0

	let borderColor = '#ccc'
	if (empleadosPlaneados > 0) {
		if (porcentaje < 25) borderColor = '#FB2828'
		else if (porcentaje < 75) borderColor = '#E2EB3E'
		else borderColor = '#00BC73'
	}

	return (
		<div className='progress-bar-container' style={{ borderColor }}>
			<div className='progress-bar-fill' style={{ width: `${porcentaje}%` }} />
			<div className='progress-bar-text'>
				<img src='/icon-people.png' alt='Icono personas' />
				{empleadosAsignados} / {empleadosPlaneados}
			</div>
		</div>
	)
}

export default ProgressBar
