// Table.js
import React, { useEffect, useState } from 'react'
import { Tooltip, FeedbackMessage } from '../index'
import ProgressBar from '../ProgressBar/ProgressBar'
import { deleteCargo, deleteSubcargo, fetchAreas, fetchCargos, fetchEmpresas, fetchSubcargos, fetchSubcargosByCargo, fetchUsuarios, saveCargo, saveSubcargo, updateArea, updateCargo } from './api'
import EditAreaForm from './EditAreaForm'
import EditRoleModal from './EditRoleModal'
import RoleCell from './RoleCell'
import './Table.css'
import { useEmpresaData } from './useEmpresaData'

export function Table() {
	const [empresaId, setEmpresaId] = useState(null)
	const [areas, setAreas] = useState([])
	const [cargos, setCargos] = useState([])
	const [subcargos, setSubcargos] = useState([])
	const [usuarios, setUsuarios] = useState([])

	const [modal, setModal] = useState(false)
	const [areaModal, setAreaModal] = useState(false)

	const [selectedArea, setSelectedArea] = useState(null)
	const [selectedCargo, setSelectedCargo] = useState(null)
	const [selectedJerarquia, setSelectedJerarquia] = useState(null)

	const [position, setPosition] = useState('')
	const [employees, setEmployees] = useState('')
	const [subcargoList, setSubcargoList] = useState([])

	const [areaName, setAreaName] = useState('')
	const [areaIndex, setAreaIndex] = useState(null)

	const { empleadosPorJerarquia, jerarquiasPlaneadas, empleadosAsignados, totalEmpleados, refetch } = useEmpresaData()

	const jerarquias = ['J1', 'J2', 'J3', 'J4']

	const jerarquiaIcons = {
		J1: '/src/assets/icons/IconJ1.png',
		J2: '/src/assets/icons/IconJ2.png',
		J3: '/src/assets/icons/IconJ3.png',
		J4: '/src/assets/icons/IconJ4.png',
	}

	const nivelesJerarquia = {
		J1: 'La Jerarquía 1 (Ejecución)',
		J2: 'La Jerarquía 2 (Supervisión)',
		J3: 'La Jerarquía 3 (Gerencial)',
		J4: 'La Jerarquía 4 (Directivo)',
	}

	// Función única para cargar todos los datos de tabla
	const loadAll = async () => {
		const empresas = await fetchEmpresas()
		const empresaActual = empresas[empresas.length - 1]
		setEmpresaId(empresaActual.id)

		const [areasData, cargosData, subcargosData, usuariosData] = await Promise.all([fetchAreas(empresaActual.id), fetchCargos(), fetchSubcargos(), fetchUsuarios()])

		setAreas(areasData)
		setCargos(cargosData.filter((c) => areasData.some((a) => a.id === c.area_id)))
		setSubcargos(subcargosData)
		setUsuarios(usuariosData.filter((u) => u.empresa_id === empresaActual.id))
	}

	// Carga inicial
	useEffect(() => {
		loadAll()
	}, [])

	const openAreaModal = (index, name) => {
		setAreaIndex(index)
		setAreaName(name)
		setAreaModal(true)
	}

	const openRoleModal = (area, cargo, jerarquia) => {
		setSelectedArea(area)
		setSelectedCargo(cargo)
		setSelectedJerarquia(jerarquia)
		setPosition(cargo?.nombre || '')
		setEmployees(cargo?.personas || '')
		setSubcargoList(subcargos.filter((s) => s.cargo_id === cargo?.id))
		setModal(true)
	}

	const handleSaveAreaName = async () => {
		await updateArea(areas[areaIndex].id, areaName)
		const updated = [...areas]
		updated[areaIndex].nombre = areaName
		setAreas(updated)
		setAreaModal(false)
	}

	const handleSaveEverything = async () => {
		if (!position || !employees) {
			alert('Completa todos los campos')
			return
		}

		const totalSub = subcargoList.reduce((t, s) => t + (s.personas || 0), 0)
		const totalCargo = parseInt(employees, 10)

		if (totalSub > totalCargo) {
			alert('❌ La suma de subcargos supera el total de empleados asignado al cargo.')
			return
		}

		if (totalSub < totalCargo) {
			alert('⚠️ Faltan empleados por distribuir entre los subcargos.')
			return
		}

		let cargoId
		try {
			if (!selectedCargo?.id) {
				const nuevo = await saveCargo({
					nombre: position,
					personas: parseInt(employees, 10),
					area_id: selectedArea.id,
					jerarquia_id: String(selectedJerarquia),
				})
				cargoId = nuevo.id
				setCargos((prev) => [...prev, nuevo])
			} else {
				cargoId = selectedCargo.id
				await updateCargo(cargoId, { nombre: position, personas: parseInt(employees, 10) })
				setCargos((prev) => prev.map((c) => (c.id === cargoId ? { ...c, nombre: position, personas: parseInt(employees, 10) } : c)))
			}

			for (const sub of subcargoList) {
				if (!sub.id && sub.nombre.trim()) {
					await saveSubcargo({ nombre: sub.nombre, personas: parseInt(sub.personas || 0, 10), cargo_id: cargoId })
				}
			}

			const subAct = await fetchSubcargosByCargo(cargoId)
			setSubcargos((prev) => [...prev.filter((s) => s.cargo_id !== cargoId), ...subAct])
			setSubcargoList(subAct)
		} catch (err) {
			console.error('Error al guardar:', err)
			alert('Error al guardar cargo o subcargos')
			return
		}

		try {
			await refetch()
		} catch (e) {
			console.warn('Error refetch:', e)
		}
		await loadAll()
		setModal(false)
	}

	const handleDeleteRole = async () => {
		if (!selectedCargo) return
		if (!window.confirm(`¿Eliminar cargo "${selectedCargo.nombre}"?`)) return

		try {
			await deleteCargo(selectedCargo.id)
			setCargos((prev) => prev.filter((c) => c.id !== selectedCargo.id))
		} catch (err) {
			console.error('Error al eliminar cargo:', err)
			alert('Error al eliminar cargo')
			return
		}

		try {
			await refetch()
		} catch (e) {
			console.warn('Error refrescando métricas:', e)
		}
		await loadAll()
		setModal(false)
	}

	const handleAddSubcargo = () => {
		setSubcargoList((prev) => [...prev, { nombre: '', personas: 0 }])
	}

	const handleDeleteSubcargo = async (id) => {
		if (!window.confirm('¿Eliminar subcargo?')) return
		try {
			await deleteSubcargo(id)
			setSubcargos((prev) => prev.filter((s) => s.id !== id))
			setSubcargoList((prev) => prev.filter((s) => s.id !== id))
		} catch (e) {
			console.error('Error al eliminar subcargo:', e)
			alert('Error al eliminar subcargo')
		}
	}

	const handleDeleteArea = async () => {
		if (!window.confirm(`¿Eliminar área "${areaName}"?`)) return
		try {
			const id = areas[areaIndex].id
			await fetch(`http://localhost:3000/areas/${id}`, { method: 'DELETE' })
			setAreas((prev) => prev.filter((_, i) => i !== areaIndex))
		} catch (e) {
			console.error('Error al eliminar área:', e)
			alert('Error al eliminar área')
		}
		setAreaModal(false)
	}

	return (
		<>
			<div style={{ margin: '16px 0' }}>
				<h4>Progreso total de la empresa</h4>
			</div>
			<div className='table-container'>
				<table>
					<thead>
						<tr>
							<th />
							{jerarquias.map((j) => (
								<th key={j} className='jerarquia'>
									<div>
										<div>
											<p>{j}</p>
										</div>
										<div>
											<Tooltip triggerText={<img src={jerarquiaIcons[j]} alt={j} width={40} />} popupText={nivelesJerarquia[j]} />
										</div>
									</div>
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{areas.map((area, i) => (
							<tr key={area.id}>
								<th className='area-row'>
									<div className='area-name' onClick={() => openAreaModal(i, area.nombre)} style={{ cursor: 'pointer' }}>
										<p>{area.nombre}</p>
										{
											<svg fill='none' xmlns='http://www.w3.org/2000/svg'>
												<path
													d='M10.4753 2.84195L2.17058 11.1467C1.84214 11.4752 1.53712 12.0851 1.46674 12.5309L1.021 15.698C0.856777 16.8475 1.65443 17.6451 2.80396 17.4809L5.97105 17.0352C6.41679 16.9648 7.0502 16.6598 7.35517 16.3313L15.66 8.02662C17.091 6.59557 17.7713 4.92992 15.66 2.81854C13.572 0.730617 11.9063 1.4109 10.4753 2.84195Z'
													stroke='#292D32'
													stroke-width='2'
													stroke-miterlimit='10'
													stroke-linecap='round'
													stroke-linejoin='round'
												/>
												<path
													d='M9.27904 4.03833C9.98283 6.57199 11.9535 8.54262 14.4871 9.24641'
													stroke='#292D32'
													stroke-width='2'
													stroke-miterlimit='10'
													stroke-linecap='round'
													stroke-linejoin='round'
												/>
											</svg>
										}
									</div>
								</th>
								{jerarquias.map((j) => (
									<td key={j}>
										<RoleCell
											areaId={area.id}
											jerarquia={j}
											cargos={cargos.filter((c) => c.area_id === area.id && c.jerarquia_id === j)}
											subcargos={subcargos}
											usuarios={usuarios}
											onClick={(c, jer) => openRoleModal(area, c, jer)}
										/>
									</td>
								))}
							</tr>
						))}
					</tbody>
					<tfoot>
						<tr>
							<td className='area-column'>
								<ProgressBar empleadosAsignados={empleadosAsignados} empleadosPlaneados={totalEmpleados} />
							</td>

							{jerarquias.map((j) => (
								<td key={j}>
									<ProgressBar empleadosAsignados={empleadosPorJerarquia[j]} empleadosPlaneados={jerarquiasPlaneadas[j]} />
								</td>
							))}
						</tr>
						<tr>
							{jerarquias.map((j) => (
								<td key={j}></td>
							))}
						</tr>
					</tfoot>
				</table>
				<FeedbackMessage
					empleadosAsignados={empleadosAsignados}
					totalEmpleados={totalEmpleados}
				/>
			</div>

			{modal && (
				<EditRoleModal
					position={position}
					employees={employees}
					subcargos={subcargoList}
					onPositionChange={setPosition}
					onEmployeesChange={setEmployees}
					onSubcargosChange={setSubcargoList}
					onSave={handleSaveEverything}
					onClose={() => setModal(false)}
					onDeleteSubcargo={handleDeleteSubcargo}
					onDeleteRole={handleDeleteRole}
					onAddSubcargo={handleAddSubcargo}
				/>
			)}

			{areaModal && <EditAreaForm areaName={areaName} onChange={setAreaName} onSave={handleSaveAreaName} onCancel={() => setAreaModal(false)} onDelete={handleDeleteArea} />}
		</>
	)
}

export default Table
