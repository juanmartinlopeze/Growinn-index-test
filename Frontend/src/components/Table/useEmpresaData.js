// useEmpresaData.js - Hook optimizado que recibe datos ya cargados
import { useMemo } from 'react';

export function useEmpresaData(areas = [], cargos = [], subcargos = [], empresaData = null) {
  // Calcular métricas memoizadas
  const metrics = useMemo(() => {
    if (!empresaData) {
      return {
        empresaId: null,
        totalEmpleados: 0,
        empleadosAsignados: 0,
        empleadosPorJerarquia: { J1: 0, J2: 0, J3: 0, J4: 0 },
        jerarquiasPlaneadas: { J1: 0, J2: 0, J3: 0, J4: 0 },
      };
    }

    // Métricas planeadas
    const jerarquiasPlaneadas = {
      J1: empresaData.jerarquia1 || 0,
      J2: empresaData.jerarquia2 || 0,
      J3: empresaData.jerarquia3 || 0,
      J4: empresaData.jerarquia4 || 0,
    };

    // Crear índices para búsqueda rápida
    const areaIds = new Set(areas.map(a => a.id));
    const cargosEmpresa = cargos.filter(c => areaIds.has(c.area_id));
    
    // Mapa de subcargos por cargo_id
    const subcargosMap = new Map();
    subcargos.forEach(sub => {
      if (!subcargosMap.has(sub.cargo_id)) {
        subcargosMap.set(sub.cargo_id, []);
      }
      subcargosMap.get(sub.cargo_id).push(sub);
    });

    // Calcular asignados por jerarquía
    const empleadosPorJerarquia = { J1: 0, J2: 0, J3: 0, J4: 0 };
    let empleadosAsignados = 0;

    cargosEmpresa.forEach(cargo => {
      const cargoSubcargos = subcargosMap.get(cargo.id) || [];
      const subSum = cargoSubcargos.reduce((acc, s) => acc + (s.personas || 0), 0);
      
      // Si hay subcargos, usar esa suma; si no, usar personas del cargo
      const asignadosRol = cargoSubcargos.length > 0 ? subSum : (cargo.personas || 0);
      empleadosAsignados += asignadosRol;

      const jerarquia = cargo.jerarquia_id;
      if (empleadosPorJerarquia[jerarquia] !== undefined) {
        empleadosPorJerarquia[jerarquia] += asignadosRol;
      }
    });

    return {
      empresaId: empresaData.id,
      totalEmpleados: empresaData.cantidad_empleados || 0,
      empleadosAsignados,
      empleadosPorJerarquia,
      jerarquiasPlaneadas,
    };
  }, [areas, cargos, subcargos, empresaData]);

  return metrics;
}