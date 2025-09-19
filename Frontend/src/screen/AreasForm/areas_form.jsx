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

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "");
export function AreasForm() {
  const location = useLocation();
  const navigate = useNavigate();

  // estados para mostrar el tipo de alerta
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  // Recibir datos desde InnlabForm
  const {
    totalAreas = 0,
    empleados,
    jerarquia1,
    jerarquia2,
    jerarquia3,
    jerarquia4,
  } = location.state || {};

  // Inicializar formData sin localStorage
  const [formData, setFormData] = useState(() => {
    const saved = loadStepData("step2");
    return saved || {};
  });

  useEffect(() => {
    saveStepData("step2", formData);
  }, [formData]);

  // preguntas dinámicas
  const questions = Array.from({ length: totalAreas }, (_, i) => ({
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
    const nombresAreas = questions.map((q) => (formData[q.field] || "").trim());

    if (nombresAreas.some((nombre) => nombre === "")) {
      setAlertType("complete");
      setAlertMessage(
        "Por favor, completa todos los nombres de las áreas para continuar."
      );
      setShowAlert(true);
      return;
    }

    const payload = {
      nombre: "Empresa sin nombre",
      cantidad_empleados: Number(empleados),
      jerarquia: 4,
      jerarquia1: Number(jerarquia1),
      jerarquia2: Number(jerarquia2),
      jerarquia3: Number(jerarquia3),
      jerarquia4: Number(jerarquia4),
      areas: nombresAreas,
    };

    console.log("📦 Payload que se envía al backend:", payload);

    try {
      const res = await fetch(`${API_BASE}/empresas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Error:", error);
        setAlertType("generalError");
        setAlertMessage(error.error || "❌ Error al crear empresa");
        setShowAlert(true);
        return;
      }

      const data = await res.json();
      console.log("✅ Empresa creada con áreas:", data);

      // Redirigir a la siguiente vista
      navigate("/datos_prueba", { state: { areas: nombresAreas } });
    } catch (err) {
      console.error("❌ Error en la petición:", err);
      setAlertType("generalError");
      setAlertMessage("No se pudo guardar la empresa");
      setShowAlert(true);
    }
  };

  return (
    <div>
      <StepBreadcrumb
        steps={["1", "2", "3", "4"]}
        currentStep={1} // Segundo paso
        clickableSteps={[0]}
        onStepClick={(idx) => {
          if (idx === 0) navigate("/innlab_form");
        }}
      />

      <section className="container">
        <div className="innlab-form-header">
          <div className="jerarquia-header">
            <TitleSection title="Áreas" />
          </div>
          <Subtitle text="¿Por qué pedimos nombre de cada área?" />
          <Description
            text="Solicitamos los nombres de las áreas para facilitar la interacción en el siguiente paso, donde podrás registrar los cargos de cada área. Esta información también nos ayuda a comprender mejor cómo se organiza tu empresa y cómo se distribuyen las funciones."
            variant="forms"
          />
          <Description
            text="Por favor, usa nombres claros que reflejen el propósito o función principal de cada área."
            variant="forms2"
          />
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
          <Button variant="next" text="Siguiente" onClick={handleSubmit} />
        </div>

        <img
          className="linea-curva"
          src="/BgLine-decoration.png"
          alt="Decoración"
        />
        <img
          className="puntos"
          src="/BgPoints-decoration.png"
          alt="Decoración"
        />

        {showAlert && (
          <Alert
            type={alertType}
            message={alertMessage}
            onClose={() => setShowAlert(false)}
          />
        )}
      </section>
    </div>
  );
}
