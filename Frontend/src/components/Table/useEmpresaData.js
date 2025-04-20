import { useEffect, useState } from 'react'

export function useEmpresaData() {
	const [empresaId, setEmpresaId] = useState(null)
	const [tableData, setTableData] = useState([])
	const [totalEmpleados, setTotalEmpleados] = useState(0)
	const [empleadosAsignados, setEmpleadosAsignados] = useState(0)

	useEffect(() => {
		const fetchData = async () => {
			try {
				const empresasRes = await fetch('http://localhost:3000/empresas')
				const empresas = await empresasRes.json()

				if (empresas.length > 0) {
					const latest = empresas[empresas.length - 1]
					const empresaId = latest.id
					setEmpresaId(empresaId)
					setTotalEmpleados(latest.empleados)

					const areaNames = latest.areas_nombres || []
					const rolesRes = await fetch(`http://localhost:3000/roles/empresa/${empresaId}`)
					if (!rolesRes.ok) throw new Error('Error cargando roles')
					const roles = await rolesRes.json()

					const empleadosContados = roles.reduce((total, rol) => total + (rol.employees || 0), 0)
					setEmpleadosAsignados(empleadosContados)

					const generatedAreas = Array.from({ length: latest.areas }, (_, i) => {
						const name = areaNames[i] || `Área ${i + 1}`
						const rolesForArea = roles.filter((r) => r.area === name)

						const rolesData = ['J1', 'J2', 'J3', 'J4'].map((j) => {
							const role = rolesForArea.find((r) => r.jerarquia === j)
							return role
								? {
										hierarchy: j,
										position: role.position,
										employees: role.employees,
										subcargos: role.subcargos || [],
								  }
								: {
										hierarchy: j,
										position: null,
										employees: null,
										subcargos: [],
								  }
						})

						return {
							name,
							roles: rolesData,
						}
					})

					setTableData(generatedAreas)
				}
			} catch (err) {
				console.error('❌ Error al cargar datos:', err.message)
			}
		}

		fetchData()
	}, [])

	return {
		empresaId,
		tableData,
		setTableData,
		totalEmpleados,
		empleadosAsignados,
		setEmpleadosAsignados,
	}
}
