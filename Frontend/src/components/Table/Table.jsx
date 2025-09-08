// Table.jsx
import { useEffect, useState } from 'react'
import { loadStepData, saveStepData } from '../../components/Utils/breadcrumbUtils'
import { useAlert } from '../Alerts/useAlert'
import { Alert, FeedbackMessage, Tooltip } from '../index'
import ProgressBar from '../ProgressBar/ProgressBar'
import {
	deleteCargo,
	deleteSubcargo,
	fetchAreas,
	fetchCargos,
	fetchEmpresas,
	fetchSubcargos,
	fetchSubcargosByCargo,
	fetchUsuarios,
	saveCargo,
	saveSubcargo,
	updateArea,
	updateCargo,
	updateSubcargo,
} from './api'
import EditAreaForm from './EditAreaForm'
import EditRoleModal from './EditRoleModal'
import RoleCell from './RoleCell'
import './Table.css'
import { useEmpresaData } from './useEmpresaData'

export function Table() {
	const [empresaId, setEmpresaId] = useState(null)

	const saved = loadStepData('step3') || {}
	const [areas, setAreas] = useState(saved.areas || [])
	const [cargos, setCargos] = useState(saved.cargos || [])
	const [subcargos, setSubcargos] = useState(saved.subcargos || [])

	useEffect(() => {
		saveStepData('step3', { areas, cargos, subcargos })
	}, [areas, cargos, subcargos])

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
	const [alert, setAlert] = useState({
		show: false,
		message: '',
		type: 'error',
	})
	const { alertInfo, showAlert } = useAlert()

	// Métricas y recarga
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

	// Carga inicial de tabla
	useEffect(() => {
		async function loadAll() {
			const empresas = await fetchEmpresas()
			const empresaActual = empresas[empresas.length - 1]
			setEmpresaId(empresaActual.id)

			const [areasData, cargosData, subcargosData, usuariosData] = await Promise.all([fetchAreas(empresaActual.id), fetchCargos(), fetchSubcargos(), fetchUsuarios()])

			setAreas(areasData)
			setCargos(cargosData.filter((c) => areasData.some((a) => a.id === c.area_id)))
			setSubcargos(subcargosData)
			setUsuarios(usuariosData.filter((u) => u.empresa_id === empresaActual.id))
		}
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
		const actuales = subcargos
			.filter((s) => s.cargo_id === cargo?.id)
			.map((s) => ({
				id: s.id,
				uid: s.id ? undefined : Date.now() + Math.random(),
				nombre: s.nombre,
				personas: s.personas || 0,
			}))
		setSubcargoList(actuales)
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
		// 1. Validación de campos principales (Cargo y Total Empleados)
		// El nombre del cargo es obligatorio
		if (!position.trim()) {
			showAlert('error', 'Error de Validación', 'El nombre del cargo es obligatorio.')
			return // Detiene la ejecución si falla
		}

		// El total de empleados es obligatorio y debe ser un número no negativo
		const totalEmp = parseInt(employees, 10)
		if (isNaN(totalEmp) || totalEmp < 0) {
			showAlert('error', 'Error de Validación', 'La cantidad de empleados es obligatoria y debe ser un número no negativo.')
			return // Detiene la ejecución si falla
		}

		// 2. Validación de Subcargos (CONDICIONAL)
		// Este bloque SOLO se ejecuta si existen subcargos en la lista (`subcargoList`).
		if (subcargoList.length > 0) {
			// Itera sobre cada subcargo para validar sus campos
			for (const sub of subcargoList) {
				// El nombre del subcargo es obligatorio si hay subcargos
				if (!sub.nombre.trim()) {
					showAlert('error', 'Error de Validación', 'El nombre de todos los subcargos es obligatorio si hay subcargos.')
					return // Detiene la ejecución si falla
				}
				// La cantidad de personas en el subcargo es obligatoria y debe ser un número no negativo si hay subcargos
				const subPersonas = parseInt(sub.personas, 10)
				if (isNaN(subPersonas) || subPersonas < 0) {
					showAlert('error', 'Error de Validación', 'La cantidad de personas en todos los subcargos es obligatoria y debe ser un número no negativo si hay subcargos.')
					return // Detiene la ejecución si falla
				}
			}

			// Si hay subcargos, valida que la suma de sus empleados coincida con el total del cargo.
			const totalSub = subcargoList.reduce((sum, s) => sum + (s.personas || 0), 0)
			if (totalSub !== totalEmp) {
				showAlert('error', 'Error de validación', `La suma de empleados en subcargos (${totalSub}) no coincide con el total del cargo (${totalEmp}).\n\nPor favor, ajusta las cantidades.`)
				return // Detiene la ejecución si falla
			}
		}
		// Si subcargoList.length es 0, todas las validaciones de subcargos se saltan,
		// permitiendo guardar el cargo sin subcargos.

		// 3. Lógica de Guardado (si todas las validaciones pasan)
		try {
			let cargoId

			// Crear o actualizar el cargo principal
			if (!selectedCargo?.id) {
				// Si no hay un cargo seleccionado, es un cargo nuevo (POST)
				const nuevo = await saveCargo({
					nombre: position.trim(), // Guarda el nombre sin espacios extra
					personas: totalEmp,
					area_id: selectedArea.id,
					jerarquia_id: String(selectedJerarquia),
				})
				cargoId = nuevo.id
				setCargos((prev) => [...prev, nuevo]) // Agrega el nuevo cargo a la lista local
			} else {
				// Si ya hay un cargo seleccionado, se actualiza (PUT)
				cargoId = selectedCargo.id
				await updateCargo(cargoId, {
					nombre: position.trim(),
					personas: totalEmp,
				})
				setCargos((prev) => prev.map((c) => (c.id === cargoId ? { ...c, nombre: position.trim(), personas: totalEmp } : c))) // Actualiza el cargo en la lista local
			}

			// Guardar/actualizar subcargos (CONDICIONAL)
			// Este bloque SOLO se ejecuta si existen subcargos en la lista.
			if (subcargoList.length > 0) {
				for (const sub of subcargoList) {
					if (sub.id) {
						// Si el subcargo ya tiene un ID, se actualiza (PUT)
						await updateSubcargo(sub.id, {
							nombre: sub.nombre.trim(),
							personas: sub.personas,
						})
					} else if (sub.nombre.trim()) {
						// Solo guarda si es nuevo y tiene nombre
						// Si es un subcargo nuevo (no tiene ID), se crea (POST)
						await saveSubcargo({
							nombre: sub.nombre.trim(),
							personas: sub.personas,
							cargo_id: cargoId, // Asocia al cargo que acabamos de crear/actualizar
						})
					}
				}
			}

			// Recargar sólo los subcargos de este cargo específico para reflejar los cambios (nuevos, actualizados)
			const subAct = await fetchSubcargosByCargo(cargoId)
			// Filtra los subcargos antiguos de este cargo y añade los recién obtenidos
			setSubcargos((prev) => prev.filter((s) => s.cargo_id !== cargoId).concat(subAct))
			setSubcargoList(subAct) // Actualiza también la lista local del modal para que refleje los IDs, etc.
		} catch (err) {
			console.error('❌ Error al guardar cargo/subcargos:', err)
			showAlert('error', 'Error al guardar', '❌ Error al guardar cargo o subcargos.')
			return // Detiene la ejecución si hay un error en el guardado
		}

		// 4. Refrescar métricas (se hace una sola vez al final si todo fue bien)
		try {
			await refetch()
		} catch (e) {
			console.warn('⚠️ Error refrescando métricas después de guardar:', e)
		}

		// Mostrar mensaje de éxito y cerrar el modal
		setModal(false)
	}

	const handleDeleteRole = async () => {
		if (!selectedCargo) return

		const confirmed = await showAlert('delete', 'Eliminar cargo', `¿Estás seguro de eliminar el cargo "${selectedCargo.nombre}"? Esta acción no se puede deshacer.`)

		if (!confirmed) return

		try {
			await deleteCargo(selectedCargo.id)
			setCargos((prev) => prev.filter((c) => c.id !== selectedCargo.id))

			// Mostrar confirmación de éxito
			showAlert('complete', 'Cargo eliminado', '✅ Cargo eliminado correctamente')
		} catch (err) {
			console.error('❌ Error al eliminar cargo:', err)
			showAlert('error', 'Error', '❌ Error al eliminar cargo')
		}

		// Refrescar métricas
		try {
			await refetch()
		} catch (e) {
			console.warn('⚠️ Error refrescando métricas:', e)
		}

		setModal(false)
	}

	const handleAddSubcargo = () => {
		setSubcargoList((prev) => [...prev, { nombre: '', personas: 0 }])
	}

	const handleDeleteSubcargo = async (id) => {
		try {
			await deleteSubcargo(id)
			setSubcargos((prev) => prev.filter((s) => s.id !== id))
			setSubcargoList((prev) => prev.filter((s) => s.id !== id))
		} catch (e) {
			console.error('❌ Error al eliminar subcargo:', e)
			setAlert({
				show: true,
				message: 'Error al eliminar subcargo',
				type: 'error',
			})
		}
	}

	const handleDeleteArea = async () => {
		if (!areaName || areaIndex === null) return

		const confirmed = await showAlert('delete', 'Eliminar área', `¿Estás seguro de eliminar el área "${areaName}"?\n\nEsta acción no se puede deshacer.`)

		if (!confirmed) return

		try {
			const id = areas[areaIndex].id
			await fetch(`http://localhost:3000/areas/${id}`, { method: 'DELETE' })
			setAreas((prev) => prev.filter((_, i) => i !== areaIndex))
			showAlert('complete', 'Área eliminada', '✅ Área eliminada correctamente')
		} catch (e) {
			console.error('❌ Error al eliminar área:', e)
			showAlert('error', 'Error', '❌ Error al eliminar área')
		}
		setAreaModal(false)
	}

	return (
		<>
			<div className='table-container'>
				{alertInfo && <Alert {...alertInfo} position='top-center' onConfirm={alertInfo.onConfirm} onCancel={alertInfo.onCancel} />}
				<table>
					<thead>
						<tr>
							<th />
							{jerarquias.map((j) => (
								<th key={j} className='jerarquia'>
									<div className='tooltip-jerarquia'>
										<p>{j}</p>
										{/* <Tooltip triggerText={<img src={jerarquiaIcons[j]} alt={j} width={40} />} popupText={nivelesJerarquia[j]} /> */}
										<Tooltip
											triggerText={
												<svg width='21' height='21' viewBox='0 0 21 21' fill='none' xmlns='http://www.w3.org/2000/svg'>
													<path
														d='M10.8 15.5C11.0834 15.5 11.3209 15.4042 11.5125 15.2125C11.7042 15.0208 11.8 14.7833 11.8 14.5C11.8 14.2167 11.7042 13.9792 11.5125 13.7875C11.3209 13.5958 11.0834 13.5 10.8 13.5C10.5167 13.5 10.2792 13.5958 10.0875 13.7875C9.89585 13.9792 9.80002 14.2167 9.80002 14.5C9.80002 14.7833 9.89585 15.0208 10.0875 15.2125C10.2792 15.4042 10.5167 15.5 10.8 15.5ZM9.80002 11.5H11.8V5.5H9.80002V11.5ZM10.8 20.5C9.41669 20.5 8.11669 20.2375 6.90002 19.7125C5.68335 19.1875 4.62502 18.475 3.72502 17.575C2.82502 16.675 2.11252 15.6167 1.58752 14.4C1.06252 13.1833 0.800018 11.8833 0.800018 10.5C0.800018 9.11667 1.06252 7.81667 1.58752 6.6C2.11252 5.38333 2.82502 4.325 3.72502 3.425C4.62502 2.525 5.68335 1.8125 6.90002 1.2875C8.11669 0.7625 9.41669 0.5 10.8 0.5C12.1834 0.5 13.4834 0.7625 14.7 1.2875C15.9167 1.8125 16.975 2.525 17.875 3.425C18.775 4.325 19.4875 5.38333 20.0125 6.6C20.5375 7.81667 20.8 9.11667 20.8 10.5C20.8 11.8833 20.5375 13.1833 20.0125 14.4C19.4875 15.6167 18.775 16.675 17.875 17.575C16.975 18.475 15.9167 19.1875 14.7 19.7125C13.4834 20.2375 12.1834 20.5 10.8 20.5ZM10.8 18.5C13.0334 18.5 14.925 17.725 16.475 16.175C18.025 14.625 18.8 12.7333 18.8 10.5C18.8 8.26667 18.025 6.375 16.475 4.825C14.925 3.275 13.0334 2.5 10.8 2.5C8.56669 2.5 6.67502 3.275 5.12502 4.825C3.57502 6.375 2.80002 8.26667 2.80002 10.5C2.80002 12.7333 3.57502 14.625 5.12502 16.175C6.67502 17.725 8.56669 18.5 10.8 18.5Z'
														fill='black'
													/>
												</svg>
											}
											popupText={nivelesJerarquia[j]}
										/>
									</div>
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{areas.map((area, i) => (
							<tr key={area.id}>
								<th className='area-row'>
									<div className='area-name' onClick={() => openAreaModal(i, area.nombre)}>
										{area.nombre}
										{
											<svg width='19' height='19' viewBox='0 0 19 19' fill='none' xmlns='http://www.w3.org/2000/svg'>
												<path
													d='M2.60001 16.5H4.02501L13.8 6.725L12.375 5.3L2.60001 15.075V16.5ZM0.600006 18.5V14.25L13.8 1.075C14 0.891667 14.2208 0.75 14.4625 0.65C14.7042 0.55 14.9583 0.5 15.225 0.5C15.4917 0.5 15.75 0.55 16 0.65C16.25 0.75 16.4667 0.9 16.65 1.1L18.025 2.5C18.225 2.68333 18.3708 2.9 18.4625 3.15C18.5542 3.4 18.6 3.65 18.6 3.9C18.6 4.16667 18.5542 4.42083 18.4625 4.6625C18.3708 4.90417 18.225 5.125 18.025 5.325L4.85001 18.5H0.600006ZM13.075 6.025L12.375 5.3L13.8 6.725L13.075 6.025Z'
													fill='black'
												/>
											</svg>
										}
									</div>
								</th>
								{jerarquias.map((j) => (
									<td key={j} style={{ width: 'auto', whiteSpace: 'nowrap' }}>
										<RoleCell
											areaId={area.id}
											jerarquia={j}
											cargos={cargos.filter((c) => c.area_id === area.id && c.jerarquia_id === j)}
											subcargos={subcargos}
											usuarios={usuarios}
											onClick={(c) => openRoleModal(area, c, j)}
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
				<FeedbackMessage empleadosAsignados={empleadosAsignados} totalEmpleados={totalEmpleados} />
			</div>

			{modal && (
				<EditRoleModal
					title={`Editar cargo (${selectedJerarquia} – ${selectedArea.nombre})`}
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
					setAlert={setAlert}
				/>
			)}

			{areaModal && <EditAreaForm areaName={areaName} onChange={setAreaName} onSave={handleSaveAreaName} onCancel={() => setAreaModal(false)} onDelete={handleDeleteArea} />}
		</>
	)
}

export default Table
