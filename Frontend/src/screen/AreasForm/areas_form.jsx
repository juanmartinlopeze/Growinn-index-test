import React, { useState, useEffect } from "react";
import { saveStepData, loadStepData } from "../../components/Utils/breadcrumbUtils";
import { StepBreadcrumb } from "../../components/StepBreadcrumb/breadcrumb";
import { Button, TitleSection, Subtitle, Description, Alert } from "../../components/index";
import { useLocation, useNavigate } from "react-router-dom";
import { FormAreas } from "../../components/FormAreas/form_areas";
import "./areas_form.css";

const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "");

export function AreasForm() {

  // Si en el futuro se reciben áreas del backend, descomentar y obtenerlas aquí:
  // const areaNamesFromBackend = ...
  const location = useLocation();
  const navigate = useNavigate();

  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [isCreatingAreas, setIsCreatingAreas] = useState(false);

  // State recibido del step anterior
  const {
    totalAreas = 0,
    empleados,
    jerarquia1,
    jerarquia2,
    jerarquia3,
    jerarquia4,
    empresa_id, // viene del step anterior
  } = location.state || {};

  // Estado local del formulario (persistente entre recargas via localStorage)
  const [formData, setFormData] = useState(() => loadStepData("step2") || {});

  useEffect(() => {
    saveStepData("step2", formData);
  }, [formData]);

  const questions = Array.from({ length: totalAreas }, (_, i) => ({
    id: i + 1,
    field: `area${i + 1}`,
    title: (
      <>
        ¿Cuál es el nombre del <span style={{ fontWeight: 500 }}>área {i + 1}?</span>
      </>
    ),
    placeholder: "Digite aquí",
  }));

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {

    // Si en el futuro se reciben áreas del backend, aquí se puede usar areaNamesFromBackend
    // Por ahora, solo usamos los nombres del formulario:
    const nombresAreas = questions.map((q) => (formData[q.field] || "").trim());
    if (nombresAreas.some((nombre) => nombre === "")) {
      setAlertType("complete");
      setAlertMessage("Por favor, completa todos los nombres de las áreas para continuar.");
      setShowAlert(true);
      return;
    }

    if (!empresa_id) {
      setAlertType("generalError");
      setAlertMessage("Error: No se encontró el ID de la empresa. Vuelve al paso anterior.");
      setShowAlert(true);
      return;
    }

    try {
      setIsCreatingAreas(true);

      // POST de todas las áreas en paralelo
      const created = await Promise.all(
        nombresAreas.map(async (nombreArea) => {
          const res = await fetch(`${BASE_URL}/areas`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nombre: nombreArea,
              empresa_id,
              jerarquia1: Number(jerarquia1),
              jerarquia2: Number(jerarquia2),
              jerarquia3: Number(jerarquia3),
              jerarquia4: Number(jerarquia4),
            }),
          });

          if (!res.ok) {
            let serverErr = "Error al crear el área";
            try {
              const e = await res.json();
              serverErr = e?.error || serverErr;
            } catch {}
            throw new Error(`${serverErr}: ${nombreArea}`);
          }

          return res.json();
        })
      );

      // Aseguramos empresa_id en cada objeto guardado localmente
      const areasDataConEmpresaId = created.map((area) => ({
        ...area,
        empresa_id,
      }));

      // Guardar en localStorage como parte del step2
      saveStepData("step2", { ...formData, areas: areasDataConEmpresaId });

      // Navegar al siguiente step con la data necesaria
      navigate("/datos_prueba", {
        state: {
          areas: areasDataConEmpresaId,
          empresa_id,
          empleados,
          jerarquia1,
          jerarquia2,
          jerarquia3,
          jerarquia4,
        },
      });
    } catch (err) {
      console.error("❌ Error creando áreas:", err);
      setAlertType("generalError");
      setAlertMessage(err.message || "❌ Ocurrió un error al crear las áreas.");
      setShowAlert(true);
    } finally {
      setIsCreatingAreas(false);
    }
  };

  return (
    <section className="container">
      <StepBreadcrumb
        steps={["Jerarquías y cargos", "Áreas"]}
        currentStep={1}
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
            <Subtitle text="¿Por qué pedimos el nombre de cada área?" />
            <Description
              text="Solicitamos los nombres de las áreas para facilitar el siguiente paso, donde podrás registrar los cargos por área. Esto también nos ayuda a entender la organización de tu empresa."
              variant="forms"
            />
          </div>
          <Description
            text="Usa nombres claros que reflejen el propósito principal de cada área."
            variant="forms"
          />
        </div>
      </div>

      <div className="forms-container">
        <FormAreas questions={questions} onInputChange={handleInputChange} formData={formData} />
      </div>

      <div className="buttons-container">
        <Button variant="back" text="Atrás" onClick={() => navigate("/innlab_form")} />
        <Button
          variant="next"
          text={isCreatingAreas ? "Creando áreas..." : "Siguiente"}
          onClick={handleSubmit}
          disabled={isCreatingAreas}
        />
      </div>

      <img className="linea-curva" src="/BgLine-decoration.png" alt="Decoración" />
      <img className="puntos" src="/BgPoints-decoration.png" alt="Decoración" />

      {showAlert && (
        <Alert type={alertType} message={alertMessage} onClose={() => setShowAlert(false)} />
      )}
    </section>
  );
}
