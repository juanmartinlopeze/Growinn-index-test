import React, { useState, useEffect } from "react";
import {
  saveStepData,
  loadStepData,
} from "../../components/Utils/breadcrumbUtils";

import { StepBreadcrumb } from "../../components/StepBreadcrumb/breadcrumb";
import { Button } from "../../components/index";
import { useLocation, useNavigate } from "react-router-dom";
import { FormAreas } from "../../components/FormAreas/form_areas";
import {
  TitleSection,
  Subtitle,
  Description,
  Alert,
} from "../../components/index";
import "./areas_form.css";

const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "");
export function AreasForm() {
  const location = useLocation();
  const navigate = useNavigate();

  // estados para mostrar el tipo de alerta
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [isCreatingAreas, setIsCreatingAreas] = useState(false);

  // Recibir datos desde InnlabForm

  const {
    totalAreas = 0,
    empleados,
    jerarquia1,
    jerarquia2,
    jerarquia3,
    jerarquia4,
    empresa_id, // 🆔 Nuevo: recibir empresa_id del step anterior
  } = location.state || {};

  console.log('DEBUG AreasForm location.state:', location.state);
  console.log('DEBUG AreasForm empresa_id:', empresa_id);
  console.log('DEBUG AreasForm totalAreas:', totalAreas, 'empleados:', empleados, 'jerarquias:', jerarquia1, jerarquia2, jerarquia3, jerarquia4);

  // Inicializar formData sin localStorage
  const [formData, setFormData] = useState(() => {
    const saved = loadStepData("step2");
    return saved || {};
  });

  useEffect(() => {
    saveStepData("step2", formData);
  }, [formData]);

  // preguntas dinámicas
  // Si ya vienen nombres de áreas desde el backend, usarlos
  let areaNamesFromBackend = (location.state && location.state.areas) ? location.state.areas : null;
  const questions = areaNamesFromBackend
    ? areaNamesFromBackend.map((area, i) => ({
        id: i + 1,
        field: `area${i + 1}`,
        title: (
          <>
            Área {i + 1}: <span style={{ fontWeight: 500 }}>{area.nombre || area}</span>
          </>
        ),
        placeholder: area.nombre || area,
        disabled: true
      }))
    : Array.from({ length: totalAreas }, (_, i) => ({
        id: i + 1,
        field: `area${i + 1}`,
        title: (
          <>
            ¿Cuál es el nombre del{" "}
            <span style={{ fontWeight: 500 }}>área {i + 1}?</span>
          </>
        ),
        placeholder: "Digite aquí",
      }));

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    // Si ya vienen áreas del backend, no validar ni pedir nombres
    let nombresAreas;
    if (areaNamesFromBackend) {
      nombresAreas = areaNamesFromBackend.map(a => a.nombre || a);
    } else {
      nombresAreas = questions.map((q) => (formData[q.field] || "").trim());
      // Ya no mostramos alerta aquí, solo prevenimos avanzar si falta info
      if (nombresAreas.some((nombre) => nombre === "")) {
        return;
      }
    }

    if (!empresa_id) {
      setAlertType("generalError");
      setAlertMessage("Error: No se encontró el ID de la empresa. Vuelve al paso anterior.");
      setShowAlert(true);
      return;
    }

    console.log("📁 Creando áreas para empresa_id:", empresa_id, "Areas:", nombresAreas);

    try {
      setIsCreatingAreas(true);
      
      // 📁 Crear cada área individualmente vinculada a la empresa
      const areasCreadas = [];
      
      for (const nombreArea of nombresAreas) {
        console.log("� Creando área:", nombreArea);
        
        const response = await fetch(`${BASE_URL}/areas`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: nombreArea,
            empresa_id: empresa_id,
            jerarquia1: Number(jerarquia1),
            jerarquia2: Number(jerarquia2),
            jerarquia3: Number(jerarquia3),
            jerarquia4: Number(jerarquia4),
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          console.error("❌ Error creando área:", nombreArea, error);
          throw new Error(error.error || `Error creando área: ${nombreArea}`);
        }

        const areaCreada = await response.json();
        areasCreadas.push(areaCreada);
        console.log("✅ Área creada:", areaCreada);
      }

      console.log("✅ Todas las áreas creadas exitosamente:", areasCreadas);

      // 💾 Guardar áreas en localStorage con empresa_id correcto
      const areasDataConEmpresaId = areasCreadas.map(area => ({
        ...area,
        empresa_id: empresa_id // Asegurar que tengan empresa_id
      }));
      
      saveStepData("step2", { areas: areasDataConEmpresaId });

      // Redirigir a la siguiente vista con areas y empresa_id
      navigate("/datos_prueba", { 
        state: { 
          areas: areasDataConEmpresaId,
          empresa_id: empresa_id 
        } 
      });
      
    } catch (err) {
      console.error("❌ Error en handleSubmit:", err);
      setAlertType("generalError");
      setAlertMessage(err.message || "❌ Error al crear las áreas");
      setShowAlert(true);
    } finally {
      setIsCreatingAreas(false);
    }
  };

  return (
    <section className="container">
      <StepBreadcrumb
        steps={["Jerarquías y cargos", "Áreas"]}
        currentStep={1} // Segundo paso
        clickableSteps={[0]}
        onStepClick={(idx) => {
          if (idx === 0) navigate("/innlab_form");
        }}
      />
      <div className="innlab-form-header">
        <div className="jerarquia-header">
          <TitleSection title="Áreas" />
        </div>
        <div className="areas-header">
          <div className="areas-subtitle">
            <Subtitle text="¿Por qué pedimos nombre de cada área?" />
            <Description
              text="Solicitamos los nombres de las áreas para facilitar la interacción en el siguiente paso, donde podrás registrar los cargos de cada área. Esta información también nos ayuda a comprender mejor cómo se organiza tu empresa y cómo se distribuyen las funciones."
              variant="forms"
            />
          </div>
          <Description
            text="Por favor, usa nombres claros que reflejen el propósito o función principal de cada área."
            variant="forms"
          />
        </div>
      </div>

      <div className="forms-container">
        <FormAreas
          questions={questions}
          onInputChange={handleInputChange}
          formData={formData}
        />
      </div>

      <div className="buttons-container">
        <Button
          variant="back"
          text="Atrás"
          onClick={() => {
            navigate("/innlab_form");
          }}
        />
        <Button 
          variant="next" 
          text={isCreatingAreas ? "Creando áreas..." : "Siguiente"} 
          onClick={handleSubmit}
          disabled={isCreatingAreas}
        />
      </div>

      <img
        className="linea-curva"
        src="/BgLine-decoration.png"
        alt="Decoración"
      />
      <img className="puntos" src="/BgPoints-decoration.png" alt="Decoración" />

      {/* Solo mostramos alertas generales, no de nombres de áreas */}
      {showAlert && alertType === "generalError" && (
        <Alert
          type={alertType}
          message={alertMessage}
          onClose={() => setShowAlert(false)}
        />
      )}
    </section>
  );
}
