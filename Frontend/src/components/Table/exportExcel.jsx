// exportToExcel.js
import * as XLSX from 'xlsx';

export function generarExcelDesdeBD({ areas, cargos, subcargos, usuarios }) {
  const rows = [];

  areas.forEach((area, areaIndex) => {
    const areaCargos = cargos.filter(c => c.area_id === area.id);

    areaCargos.forEach(cargo => {
      const cargoSubcargos = subcargos.filter(s => s.cargo_id === cargo.id);

      if (cargoSubcargos.length > 0) {
        cargoSubcargos.forEach(subcargo => {
          const personas = usuarios.filter(u => u.subcargo_id === subcargo.id);
          personas.forEach((user) => {
            rows.push({
              "Nombre completo": user.nombre || "",
              "Número de Cédula": user.cedula || "",
              "Correo": user.correo || "",
              "Cargo": subcargo.nombre,
              "Área": area.nombre,
              "Código de área": areaIndex + 1,
              "Jerarquía": user.jerarquia ? `Jerarquía ${user.jerarquia.replace('J', '')}` : ""
            });
          });
        });
      } else {
        const personas = usuarios.filter(u => u.subcargo_id === null && u.area_id === area.id && u.cargo_id === cargo.id);
        personas.forEach((user) => {
          rows.push({
            "Nombre completo": user.nombre || "",
            "Número de Cédula": user.cedula || "",
            "Correo": user.correo || "",
            "Cargo": cargo.nombre,
            "Área": area.nombre,
            "Código de área": areaIndex + 1,
            "Jerarquía": user.jerarquia ? `Jerarquía ${user.jerarquia.replace('J', '')}` : ""
          });
        });
      }
    });
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Empleados');

  XLSX.writeFile(workbook, 'Empleados_Estructura.xlsx');
}
