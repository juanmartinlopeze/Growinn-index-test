import React, { useState } from 'react'
import EditAreaForm from './EditAreaForm'
import EditRoleModal from './EditRoleModal'
import RoleCell from './RoleCell'
import './Table.css'
import { deleteRole, fetchAllRoles, saveRole, updateEmpresaAreas } from './api'
import { useEmpresaData } from './useEmpresaData'

export function Table() {
	const [modal, setModal] = useState(false)
	const [areaModal, setAreaModal] = useState(false)
	const [selectedHierarchy, setSelectedHierarchy] = useState(null)
	const [selectedArea, setSelectedArea] = useState(null)
	const [position, setPosition] = useState('')
	const [employees, setEmployees] = useState('')
	const [areaName, setAreaName] = useState('')
	const [areaIndex, setAreaIndex] = useState(null)
	const [subcargos, setSubcargos] = useState([])

	const { empresaId, tableData, setTableData, totalEmpleados, empleadosAsignados, setEmpleadosAsignados } = useEmpresaData()

	const pyramid_svg = (
		<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#000000' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
			<path d='M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z' />
		</svg>
	)

	const edit_svg = (
		<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#000000' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
			<path d='M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z' />
			<path d='m15 5 4 4' />
		</svg>
	)

	function toggleModal(areaName = null, hierarchy = null) {
		const area = tableData.find((a) => a.name === areaName)
		const role = area?.roles.find((r) => r.hierarchy === hierarchy)

		setSelectedArea(areaName)
		setSelectedHierarchy(hierarchy)
		setPosition(role?.position || '')
		setEmployees(role?.employees || '')
		setSubcargos(role?.subcargos || [])
		setModal(true)
	}

	const openAreaModal = (index, name) => {
		setAreaIndex(index)
		setAreaName(name)
		setAreaModal(true)
	}

	const handleSaveAreaName = async () => {
		const updatedData = [...tableData]
		updatedData[areaIndex].name = areaName
		setTableData(updatedData)
		setAreaModal(false)

		const nombres = updatedData.map((area) => area.name)
		if (empresaId) {
			try {
				await updateEmpresaAreas(empresaId, nombres)
			} catch (err) {
				console.error('Error al actualizar nombres de áreas:', err)
			}
		}
	}

	async function handleSave(e) {
		e.preventDefault()

		if (!position || !employees) {
			alert('Todos los campos son obligatorios')
			return
		}

		const employeeNumber = Number(employees)
		if (isNaN(employeeNumber) || employeeNumber <= 0) {
			alert('Número inválido de empleados')
			return
		}

		const newRole = {
			area: selectedArea,
			jerarquia: selectedHierarchy,
			position,
			employees: employeeNumber,
			subcargos,
			empresaId,
		}

		try {
			await saveRole(newRole)

			setTableData((prevData) =>
				prevData.map((area) => {
					if (area.name === selectedArea) {
						return {
							...area,
							roles: area.roles.map((role) => (role.hierarchy === selectedHierarchy ? { ...role, position, employees: employeeNumber, subcargos } : role)),
						}
					}
					return area
				})
			)

			setModal(false)
			setPosition('')
			setEmployees('')
			setSelectedArea(null)
			setSelectedHierarchy(null)
			setSubcargos([])

			setEmpleadosAsignados((prev) => prev + employeeNumber)
		} catch (error) {
			console.error('❌ Error al guardar:', error)
			alert('Error al guardar los datos')
		}
	}

	const handleDelete = async () => {
		try {
			const area = tableData.find((a) => a.name === selectedArea)
			const role = area?.roles.find((r) => r.hierarchy === selectedHierarchy)

			if (role && role.position) {
				// 🔍 Buscar el ID real del rol
				const allRoles = await fetchAllRoles(empresaId)
				const rolDB = allRoles.find((r) => r.area === selectedArea && r.jerarquia === selectedHierarchy && r.position === role.position)

				if (!rolDB) {
					alert('⚠️ No se pudo encontrar el rol en la base de datos.')
					return
				}

				// 🧹 Eliminar desde el backend
				await deleteRole(rolDB.id)

				// ✅ Actualizar estado en frontend
				setTableData((prevData) =>
					prevData.map((area) => {
						if (area.name === selectedArea) {
							return {
								...area,
								roles: area.roles.map((role) => (role.hierarchy === selectedHierarchy ? { ...role, position: null, employees: null, subcargos: [] } : role)),
							}
						}
						return area
					})
				)

				if (role.employees) {
					setEmpleadosAsignados((prev) => prev - role.employees)
				}

				setModal(false)
				setPosition('')
				setEmployees('')
				setSelectedArea(null)
				setSelectedHierarchy(null)
				setSubcargos([])

				alert('✅ Rol eliminado correctamente')
			}
		} catch (error) {
			console.error('❌ Error al eliminar el rol:', error)
			alert('❌ Error al eliminar el rol.')
		}
	}

	const handleDeleteArea = () => {
		const confirm = window.confirm(`¿Eliminar el área "${areaName}" y todos sus cargos?`)
		if (!confirm) return

		const updatedData = tableData.filter((_, i) => i !== areaIndex)
		setTableData(updatedData)
		setAreaModal(false)
	}

	return (
		<>
			<div
				style={{
					margin: '16px',
					fontWeight: 'bold',
					fontSize: '16px',
					color: empleadosAsignados >= totalEmpleados ? 'green' : 'red',
				}}
			>
				Empleados asignados: {empleadosAsignados} / {totalEmpleados}
			</div>

			<div className='table-container'>
				<table>
					<thead>
						<tr>
							<th id='blank'></th>
							{['J1', 'J2', 'J3', 'J4'].map((j) => {
								const empleadosActuales = tableData.reduce((acc, area) => {
									const role = area.roles.find((r) => r.hierarchy === j)
									return acc + (role?.employees || 0)
								}, 0)
								return (
									<th key={j} className='jerarquia'>
										<div>
											{j}
											{pyramid_svg}
										</div>
										<div style={{ fontSize: '12px', color: 'gray' }}>({empleadosActuales})</div>
									</th>
								)
							})}
						</tr>
					</thead>
					<tbody>
						{tableData.map((area, i) => (
							<tr key={i}>
								<th className='area-row'>
									<div className='area-name' onClick={() => openAreaModal(i, area.name)} style={{ cursor: 'pointer' }}>
										{area.name}
										{edit_svg}
									</div>
								</th>
								{area.roles.map((role, ri) => (
									<td key={ri}>
										<RoleCell role={role} areaName={area.name} onClick={toggleModal} />
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Modal de cargo */}
			{modal && (
				<EditRoleModal
					selectedArea={selectedArea}
					selectedHierarchy={selectedHierarchy}
					position={position}
					employees={employees}
					subcargos={subcargos}
					onPositionChange={setPosition}
					onEmployeesChange={setEmployees}
					onSubcargosChange={setSubcargos}
					onClose={() => setModal(false)}
					onSave={handleSave}
					onDelete={handleDelete}
					empresaId={empresaId}
				/>
			)}

			{/* Modal de nombre del área */}
			{areaModal && <EditAreaForm areaName={areaName} onChange={setAreaName} onSave={handleSaveAreaName} onCancel={() => setAreaModal(false)} onDelete={handleDeleteArea} />}
		</>
	)
}

export default Table
