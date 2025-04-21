// exportToExcel.js
import * as XLSX from 'xlsx';

export function generarExcelDesdeTabla(tableData) {
  const rows = [];

  tableData.forEach((area, areaIndex) => {
    area.roles.forEach((role) => {
      const jerarquia = role.hierarchy;
      const areaName = area.name;
      const codigoArea = areaIndex + 1;

      if (role.subcargos?.length > 0) {
        role.subcargos.forEach((subcargo) => {
          const cantidad = parseInt(subcargo.employees || 0);
          for (let i = 0; i < cantidad; i++) {
            rows.push({
              "Nombre completo": "",
              "Número de Cedula": "",
              "Correo": "",
              "Cargo": subcargo.name,
              "Area": areaName,
              "Codigo de area": codigoArea,
              "Jerarquia": `Jerarquía ${jerarquia.replace('J', '')}`
            });
          }
        });
      } else if (role.position && role.employees) {
        const cantidad = parseInt(role.employees);
        for (let i = 0; i < cantidad; i++) {
          rows.push({
            "Nombre completo": "",
            "Número de Cedula": "",
            "Correo": "",
            "Cargo": role.position,
            "Area": areaName,
            "Codigo de area": codigoArea,
            "Jerarquia": `Jerarquía ${jerarquia.replace('J', '')}`
          });
        }
      }
    });
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Empleados');

  XLSX.writeFile(workbook, 'Empleados_Estructura.xlsx');
}
