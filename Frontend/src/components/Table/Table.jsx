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
      setCargos(cargosData.filter(c => areasData.some(area => area.id === c.area_id)));
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

  const openRoleModal = (area, cargo, jerarquia) => {
    setSelectedArea(area);
    setSelectedCargo(cargo);
    setSelectedJerarquia(jerarquia); // guardar la jerarquía seleccionada
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

    // Sumar el total de empleados de los subcargos
    const totalSubcargos = subcargoList.reduce((total, sub) => total + (sub.personas || 0), 0);

    // Validar que la suma de empleados de subcargos no supere los empleados del cargo
    if (totalSubcargos > parseInt(employees)) {
      alert('La suma de los empleados en los subcargos no puede superar el número de empleados del cargo.');
      return;
    }

    try {
      let cargoId = selectedCargo?.id;

      if (!cargoId) {
        const nuevoCargo = await saveCargo({
          nombre: position,
          personas: parseInt(employees),
          area_id: selectedArea.id,
          jerarquia_id: typeof selectedJerarquia === "string" ? selectedJerarquia : selectedJerarquia?.toString(),
        });

        cargoId = nuevoCargo.id;
        setCargos(prev => [...prev, nuevoCargo]);
      } else {
        await updateCargo(cargoId, {
          nombre: position,
          personas: parseInt(employees),
        });

        setCargos(prev =>
          prev.map(c =>
            c.id === cargoId ? { ...c, nombre: position, personas: parseInt(employees) } : c
          )
        );
      }

      for (const sub of subcargoList) {
        if (!sub.id && sub.nombre && sub.nombre.trim() !== '') {
          await saveSubcargo({
            nombre: sub.nombre,
            personas: parseInt(sub.personas || 0),
            cargo_id: cargoId,
          });
        }
      }

      const subcargosActualizados = await fetchSubcargosByCargo(cargoId);
      setSubcargos(prev => [
        ...prev.filter(sub => sub.cargo_id !== cargoId),
        ...subcargosActualizados
      ]);
      setSubcargoList(subcargosActualizados);
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
  
    try {
      const areaId = areas[areaIndex].id;
  
      // 1. Eliminar en Supabase
      await fetch(`http://localhost:3000/areas/${areaId}`, {
        method: 'DELETE',
      });
  
      // 2. Eliminar del estado local
      const nuevasAreas = [...areas];
      nuevasAreas.splice(areaIndex, 1);
  
      // 3. Renombrar todas las áreas locales secuencialmente
      const renombradas = nuevasAreas.map((area, index) => {
        const esNombreAutomatico = /^Área \d+$/i.test(area.nombre);
        return {
          ...area,
          nombre: esNombreAutomatico ? `Área ${index + 1}` : area.nombre
        };
      });
  
      setAreas(renombradas);
      setAreaModal(false);
  
      // 4. Actualizar nombres en Supabase
      for (const area of renombradas) {
        await fetch(`http://localhost:3000/areas/${area.id}`, {
          method: 'PUT',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre: area.nombre })
        });
      }
  
    } catch (error) {
      alert("Error al eliminar el área.");
      console.error("❌ Error al eliminar área:", error);
    }
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
                    <Tooltip
                      triggerText={<img src={jerarquiaIcons[j]} alt={`Icono ${j}`} width={40} />}
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
                    style={{ cursor: 'pointer' }}
                  >
                    {area.nombre}
                  </div>
                </th>
                {jerarquias.map(jerarquia => (
                  <td key={jerarquia}>
                    <RoleCell
                      areaId={area.id}
                      jerarquia={jerarquia}
                      cargos={cargos.filter(
                        c => c.area_id === area.id && c.jerarquia_id === jerarquia
                      )}
                      subcargos={subcargos}
                      usuarios={usuarios}
                      onClick={(cargo, jerarquia) => openRoleModal(area, cargo, jerarquia)}
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