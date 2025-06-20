import React, { useEffect, useState } from 'react'
import { Button, Table, TitleSection } from '../../components/index'
import './datos_prueba.css'

export function DatosPrueba() {
	const [empleados, setEmpleados] = useState(0) // Número total de empleados

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch('http://localhost:3000/empresas') // Endpoint para obtener los datos
				if (response.ok) {
					const data = await response.json() // Datos obtenidos del backend
					if (data.length > 0) {
						const latestData = data[data.length - 1] // Obtener el último registro (el más reciente)
						setEmpleados(latestData.cantidad_empleados) // Cambiado a "cantidad_empleados"
					} else {
						console.warn('No se encontraron datos en la respuesta del backend.')
					}
				} else {
					console.error(`Error al obtener los datos del backend: ${response.status} ${response.statusText}`)
				}
			} catch (error) {
				console.error('Error al conectar con el servidor:', error)
			}
		}

		fetchData()
	}, [])

	return (
		<>
			<section className='container'>
				<TitleSection title='Tabla de Jerarquías y áreas' />
				<Table />

				<section className='navigation-buttons'>
					<Button variant='back' to='/innlab_form' />
					<Button variant='next' text='Siguiente' to='/download_page' />
				</section>
			</section>
			<img className='line-bckg-img' src='/BgLine-decoration.png' alt='' />
			<img className='dots-bckg-img' src='/BgPoints-decoration.png' alt='' />
		</>
	)
}
