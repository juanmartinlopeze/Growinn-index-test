import './FeedbackMessage.css'

export const FeedbackMessage = ({ empleadosAsignados, totalEmpleados }) => {
	let mensaje = null

	if (empleadosAsignados === 0) {
		mensaje = (
			<p className='feedbackNeutral'>
				ℹ️ Aún no has asignado empleados a ninguna área. <br />
				Por favor, comienza a llenar la tabla para continuar con el proceso de distribución.
			</p>
		)
	} else if (empleadosAsignados === totalEmpleados) {
		mensaje = (
			<p className='feedbackSuccess'>
				✅ Has completado correctamente. Todos los empleados han sido asignados.
			</p>
		)
	} else if (empleadosAsignados > totalEmpleados) {
		mensaje = (
			<p className='feedbackError'>
				❌ Se han ingresado más empleados de los indicados inicialmente. Revisa si hubo un error en la asignación.
			</p>
		)
	} else {
		mensaje = (
			<p className='feedbackWarning'>
				⚠️ Faltan empleados por asignar. Revisa si aún quedan áreas sin completar.
			</p>
		)
	}

	return <div className='feedbackContainer'>{mensaje}</div>
}
