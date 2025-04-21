import { useEffect, useState } from 'react'

export function useEmpresaData() {
	const [empresaId, setEmpresaId] = useState(null)
	const [tableData, setTableData] = useState([])
	const [totalEmpleados, setTotalEmpleados] = useState(0)
	const [empleadosAsignados, setEmpleadosAsignados] = useState(0)
	const [empleadosPorJerarquia, setEmpleadosPorJerarquia] = useState({
		J1: 0,
		J2: 0,
		J3: 0,
		J4: 0
	})
	const [jerarquiasPlaneadas, setJerarquiasPlaneadas] = useState({
		J1: 0,
		J2: 0,
		J3: 0,
		J4: 0
	})

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

					setJerarquiasPlaneadas({
						J1: latest.jerarquia1 || 0,
						J2: latest.jerarquia2 || 0,
						J3: latest.jerarquia3 || 0,
						J4: latest.jerarquia4 || 0,
					})

					const areaNames = latest.areas_nombres || []
					const rolesRes = await fetch(`http://localhost:3000/roles/empresa/${empresaId}`)
					if (!rolesRes.ok) throw new Error('Error cargando roles')
					const roles = await rolesRes.json()

					// ✅ Nueva lógica basada en subcargos
					let totalAsignados = 0
					const jerarquiaCount = { J1: 0, J2: 0, J3: 0, J4: 0 }

					roles.forEach((rol) => {
						const sumaSubcargos = rol.subcargos?.reduce((acc, s) => acc + (s.employees || 0), 0) || 0
						totalAsignados += sumaSubcargos

						if (rol.jerarquia && jerarquiaCount[rol.jerarquia] !== undefined) {
							jerarquiaCount[rol.jerarquia] += sumaSubcargos
						}
					})

					setEmpleadosAsignados(totalAsignados)
					setEmpleadosPorJerarquia(jerarquiaCount)

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
		empleadosPorJerarquia,
		jerarquiasPlaneadas,
	}
}