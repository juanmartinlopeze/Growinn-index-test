import React, { useEffect, useState } from "react";
import { StepBreadcrumb } from "../../components/StepBreadcrumb/breadcrumb";
import { Button, Table, TitleSection } from "../../components/index";
import { useNavigate } from "react-router-dom";
import "./datos_prueba.css";

const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "");
export function DatosPrueba() {
  const [empleados, setEmpleados] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🔗 Conectando a:', `${BASE_URL}/empresas`);
        
        const resp = await fetch(`${BASE_URL}/empresas`, {
          headers: { "Content-Type": "application/json" },
          // credentials: "include", // actívalo si usas cookies/sesión
        });
        
        console.log('📡 Respuesta:', resp.status, resp.statusText);
        
        if (!resp.ok) {
          const errorText = await resp.text();
          console.error('❌ Error response:', errorText);
          throw new Error(`HTTP ${resp.status}: ${errorText}`);
        }
        
        const data = await resp.json();
        console.log('📊 Datos recibidos:', data);

        if (Array.isArray(data) && data.length) {
          const latest = data[data.length - 1];
          setEmpleados(latest.cantidad_empleados ?? 0);
        } else {
          console.warn("Respuesta vacía de /empresas");
          setEmpleados(0);
        }
      } catch (err) {
        console.error("❌ Error obteniendo /empresas:", err);
        // Mostrar error al usuario
        setEmpleados(0);
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
        <StepBreadcrumb
          steps={["Jerarquías y cargos", "Áreas", "Tabla de jerarquías"]}
          currentStep={2} // Tercer paso
          clickableSteps={[0, 1]} // Permite volver al paso 1 y 2
          onStepClick={(idx) => {
            if (idx === 0) navigate("/innlab_form");
          }}
        />
        <TitleSection title="Tabla de Jerarquías y áreas" />
        <Table empleados={empleados} />
        <section className="navigation-buttons">
          <Button variant="back" to="/innlab_form" />
          <Button variant="next" text="Siguiente" to="/download_page" />
        </section>
      </section>
      <img className="line-bckg-img" src="/images/decorative/BgLine-decoration.png" alt="" />
      <img className="dots-bckg-img" src="/images/decorative/BgPoints-decoration.png" alt="" />
    </>
  );
}
