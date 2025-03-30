import React, { useEffect, useState } from 'react';
import './Table.css';

export function Table() {
  const [modal, setModal] = useState(false);
  const [areaModal, setAreaModal] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [selectedHierarchy, setSelectedHierarchy] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [position, setPosition] = useState('');
  const [employees, setEmployees] = useState('');
  const [areaName, setAreaName] = useState('');
  const [areaIndex, setAreaIndex] = useState(null);
  const [empresaId, setEmpresaId] = useState(null);
  const [subcargos, setSubcargos] = useState([]);

  const svg = (
    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22.0646C17.5 22.0646 22 17.5646 22 12.0646C22 6.56458 17.5 2.06458 12 2.06458C6.5 2.06458 2 6.56458 2 12.0646C2 17.5646 6.5 22.0646 12 22.0646Z" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 8.06458V13.0646" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M11.9945 16.0646H12.0035" stroke="#292D32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const pyramid_svg = (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-triangle-icon lucide-triangle"><path d="M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/></svg>
  )

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/empresas');
        const data = await response.json();

        if (data.length > 0) {
          const latest = data[data.length - 1];
          setEmpresaId(latest.id);
          const areaNames = latest.area_nombres || [];
          const generatedAreas = Array.from({ length: latest.areas }, (_, i) => ({
            name: areaNames[i] || `Área ${i + 1}`,
            roles: ['J1', 'J2', 'J3', 'J4'].map(hierarchy => ({
              hierarchy,
              position: null,
              employees: null
            }))
          }));
          setTableData(generatedAreas);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, []);

  function toggleModal(areaName = null, hierarchy = null, existingPosition = '', existingEmployees = '') {
    const area = tableData.find(a => a.name === areaName);
    const role = area?.roles.find(r => r.hierarchy === hierarchy);
  
    setSelectedArea(areaName);
    setSelectedHierarchy(hierarchy);
    setPosition(existingPosition);
    setEmployees(existingEmployees);
    setSubcargos(role?.subcargos || []);
    setModal(true);
  }

  const openAreaModal = (index, name) => {
    setAreaIndex(index);
    setAreaName(name);
    setAreaModal(true);
  };

  const handleSaveAreaName = async () => {
    const updatedData = [...tableData];
    updatedData[areaIndex].name = areaName;
    setTableData(updatedData);
    setAreaModal(false);

    const nombres = updatedData.map(area => area.name);
    if (empresaId) {
      try {
        await fetch(`http://localhost:3000/empresas/${empresaId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ area_nombres: nombres })
        });
      } catch (err) {
        console.error('Error al actualizar nombres de áreas:', err);
      }
    }
  };

  async function handleSave(e) {
    e.preventDefault();

    if (!position || !employees) {
      alert('Todos los campos son obligatorios');
      return;
    }

    const employeeNumber = Number(employees);
    if (isNaN(employeeNumber) || employeeNumber <= 0) {
      alert("Ingresa un número válido de empleados");
      return;
    }

    const newRole = {
      area: selectedArea,
      jerarquia: selectedHierarchy,
      position,
      employees: employeeNumber,
      subcargos
    };

    try {
      const response = await fetch('http://localhost:3000/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newRole)
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || 'Error al guardar en el backend');
      }

      setTableData(prevData =>
        prevData.map(area => {
          if (area.name === selectedArea) {
            return {
              ...area,
              roles: area.roles.map(role =>
                role.hierarchy === selectedHierarchy ? { ...role, position, employees: employeeNumber } : role
              )
            };
          }
          return area;
        })
      );

      setPosition('');
      setEmployees('');
      setSubcargos([]);
      setSelectedArea(null);
      setSelectedHierarchy(null);
      setModal(false);
    } catch (error) {
      console.error('Error al guardar en el backend:', error);
      alert('Hubo un error al guardar los datos. Intenta nuevamente.');
    }
  }

  function handleDelete() {
    setTableData(prevData =>
      prevData.map(area => {
        if (area.name === selectedArea) {
          return {
            ...area,
            roles: area.roles.map(role =>
              role.hierarchy === selectedHierarchy
                ? { ...role, position: null, employees: null }
                : role
            )
          };
        }
        return area;
      })
    );

    setPosition('');
    setEmployees('');
    setSelectedArea(null);
    setSelectedHierarchy(null);
    setSubcargos([]);
    setModal(false);
  }

  const handleAddSubcargo = () => {
    setSubcargos([...subcargos, ""]);
  };

  const handleSubcargoChange = (index, value) => {
    const updated = [...subcargos];
    updated[index] = value;
    setSubcargos(updated);
  };

  return (
    <>
      <div className="table-container">
        <table>
        <thead>
          <tr>
            <th id="blank"></th>
            {['J1', 'J2', 'J3', 'J4'].map(j => {
              // Calcular empleados actuales por jerarquía
              const empleadosActuales = tableData.reduce((acc, area) => {
                const role = area.roles.find(r => r.hierarchy === j);
                return acc + (role?.employees || 0);
              }, 0);

              // Mostrar número fijo temporal de requeridos mientras el backend lo conecta
              const jerarquiaTotal = 0; // Esto se actualizará con backend más adelante

              return (
                <th key={j} className="jerarquia">
                  <div>{j}{pyramid_svg}</div>
                  <div style={{ fontSize: '12px', color: 'gray' }}>({empleadosActuales} / {jerarquiaTotal})</div>
                </th>
              );
            })}
          </tr>
        </thead>
          <tbody>
            {tableData.map((area, i) => (
              <tr key={i}>
                <th className="area-row">
                  <div className="area-name" onClick={() => openAreaModal(i, area.name)} style={{ cursor: 'pointer' }}>{area.name}{svg}</div>
                </th>
                {area.roles.map((role, ri) => (
                  <td key={ri}>
                    {role.position ? (
                      <span onClick={() => toggleModal(area.name, role.hierarchy, role.position, role.employees)}>
                        <p className="role-name">{role.position}</p> | <p>{role.employees}</p>
                      </span>
                    ) : (
                      <button onClick={() => toggleModal(area.name, role.hierarchy)}>
                        +
                      </button>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="modal-container">
          <div className="overlay">
            <div className="modal-content">
              <form onSubmit={handleSave}>
                <h3>Agregar Cargo en {selectedArea} - {selectedHierarchy}</h3>
                <label htmlFor="position">Cargo</label>
                <input value={position} onChange={e => setPosition(e.target.value)} placeholder="Nombre del cargo" id="position" />
                <label htmlFor="employees">Empleados</label>
                <input value={employees} onChange={e => setEmployees(e.target.value)} placeholder="Cantidad de empleados" type="number" id="employees" />
                <div className="subcargos-section">
                  <label>Subcargos:</label>
                  {subcargos.map((sub, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        value={sub.name || ''}
                        onChange={e => {
                          const updated = [...subcargos];
                          updated[index].name = e.target.value;
                          setSubcargos(updated);
                        }}
                        placeholder={`Subcargo ${index + 1}`}
                        style={{ flexGrow: 1 }}
                      />
                      <input
                        type="number"
                        value={sub.employees || ''}
                        onChange={e => {
                          const updated = [...subcargos];
                          updated[index].employees = parseInt(e.target.value);
                          setSubcargos(updated);
                        }}
                        placeholder="Empleados"
                        style={{ width: '80px' }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = subcargos.filter((_, i) => i !== index);
                          setSubcargos(updated);
                        }}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'gray', fontWeight: 'bold' }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setSubcargos([...subcargos, { name: '', employees: '' }])}
                    className="add-subcargo-button"
                  >
                    Añadir Subcargo
                  </button>
                </div>
                <div className="modal-buttons">
                  <button type="submit" className='submit-button'>Guardar</button>
                  <button type="button" onClick={handleDelete} className="delete-button">Eliminar</button>
                  <button type="button" onClick={() => setModal(false)} className='cancel-button'>Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {areaModal && (
        <div className="modal-container">
          <div className="overlay">
            <div className="modal-content">
              <h3>Editar nombre del área</h3>
              <input value={areaName} onChange={(e) => setAreaName(e.target.value)} placeholder="Nuevo nombre del área" />
              <div className="modal-buttons">
                <button onClick={handleSaveAreaName} className="submit-button">Guardar</button>
                <button onClick={() => setAreaModal(false)} className="cancel-button">Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Table;
