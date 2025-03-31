import React, { useState, useEffect } from "react";
import { NextButton } from "../../components/NextButton/next_button";
import { BackButton } from "../../components/BackButton/back-button";
import { Table } from "../../components/Table/Table";
import { TitleSection } from "../../components/TitleSection/TitleSection";
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
            setEmpleados(latestData.empleados);
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
    <section className="container">
      <TitleSection title="Tabla de Jerarquías y cargos" />

      <div className="employees-bar">
        <p>Total de empleados: {empleados}</p>
      </div>

      <Table/>

      <section className="navigation-buttons">
        <BackButton to="/"/>
        <NextButton text='Siguiente' to="/otra-pagina" className="next-button" />
      </section>
    </section>
  );
}