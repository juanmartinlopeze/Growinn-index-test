import React, { useState, useEffect } from "react";
import { Table, TitleSection, Button } from "../../components/index";
import "./datos_prueba.css";

export function DatosPrueba() {
  const [empleados, setEmpleados] = useState(0); // Número total de empleados

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/empresas"); // Endpoint para obtener los datos
        if (response.ok) {
          const data = await response.json(); // Datos obtenidos del backend
          if (data.length > 0) {
            const latestData = data[data.length - 1]; // Obtener el último registro (el más reciente)
            setEmpleados(latestData.cantidad_empleados); // Cambiado a "cantidad_empleados"
          } else {
            console.warn("No se encontraron datos en la respuesta del backend.");
          }
        } else {
          console.error(`Error al obtener los datos del backend: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        console.error("Error al conectar con el servidor:", error);
      }
    };
  
    fetchData();
  }, []);

  return (
    <section className="container">
      <TitleSection title="Tabla de Jerarquías y cargos" />
      <Table />

      <section className="navigation-buttons">
        <Button variant="back" to="/" />
        <Button variant="next" text='Siguiente' to="/download_page" />
      </section>
    </section>
  );
}