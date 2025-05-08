// Table.js
import React, { useState, useEffect } from 'react';
import './Table.css';
import { Tooltip } from '../index';
import ProgressBar from './ProgressBar';
import EditAreaForm from './EditAreaForm';
import EditRoleModal from './EditRoleModal';
import RoleCell from './RoleCell';
import { useEmpresaData } from './useEmpresaData';
import {
  fetchEmpresas,
  fetchAreas,
  fetchCargos,
  fetchSubcargos,
  fetchSubcargosByCargo,
  fetchUsuarios,
  updateArea,
  deleteSubcargo,
  saveSubcargo,
  saveCargo,
  updateCargo,
  deleteCargo
} from './api';
import { handleAddArea } from './addArea';

export function Table() {
  const [empresaId, setEmpresaId] = useState(null);
  const [areas, setAreas] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [subcargos, setSubcargos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  const [modal, setModal] = useState(false);
  const [areaModal, setAreaModal] = useState(false);

  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedCargo, setSelectedCargo] = useState(null);
  const [selectedJerarquia, setSelectedJerarquia] = useState(null);

  const [position, setPosition] = useState('');
  const [employees, setEmployees] = useState('');
  const [subcargoList, setSubcargoList] = useState([]);

  const [areaName, setAreaName] = useState('');
  const [areaIndex, setAreaIndex] = useState(null);

  const {
    empleadosPorJerarquia,
    jerarquiasPlaneadas,
    empleadosAsignados,
    totalEmpleados,
    refetch
  } = useEmpresaData();

  const jerarquias = ['J1', 'J2', 'J3', 'J4'];

  const jerarquiaIcons = {
    J1: '/src/assets/icons/IconJ1.png',
    J2: '/src/assets/icons/IconJ2.png',
    J3: '/src/assets/icons/IconJ3.png',
    J4: '/src/assets/icons/IconJ4.png',
  };

  const nivelesJerarquia = {
    J1: 'La Jerarquía 1 (Ejecución)',
    J2: 'La Jerarquía 2 (Supervisión)',
    J3: 'La Jerarquía 3 (Gerencial)',
    J4: 'La Jerarquía 4 (Directivo)',
  };

  // Función única para cargar todos los datos de tabla
  const loadAll = async () => {
    const empresas = await fetchEmpresas();
    const empresaActual = empresas[empresas.length - 1];
    setEmpresaId(empresaActual.id);

    const [areasData, cargosData, subcargosData, usuariosData] = await Promise.all([
      fetchAreas(empresaActual.id),
      fetchCargos(),
      fetchSubcargos(),
      fetchUsuarios()
    ]);

    setAreas(areasData);
    setCargos(cargosData.filter(c => areasData.some(a => a.id === c.area_id)));
    setSubcargos(subcargosData);
    setUsuarios(usuariosData.filter(u => u.empresa_id === empresaActual.id));
  };

  // Carga inicial
  useEffect(() => {
    loadAll();
  }, []);

  const openAreaModal = (index, name) => {
    setAreaIndex(index);
    setAreaName(name);
    setAreaModal(true);
  };

  const openRoleModal = (area, cargo, jerarquia) => {
    setSelectedArea(area);
    setSelectedCargo(cargo);
    setSelectedJerarquia(jerarquia);
    setPosition(cargo?.nombre || '');
    setEmployees(cargo?.personas || '');
    setSubcargoList(subcargos.filter(s => s.cargo_id === cargo?.id));
    setModal(true);
  };

  const handleSaveAreaName = async () => {
    await updateArea(areas[areaIndex].id, areaName);
    const updated = [...areas];
    updated[areaIndex].nombre = areaName;
    setAreas(updated);
    setAreaModal(false);
  };

  const handleSaveEverything = async () => {
    if (!position || !employees) {
      alert('Completa todos los campos');
      return;
    }
    const totalSub = subcargoList.reduce((t, s) => t + (s.personas || 0), 0);
    if (totalSub > parseInt(employees, 10)) {
      alert('La suma de subcargos supera el total.');
      return;
    }

    let cargoId;
    try {
      if (!selectedCargo?.id) {
        const nuevo = await saveCargo({
          nombre: position,
          personas: parseInt(employees, 10),
          area_id: selectedArea.id,
          jerarquia_id: String(selectedJerarquia),
        });
        cargoId = nuevo.id;
        setCargos(prev => [...prev, nuevo]);
      } else {
        cargoId = selectedCargo.id;
        await updateCargo(cargoId, { nombre: position, personas: parseInt(employees, 10) });
        setCargos(prev => prev.map(c => c.id === cargoId ? { ...c, nombre: position, personas: parseInt(employees, 10) } : c));
      }

      for (const sub of subcargoList) {
        if (!sub.id && sub.nombre.trim()) {
          await saveSubcargo({ nombre: sub.nombre, personas: parseInt(sub.personas || 0, 10), cargo_id: cargoId });
        }
      }

      const subAct = await fetchSubcargosByCargo(cargoId);
      setSubcargos(prev => [...prev.filter(s => s.cargo_id !== cargoId), ...subAct]);
      setSubcargoList(subAct);
    } catch (err) {
      console.error('Error al guardar:', err);
      alert('Error al guardar cargo o subcargos');
      return;
    }

    try { await refetch(); } catch (e) { console.warn('Error refetch:', e); }
    await loadAll();
    setModal(false);
  };

  const handleDeleteRole = async () => {
    if (!selectedCargo) return;
    if (!window.confirm(`¿Eliminar cargo "${selectedCargo.nombre}"?`)) return;

    try {
      await deleteCargo(selectedCargo.id);
      setCargos(prev => prev.filter(c => c.id !== selectedCargo.id));
    } catch (err) {
      console.error('Error al eliminar cargo:', err);
      alert('Error al eliminar cargo');
      return;
    }

    try {
           await refetch();
         } catch (e) {
           console.warn('Error refrescando métricas:', e);
         }
    await loadAll();
    setModal(false);
  };

  const handleAddSubcargo = () => {
    setSubcargoList(prev => [...prev, { nombre: '', personas: 0 }]);
  };

  const handleDeleteSubcargo = async id => {
    if (!window.confirm('¿Eliminar subcargo?')) return;
    try {
      await deleteSubcargo(id);
      setSubcargos(prev => prev.filter(s => s.id !== id));
      setSubcargoList(prev => prev.filter(s => s.id !== id));
    } catch (e) {
      console.error('Error al eliminar subcargo:', e);
      alert('Error al eliminar subcargo');
    }
  };

  const handleDeleteArea = async () => {
    if (!window.confirm(`¿Eliminar área "${areaName}"?`)) return;
    try {
      const id = areas[areaIndex].id;
      await fetch(`http://localhost:3000/areas/${id}`, { method: 'DELETE' });
      setAreas(prev => prev.filter((_, i) => i !== areaIndex));
    } catch (e) {
      console.error('Error al eliminar área:', e);
      alert('Error al eliminar área');
    }
    setAreaModal(false);
  };

  return (
    <>
      <div style={{ margin: '16px 0' }}>
        <h4>Progreso total de la empresa</h4>
        <ProgressBar empleadosAsignados={empleadosAsignados} empleadosPlaneados={totalEmpleados} />
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th />
              {jerarquias.map(j => (
                <th key={j} className="jerarquia">
                  <div>
                    {j}
                    <Tooltip triggerText={<img src={jerarquiaIcons[j]} alt={j} width={40} />} popupText={nivelesJerarquia[j]} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {areas.map((area, i) => (
              <tr key={area.id}>
                <th className="area-row">
                  <div onClick={() => openAreaModal(i, area.nombre)} style={{ cursor: 'pointer' }}>
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
                      onClick={(c, jer) => openRoleModal(area, c, jer)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="area-column">Resumen</td>
              {jerarquias.map(j => (
                <td key={j}>
                  <ProgressBar empleadosAsignados={empleadosPorJerarquia[j]} empleadosPlaneados={jerarquiasPlaneadas[j]} />
                </td>
              ))}
            </tr>
            <tr>
              <td className="area-column">Progreso total empresa</td>
              <td colSpan={4}>
                <ProgressBar empleadosAsignados={empleadosAsignados} empleadosPlaneados={totalEmpleados} />
              </td>
            </tr>
          </tfoot>
        </table>
        <button onClick={() => handleAddArea(areas, setAreas, empresaId)}>+ Añadir área</button>
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
  );
}

export default Table;
