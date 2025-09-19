// Table.jsx
import { useEffect, useState } from "react";
import { useAlert } from "../Alerts/useAlert";
import { Alert, FeedbackMessage, Tooltip } from "../index";
import ProgressBar from "../ProgressBar/ProgressBar";
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
} from "./api";
import EditAreaForm from "./EditAreaForm";
import EditRoleModal from "./EditRoleModal";
import RoleCell from "./RoleCell";
import "./Table.css";
import { useEmpresaData } from "./useEmpresaData";
import {
  saveStepData,
  loadStepData,
} from "../../components/Utils/breadcrumbUtils";

// 👉 usa BASE_URL (no API_BASE)
const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "");

export function Table() {
  const [empresaId, setEmpresaId] = useState(null);

  const saved = loadStepData("step3") || {};
  const [areas, setAreas] = useState(saved.areas || []);
  const [cargos, setCargos] = useState(saved.cargos || []);
  const [subcargos, setSubcargos] = useState(saved.subcargos || []);

  useEffect(() => {
    saveStepData("step3", { areas, cargos, subcargos });
  }, [areas, cargos, subcargos]);

 
  const [modal, setModal] = useState(false);
  const [areaModal, setAreaModal] = useState(false);

  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedCargo, setSelectedCargo] = useState(null);
  const [selectedJerarquia, setSelectedJerarquia] = useState(null);

  const [position, setPosition] = useState("");
  const [employees, setEmployees] = useState("");
  const [subcargoList, setSubcargoList] = useState([]);

  const [areaName, setAreaName] = useState("");
  const [areaIndex, setAreaIndex] = useState(null);
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "error",
  });
  const { alertInfo, showAlert } = useAlert();

  // Métricas y recarga
  const {
    empleadosPorJerarquia,
    jerarquiasPlaneadas,
    empleadosAsignados,
    totalEmpleados,
    refetch,
  } = useEmpresaData();

  const jerarquias = ["J1", "J2", "J3", "J4"];

  const jerarquiaIcons = {
    J1: "/src/assets/icons/IconJ1.png",
    J2: "/src/assets/icons/IconJ2.png",
    J3: "/src/assets/icons/IconJ3.png",
    J4: "/src/assets/icons/IconJ4.png",
  };

  const nivelesJerarquia = {
    J1: "La Jerarquía 1 (Ejecución)",
    J2: "La Jerarquía 2 (Supervisión)",
    J3: "La Jerarquía 3 (Gerencial)",
    J4: "La Jerarquía 4 (Directivo)",
  };

  // Carga inicial de tabla
  useEffect(() => {
    async function loadAll() {
      try {
        console.log('🔄 Iniciando carga de datos de tabla...');
        console.log('🔗 BASE_URL configurado:', BASE_URL);
        console.log('🔗 VITE_API_URL:', import.meta.env.VITE_API_URL);
        
        console.log('📡 Llamando a fetchEmpresas...');
        const empresas = await fetchEmpresas();
        console.log('📊 Empresas recibidas:', empresas);
        
        if (!empresas || empresas.length === 0) {
          console.warn('⚠️ No se encontraron empresas');
          setEmpresaId(null);
          setAreas([]); setCargos([]); setSubcargos([]);
          return;
        }
        
        const empresaActual = empresas[empresas.length - 1];
        console.log('🏢 Empresa actual seleccionada:', empresaActual);
        setEmpresaId(empresaActual.id);

        console.log('📡 Cargando datos relacionados...');
        const [areasData, cargosData, subcargosData] =
          await Promise.all([
            fetchAreas(empresaActual.id),
            fetchCargos(),
            fetchSubcargos(),
          ]);

        console.log('📊 Datos cargados:', { areasData, cargosData, subcargosData });

        setAreas(areasData);
        setCargos(
          cargosData.filter((c) => areasData.some((a) => a.id === c.area_id))
        );
        setSubcargos(subcargosData);
        setUsuarios([]); // Array vacío en lugar de filtrar usuariosData
        
        console.log('✅ Carga de datos completada exitosamente');
      } catch (e) {
        console.error("❌ Error cargando datos iniciales de la tabla:", e);
        console.error("❌ Stack trace:", e.stack);
        setEmpresaId(null);
        setAreas([]); setCargos([]); setSubcargos([]);
      }
    }
    loadAll();
  }, []);

  const openAreaModal = (index, name) => {
    setAreaIndex(index);
    setAreaName(name);
    setAreaModal(true);
  };

  const openRoleModal = (area, cargo, jerarquia) => {
    if (!area) return;
    setSelectedArea(area);
    setSelectedCargo(cargo || null);
    setSelectedJerarquia(jerarquia);
    setPosition(cargo?.nombre || "");
    setEmployees(cargo?.personas || "");
    const actuales = subcargos
      .filter((s) => s.cargo_id === cargo?.id)
      .map((s) => ({
        id: s.id,
        uid: s.id ? undefined : Date.now() + Math.random(),
        nombre: s.nombre,
        personas: s.personas || 0,
      }));
    setSubcargoList(actuales);
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
    // 1) Validaciones
    if (!position.trim()) {
      showAlert("error", "Error de Validación", "El nombre del cargo es obligatorio.");
      return;
    }
    const totalEmp = parseInt(employees, 10);
    if (isNaN(totalEmp) || totalEmp < 0) {
      showAlert("error", "Error de Validación", "La cantidad de empleados es obligatoria y debe ser un número no negativo.");
      return;
    }

    if (subcargoList.length > 0) {
      for (const sub of subcargoList) {
        if (!sub.nombre.trim()) {
          showAlert("error", "Error de Validación", "El nombre de todos los subcargos es obligatorio si hay subcargos.");
          return;
        }
        const subPersonas = parseInt(sub.personas, 10);
        if (isNaN(subPersonas) || subPersonas < 0) {
          showAlert("error", "Error de Validación", "La cantidad de personas en todos los subcargos es obligatoria y debe ser un número no negativo.");
          return;
        }
      }
      const totalSub = subcargoList.reduce((sum, s) => sum + (s.personas || 0), 0);
      if (totalSub !== totalEmp) {
        showAlert("error", "Error de validación",
          `La suma de empleados en subcargos (${totalSub}) no coincide con el total del cargo (${totalEmp}).\n\nPor favor, ajusta las cantidades.`
        );
        return;
      }
    }

    // 2) Guardado
    try {
      let cargoId;

      if (!selectedCargo?.id) {
        const nuevo = await saveCargo({
          nombre: position.trim(),
          personas: totalEmp,
          area_id: selectedArea.id,
          jerarquia_id: String(selectedJerarquia),
        });
        cargoId = nuevo.id;
        setCargos((prev) => [...prev, nuevo]);
      } else {
        cargoId = selectedCargo.id;
        await updateCargo(cargoId, { nombre: position.trim(), personas: totalEmp });
        setCargos((prev) =>
          prev.map((c) => (c.id === cargoId ? { ...c, nombre: position.trim(), personas: totalEmp } : c))
        );
      }

      if (subcargoList.length > 0) {
        for (const sub of subcargoList) {
          if (sub.id) {
            await updateSubcargo(sub.id, { nombre: sub.nombre.trim(), personas: sub.personas });
          } else if (sub.nombre.trim()) {
            await saveSubcargo({ nombre: sub.nombre.trim(), personas: sub.personas, cargo_id: cargoId });
          }
        }
      }

      const subAct = await fetchSubcargosByCargo(cargoId);
      setSubcargos((prev) => prev.filter((s) => s.cargo_id !== cargoId).concat(subAct));
      setSubcargoList(subAct);
    } catch (err) {
      console.error("❌ Error al guardar cargo/subcargos:", err);
      showAlert("error", "Error al guardar", "❌ Error al guardar cargo o subcargos.");
      return;
    }

    try {
      await refetch();
    } catch (e) {
      console.warn("⚠️ Error refrescando métricas después de guardar:", e);
    }

    setModal(false);
  };

  const handleDeleteRole = async () => {
    if (!selectedCargo) return;

    const confirmed = await showAlert(
      "delete",
      "Eliminar cargo",
      `¿Estás seguro de eliminar el cargo "${selectedCargo.nombre}"? Esta acción no se puede deshacer.`
    );
    if (!confirmed) return;

    try {
      await deleteCargo(selectedCargo.id);
      setCargos((prev) => prev.filter((c) => c.id !== selectedCargo.id));
      showAlert("complete", "Cargo eliminado", "✅ Cargo eliminado correctamente");
    } catch (err) {
      console.error("❌ Error al eliminar cargo:", err);
      showAlert("error", "Error", "❌ Error al eliminar cargo");
    }

    try { await refetch(); } catch (e) { console.warn("⚠️ Error refrescando métricas:", e); }
    setModal(false);
  };

  const handleAddSubcargo = () => {
    setSubcargoList((prev) => [...prev, { nombre: "", personas: 0 }]);
  };

  const handleDeleteSubcargo = async (id) => {
    try {
      await deleteSubcargo(id);
      setSubcargos((prev) => prev.filter((s) => s.id !== id));
      setSubcargoList((prev) => prev.filter((s) => s.id !== id));
    } catch (e) {
      console.error("❌ Error al eliminar subcargo:", e);
      setAlert({ show: true, message: "Error al eliminar subcargo", type: "error" });
    }
  };

  const handleDeleteArea = async () => {
    if (!areaName || areaIndex === null) return;

    const confirmed = await showAlert(
      "delete",
      "Eliminar área",
      `¿Estás seguro de eliminar el área "${areaName}"?\n\nEsta acción no se puede deshacer.`
    );
    if (!confirmed) return;

    try {
      const id = areas[areaIndex].id;
      const r = await fetch(`${BASE_URL}/areas/${id}`, { method: "DELETE" });
      if (!r.ok) {
        const e = await r.json().catch(() => ({}));
        throw new Error(e.error || `HTTP ${r.status}`);
      }
      setAreas((prev) => prev.filter((_, i) => i !== areaIndex));
      showAlert("complete", "Área eliminada", "✅ Área eliminada correctamente");
    } catch (e) {
      console.error("❌ Error al eliminar área:", e);
      showAlert("error", "Error", "❌ Error al eliminar área");
    }
    setAreaModal(false);
  };

  return (
    <>
      <div className="table-container">
        {alertInfo && (
          <Alert
            {...alertInfo}
            position="top-center"
            onConfirm={alertInfo.onConfirm}
            onCancel={alertInfo.onCancel}
          />
        )}
        <table>
          <thead>
            <tr>
              <th />
              {jerarquias.map((j) => (
                <th key={j} className="jerarquia">
                  <div className="tooltip-jerarquia">
                    <p>{j}</p>
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
                    {
                      <svg fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M10.4753 2.84195L2.17058 11.1467C1.84214 11.4752 1.53712 12.0851 1.46674 12.5309L1.021 15.698C0.856777 16.8475 1.65443 17.6451 2.80396 17.4809L5.97105 17.0352C6.41679 16.9648 7.0502 16.6598 7.35517 16.3313L15.66 8.02662C17.091 6.59557 17.7713 4.92992 15.66 2.81854C13.572 0.730617 11.9063 1.4109 10.4753 2.84195Z"
                          stroke="#292D32"
                          strokeWidth="2"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9.27904 4.03833C9.98283 6.57199 11.9535 8.54262 14.4871 9.24641"
                          stroke="#292D32"
                          strokeWidth="2"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    }
                  </div>
                </th>
                {jerarquias.map((j) => (
                  <td key={j}>
                    <RoleCell
                      areaId={area.id}
                      jerarquia={j}
                      cargos={cargos.filter(
                        (c) => c.area_id === area.id && c.jerarquia_id === j
                      )}
                      subcargos={subcargos}
                      onClick={(c) => openRoleModal(area, c, j)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="area-column">
                <ProgressBar
                  empleadosAsignados={empleadosAsignados}
                  empleadosPlaneados={totalEmpleados}
                />
              </td>
              {jerarquias.map((j) => (
                <td key={j}>
                  <ProgressBar
                    empleadosAsignados={empleadosPorJerarquia[j]}
                    empleadosPlaneados={jerarquiasPlaneadas[j]}
                  />
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
          setAlert={setAlert}
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
