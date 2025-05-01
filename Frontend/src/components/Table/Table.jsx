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
  fetchSubcargosByCargo, // Importar nueva función
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

      console.log('Cargos cargados desde Supabase:', cargosData);

      setAreas(areasData);
      console.log('Áreas cargadas:', areasData);
console.log('Cargos cargados después del filtro:', cargosData.filter(c => areasData.some(area => area.id === c.area_id)));
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

  const handleSaveEverything = async () => {
    if (!position || !employees) {
      alert('Completa todos los campos');
      return;
    }

    try {
      let cargoId = selectedCargo?.id;

      if (!cargoId) {
        const nuevoCargo = await saveCargo({
          nombre: position,
          personas: parseInt(employees),
          area_id: selectedArea.id,
        });

        cargoId = nuevoCargo.id;
        setCargos(prev => [...prev, nuevoCargo]);
      } else {
        await updateCargo(cargoId, {
          nombre: position,
          personas: parseInt(employees),
        });

        setCargos(prev =>
          prev.map(c => c.id === cargoId ? { ...c, nombre: position, personas: parseInt(employees) } : c)
        );
      }

      // Guardar subcargos nuevos
      for (const sub of subcargoList) {
        if (!sub.id && sub.nombre && sub.nombre.trim() !== '') {
          await saveSubcargo({
            nombre: sub.nombre,
            personas: parseInt(sub.personas || 0),
            cargo_id: cargoId, // ID correcto del cargo creado
          });
        }
      }      
      console.log('Subcargos a guardar:', subcargoList);


      // 🚀 Recargar SOLO los subcargos de este cargo
      const subcargosActualizados = await fetchSubcargosByCargo(cargoId);
      console.log('Subcargos actualizados desde Supabase:', subcargosActualizados);

      setSubcargos(prev => [
        ...prev.filter(sub => sub.cargo_id !== cargoId),
        ...subcargosActualizados
      ]);
      console.log('Estado global de subcargos actualizado:', subcargos);

      setSubcargoList(subcargosActualizados);
      console.log('Lista local de subcargos actualizada:', subcargoList);

      setModal(false);
    } catch (error) {
      console.error('Error al guardar cargo o subcargos:', error.message);
      alert('Error al guardar cargo o subcargos');
    }
  };

  const handleDeleteRole = async () => {
    if (!selectedCargo) return;

    const confirmDelete = window.confirm(`¿Seguro que quieres eliminar el cargo "${selectedCargo.nombre}"?`);
    if (!confirmDelete) return;

    try {
      await deleteCargo(selectedCargo.id);
      setCargos(prev => prev.filter(c => c.id !== selectedCargo.id));
      setModal(false);
    } catch (error) {
      console.error('Error al eliminar cargo:', error.message);
      alert('Error al eliminar cargo');
    }
  };

  const handleAddSubcargo = async (nombre, personas = 0) => {
    if (!selectedCargo) {
      alert('Primero debes seleccionar un cargo.');
      return;
    }

    try {
      const nuevoSubcargo = await saveSubcargo({
        nombre,
        personas: parseInt(personas),
        cargo_id: selectedCargo.id,
      });

      setSubcargos(prev => [...prev, nuevoSubcargo]);
      setSubcargoList(prev => [...prev, nuevoSubcargo]);
    } catch (error) {
      console.error('Error al guardar subcargo:', error.message);
      alert('Error al guardar subcargo');
    }
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
        <div
          className="area-name"
          onClick={() => openAreaModal(i, area.nombre)}
          style={{ cursor: 'pointer' }}
        >
          {area.nombre}
        </div>
      </th>
      {jerarquias.map(jerarquia => {
        // Agregar console.log para depuración
        console.log('Cargos en Table:', cargos);
        console.log('Área:', area, 'Jerarquía:', jerarquia);

        return (
          <td key={jerarquia}>
            <RoleCell
              areaId={area.id}
              jerarquia={jerarquia}
              cargos={cargos.filter(c => c.area_id === area.id)}
              subcargos={subcargos}
              usuarios={usuarios}
              onClick={(cargo) => openRoleModal(area, cargo)}
            />
          </td>
        );
      })}
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
