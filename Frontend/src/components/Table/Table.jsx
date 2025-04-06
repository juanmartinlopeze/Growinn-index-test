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
  const [totalEmpleados, setTotalEmpleados] = useState(0);
  const [empleadosAsignados, setEmpleadosAsignados] = useState(0);

  const pyramid_svg = (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/></svg>
  );

  const edit_svg = (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const empresasRes = await fetch('http://localhost:3000/empresas');
        const empresas = await empresasRes.json();

        if (empresas.length > 0) {
          const latest = empresas[empresas.length - 1];
          const empresaId = latest.id;
          setEmpresaId(empresaId);
          setTotalEmpleados(latest.empleados);

          const areaNames = latest.areas_nombres || [];
          const rolesRes = await fetch(`http://localhost:3000/roles/empresa/${empresaId}`);
          if (!rolesRes.ok) throw new Error("Error cargando roles");
          const roles = await rolesRes.json();

          const empleadosContados = roles.reduce((total, rol) => total + (rol.employees || 0), 0);
          setEmpleadosAsignados(empleadosContados);

          const generatedAreas = Array.from({ length: latest.areas }, (_, i) => {
            const name = areaNames[i] || `Área ${i + 1}`;
            const rolesForArea = roles.filter(r => r.area === name);

            const rolesData = ['J1', 'J2', 'J3', 'J4'].map(j => {
              const role = rolesForArea.find(r => r.jerarquia === j);
              return role
                ? {
                    hierarchy: j,
                    position: role.position,
                    employees: role.employees,
                    subcargos: role.subcargos || []
                  }
                : {
                    hierarchy: j,
                    position: null,
                    employees: null,
                    subcargos: []
                  };
            });

            return {
              name,
              roles: rolesData
            };
          });

          setTableData(generatedAreas);
        }
      } catch (err) {
        console.error('❌ Error al cargar datos:', err.message);
      }
    };

    fetchData();
  }, []);

  function toggleModal(areaName = null, hierarchy = null) {
    const area = tableData.find(a => a.name === areaName);
    const role = area?.roles.find(r => r.hierarchy === hierarchy);

    setSelectedArea(areaName);
    setSelectedHierarchy(hierarchy);
    setPosition(role?.position || '');
    setEmployees(role?.employees || '');
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
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ areas_nombres: nombres })
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
      alert("Número inválido de empleados");
      return;
    }

    const newRole = {
      area: selectedArea,
      jerarquia: selectedHierarchy,
      position,
      employees: employeeNumber,
      subcargos,
      empresaId
    };

    try {
      const response = await fetch('http://localhost:3000/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRole)
      });

      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.message);

      setTableData(prevData =>
        prevData.map(area => {
          if (area.name === selectedArea) {
            return {
              ...area,
              roles: area.roles.map(role =>
                role.hierarchy === selectedHierarchy
                  ? { ...role, position, employees: employeeNumber, subcargos }
                  : role
              )
            };
          }
          return area;
        })
      );

      setModal(false);
      setPosition('');
      setEmployees('');
      setSelectedArea(null);
      setSelectedHierarchy(null);
      setSubcargos([]);

      setEmpleadosAsignados(prev => prev + employeeNumber);
    } catch (error) {
      console.error('❌ Error al guardar:', error);
      alert('Error al guardar los datos');
    }
  }

  const handleDelete = async () => {
    try {
      const area = tableData.find(a => a.name === selectedArea);
      const role = area?.roles.find(r => r.hierarchy === selectedHierarchy);
  
      if (role && role.position) {
        // 🔍 Buscar el ID real del rol
        const res = await fetch(`http://localhost:3000/roles/empresa/${empresaId}`);
        const allRoles = await res.json();
        const rolDB = allRoles.find(r =>
          r.area === selectedArea &&
          r.jerarquia === selectedHierarchy &&
          r.position === role.position
        );
  
        if (!rolDB) {
          alert("⚠️ No se pudo encontrar el rol en la base de datos.");
          return;
        }
  
        // 🧹 Eliminar desde el backend
        const deleteRes = await fetch(`http://localhost:3000/roles/${rolDB.id}`, {
          method: 'DELETE'
        });
  
        if (!deleteRes.ok) {
          const err = await deleteRes.json();
          throw new Error(err.error || 'Error al eliminar el rol');
        }
  
        // ✅ Actualizar estado en frontend
        setTableData(prevData =>
          prevData.map(area => {
            if (area.name === selectedArea) {
              return {
                ...area,
                roles: area.roles.map(role =>
                  role.hierarchy === selectedHierarchy
                    ? { ...role, position: null, employees: null, subcargos: [] }
                    : role
                )
              };
            }
            return area;
          })
        );
  
        if (role.employees) {
          setEmpleadosAsignados(prev => prev - role.employees);
        }
  
        setModal(false);
        setPosition('');
        setEmployees('');
        setSelectedArea(null);
        setSelectedHierarchy(null);
        setSubcargos([]);
  
        alert("✅ Rol eliminado correctamente");
      }
    } catch (error) {
      console.error("❌ Error al eliminar el rol:", error);
      alert("❌ Error al eliminar el rol.");
    }
  };
  
  

  return (
    <>
      <div style={{
        margin: '16px',
        fontWeight: 'bold',
        fontSize: '16px',
        color: empleadosAsignados >= totalEmpleados ? 'green' : 'red'
      }}>
        Empleados asignados: {empleadosAsignados} / {totalEmpleados}
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th id="blank"></th>
              {['J1', 'J2', 'J3', 'J4'].map(j => {
                const empleadosActuales = tableData.reduce((acc, area) => {
                  const role = area.roles.find(r => r.hierarchy === j);
                  return acc + (role?.employees || 0);
                }, 0);
                return (
                  <th key={j} className="jerarquia">
                    <div>{j}{pyramid_svg}</div>
                    <div style={{ fontSize: '12px', color: 'gray' }}>({empleadosActuales})</div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {tableData.map((area, i) => (
              <tr key={i}>
                <th className="area-row">
                  <div className="area-name" onClick={() => openAreaModal(i, area.name)} style={{ cursor: 'pointer' }}>
                    {area.name}{edit_svg}
                  </div>
                </th>
                {area.roles.map((role, ri) => (
                  <td key={ri}>
                    {role.position ? (
                      <span onClick={() => toggleModal(area.name, role.hierarchy)}>
                        <p className="role-name">{role.position}</p> | <p>{role.employees}</p>
                      </span>
                    ) : (
                      <button onClick={() => toggleModal(area.name, role.hierarchy)}>+</button>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de cargo */}
      {modal && (
        <div className="modal-container">
          <div className="overlay">
            <div className="modal-content">
              <form onSubmit={handleSave}>
                <h3>Agregar Cargo en {selectedArea} - {selectedHierarchy}</h3>
                <label htmlFor="position">Cargo</label>
                <input value={position} onChange={e => setPosition(e.target.value)} placeholder="Nombre del cargo" id="position" />
                <label htmlFor="employees">Empleados</label>
                <input value={employees} onChange={e => setEmployees(e.target.value)} type="number" placeholder="Cantidad de empleados" id="employees" />

                <div className="subcargos-section">
                  <label>Subcargos:</label>
                  {subcargos.map((sub, index) => (
                    <div key={index} className="subcargo-item" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        value={sub.name || ''}
                        onChange={e => {
                          const updated = [...subcargos];
                          updated[index].name = e.target.value;
                          setSubcargos(updated);
                        }}
                        placeholder={`Subcargo ${index + 1}`}
                      />
                      <input
                        type="number"
                        value={sub.employees || ''}
                        onChange={e => {
                          const updated = [...subcargos];
                          updated[index].employees = parseInt(e.target.value);
                          setSubcargos(updated);
                        }}
                        style={{ width: '80px' }}
                        placeholder="Empleados"
                      />
                      <button
                        type="button"
                        onClick={async () => {
                          const confirm = window.confirm(`¿Eliminar el subcargo "${sub.name}"?`);
                          if (!confirm) return;

                          try {
                            // Encontrar el rol real en la tabla
                            const rolId = await (async () => {
                              const res = await fetch(`http://localhost:3000/roles/empresa/${empresaId}`);
                              const allRoles = await res.json();
                              const rol = allRoles.find(
                                r =>
                                  r.area === selectedArea &&
                                  r.jerarquia === selectedHierarchy &&
                                  r.position === position
                              );
                              return rol?.id;
                            })();

                            if (!rolId) {
                              alert("⚠️ No se pudo encontrar el rol en la base de datos.");
                              return;
                            }

                            const res = await fetch(`http://localhost:3000/roles/${rolId}/subcargos/${encodeURIComponent(sub.name)}`, {
                              method: 'DELETE',
                            });

                            const data = await res.json();
                            if (!res.ok) throw new Error(data.error || "Error al eliminar");

                            const updated = [...subcargos];
                            updated.splice(index, 1);
                            setSubcargos(updated);

                            alert("✅ Subcargo eliminado correctamente");
                          } catch (error) {
                            console.error("❌ Error eliminando subcargo:", error);
                            alert("❌ Error al eliminar subcargo");
                          }
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button type="button" className='add-subcargo-button' onClick={() => setSubcargos([...subcargos, { name: '', employees: '' }])}>
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

      {/* Modal de nombre del área */}
      {areaModal && (
        <div className="modal-container">
          <div className="overlay">
            <div className="modal-content">
              <h3>Editar nombre del área</h3>
              <input value={areaName} onChange={e => setAreaName(e.target.value)} placeholder="Nuevo nombre del área" />
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
