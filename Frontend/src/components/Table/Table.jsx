// Table.jsx
import React, { useEffect, useState } from 'react'
import { Tooltip,FeedbackMessage } from '../index'
import ProgressBar from '../ProgressBar/ProgressBar'
import {
  fetchEmpresas,
  fetchAreas,
  fetchCargos,
  fetchSubcargos,
  fetchSubcargosByCargo,
  fetchUsuarios,
  saveCargo,
  updateCargo,
  deleteCargo,
  saveSubcargo,
  deleteSubcargo,
  updateArea
} from './api'
import EditAreaForm from './EditAreaForm'
import EditRoleModal from './EditRoleModal'
import RoleCell from './RoleCell'
import './Table.css'
import { useEmpresaData } from './useEmpresaData'
import { handleAddArea } from './addArea'

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

  // Métricas y recarga
  const {
    empleadosPorJerarquia,
    jerarquiasPlaneadas,
    empleadosAsignados,
    totalEmpleados,
    refetch
  } = useEmpresaData()

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

      const [areasData, cargosData, subcargosData, usuariosData] = await Promise.all([
        fetchAreas(empresaActual.id),
        fetchCargos(),
        fetchSubcargos(),
        fetchUsuarios()
      ])

      setAreas(areasData)
      setCargos(cargosData.filter(c => areasData.some(a => a.id === c.area_id)))
      setSubcargos(subcargosData)
      setUsuarios(usuariosData.filter(u => u.empresa_id === empresaActual.id))
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
    setSubcargoList(subcargos.filter(s => s.cargo_id === cargo?.id))
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
      alert('Por favor completa todos los campos.')
      return
    }

    // **Validación: la suma de subcargos debe ser EXACTAMENTE igual a employees**
    const totalSub = subcargoList.reduce((sum, s) => sum + (s.personas || 0), 0)
    const totalEmp = parseInt(employees, 10)
    if (subcargoList.length > 0 && totalSub !== totalEmp) {
      alert(`La suma de subcargos (${totalSub}) debe ser igual al total de empleados (${totalEmp}).`)
      return
    }

    try {
      let cargoId

      // 1) Crear o actualizar cargo
      if (!selectedCargo?.id) {
        const nuevo = await saveCargo({
          nombre: position,
          personas: totalEmp,
          area_id: selectedArea.id,
          jerarquia_id: String(selectedJerarquia),
        })
        cargoId = nuevo.id
        setCargos(prev => [...prev, nuevo])
      } else {
        cargoId = selectedCargo.id
        await updateCargo(cargoId, { nombre: position, personas: totalEmp })
        setCargos(prev =>
          prev.map(c =>
            c.id === cargoId
              ? { ...c, nombre: position, personas: totalEmp }
              : c
          )
        )
      }

      // 2) Guardar subcargos nuevos
      for (const sub of subcargoList) {
        if (!sub.id && sub.nombre.trim()) {
          await saveSubcargo({
            nombre: sub.nombre,
            personas: sub.personas,
            cargo_id: cargoId,
          })
        }
      }

      // 3) Recargar sólo los subcargos de este cargo
      const subAct = await fetchSubcargosByCargo(cargoId)
      setSubcargos(prev =>
        prev.filter(s => s.cargo_id !== cargoId).concat(subAct)
      )
      setSubcargoList(subAct)

    } catch (err) {
      console.error('❌ Error al guardar cargo/subcargos:', err)
      alert('Error al guardar cargo o subcargos')
      return
    }

    // 4) Refrescar métricas UNA sola vez
    try {
      await refetch()
    } catch (e) {
      console.warn('⚠️ Error refrescando métricas:', e)
    }

    setModal(false)
  }

  const handleDeleteRole = async () => {
    if (!selectedCargo) return
    if (!window.confirm(`¿Eliminar cargo "${selectedCargo.nombre}"?`)) return

    try {
      await deleteCargo(selectedCargo.id)
      setCargos(prev => prev.filter(c => c.id !== selectedCargo.id))
    } catch (err) {
      console.error('❌ Error al eliminar cargo:', err)
      alert('Error al eliminar cargo')
      return
    }

    // refrescar métricas
    try {
      await refetch()
    } catch (e) {
      console.warn('⚠️ Error refrescando métricas:', e)
    }

    setModal(false)
  }

  const handleAddSubcargo = () => {
    setSubcargoList(prev => [...prev, { nombre: '', personas: 0 }])
  }

  const handleDeleteSubcargo = async id => {
    if (!window.confirm('¿Eliminar subcargo?')) return
    try {
      await deleteSubcargo(id)
      setSubcargos(prev => prev.filter(s => s.id !== id))
      setSubcargoList(prev => prev.filter(s => s.id !== id))
    } catch (e) {
      console.error('❌ Error al eliminar subcargo:', e)
      alert('Error al eliminar subcargo')
    }
  }

  const handleDeleteArea = async () => {
    if (!window.confirm(`¿Eliminar área "${areaName}"?`)) return
    try {
      const id = areas[areaIndex].id
      await fetch(`http://localhost:3000/areas/${id}`, { method: 'DELETE' })
      setAreas(prev => prev.filter((_, i) => i !== areaIndex))
    } catch (e) {
      console.error('❌ Error al eliminar área:', e)
      alert('Error al eliminar área')
    }
    setAreaModal(false)
  }

  return (
    <>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th />
              {jerarquias.map(j => (
                <th key={j} className="jerarquia">
                  <div>
                    {j}
                    <Tooltip
                      triggerText={<img src={jerarquiaIcons[j]} alt={j} width={40} />}
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
                <th className="area-row">
                  <div
                    className="area-name"
                    onClick={() => openAreaModal(i, area.nombre)}
                  >
                    {area.nombre}
                  </div>
                </th>
                {jerarquias.map(j => (
                  <td key={j}>
                    <RoleCell
                      areaId={area.id}
                      jerarquia={j}
                      cargos={cargos.filter(c => c.area_id === area.id && c.jerarquia_id === j)}
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
        <FeedbackMessage
					empleadosAsignados={empleadosAsignados}
					totalEmpleados={totalEmpleados}
				/>
        <button onClick={() => handleAddArea(areas, setAreas, empresaId)}>
          + Añadir área
        </button>
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
