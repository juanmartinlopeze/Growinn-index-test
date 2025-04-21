import React, { useState } from 'react'
import EditAreaForm from './EditAreaForm'
import EditRoleModal from './EditRoleModal'
import RoleCell from './RoleCell'
import './Table.css'
import { deleteRole, fetchAllRoles, saveRole, updateEmpresaAreas, deleteArea, } from './api'
import { useEmpresaData } from './useEmpresaData'
import { Tooltip } from '../index'
import ProgressBar from './ProgressBar'

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

  const {
    empresaId,
    tableData,
    setTableData,
    totalEmpleados,
    empleadosAsignados,
    setEmpleadosAsignados,
    empleadosPorJerarquia,
    jerarquiasPlaneadas,
  } = useEmpresaData()

  const jerarquiaIcons = {
    J1: "/src/assets/icons/IconJ1.png",
    J2: "/src/assets/icons/IconJ2.png",
    J3: "/src/assets/icons/IconJ3.png",
    J4: "/src/assets/icons/IconJ4.png",
  }

  const nivelesJerarquia = {
    J1: "La Jerarquia 1 (Ejecución): realiza tareas operativas esenciales.",
    J2: "La Jerarquia 2 (Supervisión): asegura que las tareas se cumplan según procedimientos y estándares.",
    J3: "La Jerarquia 3 (Gerencial): implementa estrategias y toma decisiones a mediano plazo.",
    J4: "La Jerarquia 4 (Directivo): define la estrategia general, establece objetivos y asigna recursos.",
  }

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
        const allRoles = await fetchAllRoles(empresaId)
        const rolDB = allRoles.find((r) => r.area === selectedArea && r.jerarquia === selectedHierarchy && r.position === role.position)

        if (!rolDB) {
          alert('⚠️ No se pudo encontrar el rol en la base de datos.')
          return
        }

        await deleteRole(rolDB.id)

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

  const handleDeleteArea = async () => {
    const confirm = window.confirm(`¿Eliminar el área "${areaName}" y todos sus cargos?`)
    if (!confirm) return

    try {
      await deleteArea(empresaId, areaName)
      const updatedData = tableData.filter((_, i) => i !== areaIndex)
      setTableData(updatedData)
      setAreaModal(false)
      alert('✅ Área eliminada correctamente')
    } catch (error) {
      console.error('❌ Error al eliminar el área:', error)
      alert('❌ Error al eliminar el área.')
    }
  }

  return (
    <>
      <div style={{ margin: '16px', fontWeight: 'bold', fontSize: '16px', color: empleadosAsignados >= totalEmpleados ? 'green' : 'red' }}>
        Empleados asignados: {empleadosAsignados} / {totalEmpleados}
      </div>

      <div className='table-container'>
        <table>
          <thead>
            <tr>
              <th id='blank'></th>
              {['J1', 'J2', 'J3', 'J4'].map((j) => (
                <th key={j} className='jerarquia'>
                  <div>
                    {j}
                    <Tooltip triggerText={<img src={jerarquiaIcons[j]} alt={`Icono ${j}`} width={40} />} popupText={nivelesJerarquia[j]} />
                  </div>
                  <div style={{ fontSize: '12px', color: 'gray' }}>({empleadosPorJerarquia[j]} / {jerarquiasPlaneadas[j]})</div>
                </th>
              ))}
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
          <tfoot>
            <tr>
              <td className="area-column">Resumen</td>
              {['J1', 'J2', 'J3', 'J4'].map(j => (
                <td key={j}>
                  <ProgressBar empleadosAsignados={empleadosPorJerarquia[j]} empleadosPlaneados={jerarquiasPlaneadas[j]} />
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>

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

      {areaModal && (
        <EditAreaForm
          areaName={areaName}
          onChange={setAreaName}
          onSave={handleSaveAreaName}
          onCancel={() => setAreaModal(false)}
          onDelete={handleDeleteArea}
        />
      )}
    </>
  )
}

export default Table
