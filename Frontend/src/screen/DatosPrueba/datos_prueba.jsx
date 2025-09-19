import React, { useEffect, useState } from "react";
import { StepBreadcrumb } from "../../components/StepBreadcrumb/breadcrumb";
import { Button, Table, TitleSection } from "../../components/index";
import { useNavigate } from "react-router-dom";
import "./datos_prueba.css";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "");
export function DatosPrueba() {
  const [empleados, setEmpleados] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await fetch(`${API_BASE}/empresas`, {
          headers: { "Content-Type": "application/json" },
          // credentials: "include", // actívalo si usas cookies/sesión
        });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();

        if (Array.isArray(data) && data.length) {
          const latest = data[data.length - 1];
          setEmpleados(latest.cantidad_empleados ?? 0);
        } else {
          console.warn("Respuesta vacía de /empresas");
          setEmpleados(0);
        }
      } catch (err) {
        console.error("Error obteniendo /empresas:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <StepBreadcrumb
        steps={["1", "2", "3", "4"]}
        currentStep={2}
        clickableSteps={[0, 1]}
        onStepClick={(idx) => idx === 0 && navigate("/innlab_form")}
      />
      <section className="container">
        <TitleSection title="Tabla de Jerarquías y áreas" />
        <Table empleados={empleados} />
        <section className="navigation-buttons">
          <Button variant="back" to="/innlab_form" />
          <Button variant="next" text="Siguiente" to="/download_page" />
        </section>
      </section>
      <img className="line-bckg-img" src="/BgLine-decoration.png" alt="" />
      <img className="dots-bckg-img" src="/BgPoints-decoration.png" alt="" />
    </>
  );
}
