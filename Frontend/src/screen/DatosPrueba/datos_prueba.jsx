import React, { useState, useEffect } from "react";
import { NextButton } from "../../components/NextButton/next_button";
import { BackButton } from "../../components/BackButton/back-button";
import "./datos_prueba.css";

export function DatosPrueba() {
  const [areas, setAreas] = useState([]); // Áreas dinámicas
  const [empleados, setEmpleados] = useState(0); // Número total de empleados
  const jerarquias = ["J1", "J2", "J3", "J4"]; // Jerarquías estáticas

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/empresas"); // Endpoint para obtener los datos
        if (response.ok) {
          const data = await response.json(); // Datos obtenidos del backend
          if (data.length > 0) {
            const latestData = data[data.length - 1]; // Obtener el último registro (el más reciente)
            setEmpleados(latestData.empleados);

            // Generar las áreas dinámicamente
            const generatedAreas = Array.from(
              { length: latestData.areas },
              (_, index) => `Área ${index + 1}`
            );
            setAreas(generatedAreas);
          }
        } else {
          console.error("Error al obtener los datos del backend");
        }
      } catch (error) {
        console.error("Error al conectar con el servidor:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Resultados de la Encuesta</h1>

      {/* Barra superior con el número de empleados */}
      <div className="employees-bar">
        <p>Total de empleados: {empleados}</p>
      </div>

      {/* Tabla dinámica */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th id="blank"></th>
              {jerarquias.map((jerarquia, index) => (
                <th key={index} className="jerarquia">
                  {jerarquia}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {areas.map((area, index) => (
              <tr key={index}>
                <th className="area-row">{area}</th>
                {jerarquias.map((_, jerarquiaIndex) => (
                  <td key={jerarquiaIndex}>
                    {/* Aquí puedes agregar lógica para mostrar datos o botones */}
                    <button className="add-button">+</button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sección de botones */}
      <section className="navigation-buttons">
        <BackButton to="/" className="back-button" />
        <NextButton to="/otra-pagina" className="next-button" />
      </section>
    </div>
  );
}