import React, { useState, useEffect } from 'react';
import './Table.css';
import { Tooltip } from '../index';
import ProgressBar from './ProgressBar';
import EditAreaForm from './EditAreaForm';
import EditRoleModal from './EditRoleModal';
import RoleCell from './RoleCell';

import {
  fetchEmpresas,
  fetchAreas,
  fetchCargos,
  fetchSubcargos,
  fetchUsuarios,
  updateArea,
  deleteSubcargo,
  saveSubcargo,
  saveCargo,
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
  const [position, setPosition] = useState('');
  const [employees, setEmployees] = useState('');
  const [subcargoList, setSubcargoList] = useState([]);

  const [areaName, setAreaName] = useState('');
  const [areaIndex, setAreaIndex] = useState(null);

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

  useEffect(() => {
    async function loadData() {
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
      setCargos(cargosData.filter(c => c.empresa_id === empresaActual.id));
      setSubcargos(subcargosData);
      setUsuarios(usuariosData.filter(u => u.empresa_id === empresaActual.id));
    }
    loadData();
  }, []);

  const openAreaModal = (index, name) => {
    setAreaIndex(index);
    setAreaName(name);
    setAreaModal(true);
  };

  const handleSaveAreaName = async () => {
    await updateArea(areas[areaIndex].id, areaName);
    const updated = [...areas];
    updated[areaIndex].nombre = areaName;
    setAreas(updated);
    setAreaModal(false);
  };

  const openRoleModal = (area, cargo) => {
    setSelectedArea(area);
    setSelectedCargo(cargo);
    setPosition(cargo?.nombre || '');
    setEmployees(cargo?.personas || '');
    setSubcargoList(subcargos.filter(s => s.cargo_id === cargo?.id));
    setModal(true);
  };

  const handleSaveRole = async () => {
    if (!position || !employees) {
      alert('Completa todos los campos');
      return;
    }

    if (selectedCargo) {
      // Aquí podrías actualizar un cargo existente (si haces update en tu API)
    } else {
      const nuevoCargo = await saveCargo({
        nombre: position,
        personas: parseInt(employees),
        area_id: selectedArea.id,
        empresa_id: empresaId
      });
      setCargos(prev => [...prev, nuevoCargo]);
    }

    setModal(false);
  };

  const handleDeleteSubcargo = async (subcargoId) => {
    if (window.confirm('¿Eliminar subcargo?')) {
      await deleteSubcargo(subcargoId);
      setSubcargos(prev => prev.filter(s => s.id !== subcargoId));
      setSubcargoList(prev => prev.filter(s => s.id !== subcargoId));
    }
  };

  const handleDeleteArea = async () => {
    const confirm = window.confirm(`¿Eliminar área "${areaName}" y todo su contenido?`);
    if (!confirm) return;
    // Aquí debes conectar la ruta de eliminación de área en el backend
    alert('🚧 Función eliminar área pendiente de conectar.');
  };

  return (
    <>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th></th>
              {jerarquias.map(j => (
                <th key={j} className="jerarquia">
                  <div>
                    {j}
                    <Tooltip triggerText={<img src={jerarquiaIcons[j]} alt={`Icono ${j}`} width={40} />} popupText={nivelesJerarquia[j]} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {areas.map((area, i) => (
              <tr key={area.id}>
                <th className="area-row">
                  <div className="area-name" onClick={() => openAreaModal(i, area.nombre)} style={{ cursor: 'pointer' }}>
                    {area.nombre}
                  </div>
                </th>
                {jerarquias.map(jerarquia => (
                  <td key={jerarquia}>
                    <RoleCell
                      areaId={area.id}
                      jerarquia={jerarquia}
                      cargos={cargos.filter(c => c.area_id === area.id && c.jerarquia === jerarquia)}
                      subcargos={subcargos}
                      usuarios={usuarios}
                      onClick={(cargo) => openRoleModal(area, cargo)}
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
                  <ProgressBar empleadosAsignados={0} empleadosPlaneados={0} />
                </td>
              ))}
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
          onSave={handleSaveRole}
          onClose={() => setModal(false)}
          onDeleteSubcargo={handleDeleteSubcargo}
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
