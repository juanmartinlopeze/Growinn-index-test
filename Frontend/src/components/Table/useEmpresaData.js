// useEmpresaData.js
import { useEffect, useState, useCallback } from 'react';
import {
  fetchEmpresas,
  fetchAreas,
  fetchCargos,
  fetchSubcargos
} from './api';

export function useEmpresaData() {
  const [empresaId, setEmpresaId] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [totalEmpleados, setTotalEmpleados] = useState(0);
  const [empleadosAsignados, setEmpleadosAsignados] = useState(0);
  const [empleadosPorJerarquia, setEmpleadosPorJerarquia] = useState({ J1: 0, J2: 0, J3: 0, J4: 0 });
  const [jerarquiasPlaneadas, setJerarquiasPlaneadas] = useState({ J1: 0, J2: 0, J3: 0, J4: 0 });

  // Función para recargar todos los datos y métricas
  const refetch = useCallback(async () => {
    try {
      // 1) Empresa más reciente
      const empresas = await fetchEmpresas();
      if (!empresas.length) return;
      const latest = empresas[empresas.length - 1];
      setEmpresaId(latest.id);
      setTotalEmpleados(latest.cantidad_empleados || 0);

      // 2) Planeados por jerarquía
      setJerarquiasPlaneadas({
        J1: latest.jerarquia1 || 0,
        J2: latest.jerarquia2 || 0,
        J3: latest.jerarquia3 || 0,
        J4: latest.jerarquia4 || 0,
      });

      // 3) Cargar áreas, cargos y subcargos
      const [areas, cargos, subcargos] = await Promise.all([
        fetchAreas(latest.id),
        fetchCargos(),
        fetchSubcargos(),
      ]);

      // Filtrar cargos de esta empresa
      const cargosEmpresa = cargos.filter(c => areas.some(a => a.id === c.area_id));

      // 4) Calcular asignados por jerarquía
      const jerCount = { J1: 0, J2: 0, J3: 0, J4: 0 };
      let totalCount = 0;

      cargosEmpresa.forEach(cargo => {
        const main = cargo.personas || 0;
        const subSum = subcargos
          .filter(s => s.cargo_id === cargo.id)
          .reduce((acc, s) => acc + (s.personas || 0), 0);

        // Si hay subcargos, los contamos; si no, contamos el total 'personas'
        const asignadosRol = subSum > 0 ? subSum : main;
        totalCount += asignadosRol;

        const key = cargo.jerarquia_id;
        if (jerCount[key] !== undefined) jerCount[key] += asignadosRol;
      });

      setEmpleadosAsignados(totalCount);
      setEmpleadosPorJerarquia(jerCount);

      // 5) Generar tableData para UI
      const generatedAreas = areas.map(area => {
        const cargosArea = cargosEmpresa.filter(c => c.area_id === area.id);
        const rolesData = ['J1', 'J2', 'J3', 'J4'].map(j => {
          const role = cargosArea.find(c => c.jerarquia_id === j);
          return role
            ? {
                hierarchy: j,
                position: role.nombre || role.position,
                employees: role.personas,
                subcargos: subcargos.filter(s => s.cargo_id === role.id)
              }
            : { hierarchy: j, position: null, employees: null, subcargos: [] };
        });
        return { name: area.nombre, roles: rolesData };
      });

      setTableData(generatedAreas);
    } catch (error) {
      console.error('Error en useEmpresaData.refetch:', error);
    }
  }, []);

  // Carga inicial y suscripción a refetch
  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    empresaId,
    tableData,
    totalEmpleados,
    empleadosAsignados,
    empleadosPorJerarquia,
    jerarquiasPlaneadas,
    refetch,
  };
}