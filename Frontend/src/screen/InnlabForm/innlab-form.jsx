import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  Description,
  Form,
  Subtitle,
  TitleSection,
  Tooltip,
} from "../../components/index";
import "./innlab-form.css";
import { StepBreadcrumb } from "../../components/StepBreadcrumb/breadcrumb";
import {
  saveStepData,
  loadStepData,
} from "../../components/Utils/breadcrumbUtils";
import { createEmpresa } from "../../lib/api";

export function InnlabForm() {
  const navigate = useNavigate();

  // Estado inicial sin localStorage
  const [formData, setFormData] = useState(() => {
    const saved = loadStepData("step1");
    return (
      saved || {
        empleados: "",
        jerarquia1: "",
        jerarquia2: "",
        jerarquia3: "",
        jerarquia4: "",
        areas: "",
      }
    );
  });

  useEffect(() => {
    saveStepData("step1", formData);
  }, [formData]);

  // estados para mostrar el tipo de alerta
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("complete");
  const [alertMessage, setAlertMessage] = useState("");
  const [isCreatingEmpresa, setIsCreatingEmpresa] = useState(false);

  const questions = [
    {
      id: 1,
      title: (
        <>
          ¿Cuántos <span className="text-questions-medium">empleados</span>{" "}
          tiene tu empresa?
        </>
      ),
      placeholder: "Digite aquí",
      icon: null,
      field: "empleados",
    },
    {
      id: 2,
      title: (
        <>
          ¿Cuántas <span className="text-questions-medium">áreas</span> tiene tu
          empresa?
        </>
      ),
      placeholder: "Digite aquí",
      icon: null,
      field: "areas",
    },
    {
      id: 3,
      title: (
        <>
          ¿Cuántos empleados hay en la{" "}
          <span style={{ fontWeight: 500 }}>jerarquía 1?</span>
        </>
      ),
      placeholder: "Digite aquí",
      icon: (
        <Tooltip
          triggerText={<img src="/info-fill.png" alt="Jerarquía 1" />}
          popupText={
            <>
              <strong>La Jerarquía 1 (Ejecución)</strong>: es el nivel operativo
              que se encarga de ejecutar las tareas básicas y esenciales dentro
              de la organización asegurando el funcionamiento diario.
              <br />
              <br />
              <strong>Ejemplo:</strong> Operarios, auxiliares, agentes de
              soporte.
            </>
          }
        />
      ),
      field: "jerarquia1",
    },
    {
      id: 4,
      title: (
        <>
          ¿Cuántos empleados hay en la{" "}
          <span style={{ fontWeight: 500 }}>jerarquía 2?</span>
        </>
      ),
      placeholder: "Digite aquí",
      icon: (
        <Tooltip
          triggerText={<img src="/info-fill.png" alt="Jerarquía 2" />}
          popupText={
            <>
              <strong>La Jerarquía 2 (Supervisión)</strong>: coordina al
              personal operativo y supervisa el cumplimiento de tareas según
              procedimientos establecidos, asegurando la calidad del trabajo
              diario.
              <br />
              <br />
              <strong>Ejemplo:</strong> Supervisores de línea, jefes de turno.
            </>
          }
        />
      ),
      field: "jerarquia2",
    },
    {
      id: 5,
      title: (
        <>
          ¿Cuántos empleados hay en la{" "}
          <span style={{ fontWeight: 500 }}>jerarquía 3?</span>
        </>
      ),
      placeholder: "Digite aquí",
      icon: (
        <Tooltip
          triggerText={<img src="/info-fill.png" alt="Jerarquía 3" />}
          popupText={
            <>
              <strong>La Jerarquía 3 (Gerencial)</strong>: lidera equipos y
              proyectos, define planes tácticos y toma decisiones enfocadas en
              el logro de objetivos a mediano plazo.
              <br />
              <br />
              <strong>Ejemplo:</strong> Gerentes de área, líderes de proyecto.
            </>
          }
        />
      ),
      field: "jerarquia3",
    },
    {
      id: 6,
      title: (
        <>
          ¿Cuántos empleados hay en la{" "}
          <span style={{ fontWeight: 500 }}>jerarquía 4?</span>
        </>
      ),
      placeholder: "Digite aquí",
      icon: (
        <Tooltip
          triggerText={<img src="/info-fill.png" alt="Jerarquía 4" />}
          popupText={
            <>
              <strong>La Jerarquía 4 (Directivo)</strong>: establece la visión
              organizacional, toma decisiones estratégicas y asigna recursos
              clave para el crecimiento y sostenibilidad de la empresa.
              <br />
              <br />
              <strong>Ejemplo:</strong> CEO, director general, alta dirección.
            </>
          }
        />
      ),
      field: "jerarquia4",
    },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    const isFormComplete = Object.values(formData).every((val) => {
      const s = val === null || val === undefined ? "" : String(val);
      return s.trim() !== "";
    });

    if (!isFormComplete) {
      setAlertType("complete");
      setAlertMessage(
        "Por favor, completa todos los campos antes de continuar."
      );
      setShowAlert(true);
      return;
    }

    const totalEmpleados = Number(formData.empleados);
    const sumaJerarquias =
      Number(formData.jerarquia1) +
      Number(formData.jerarquia2) +
      Number(formData.jerarquia3) +
      Number(formData.jerarquia4);

    if (sumaJerarquias !== totalEmpleados) {
      setAlertType("error");
      setAlertMessage(
        `La suma de las jerarquías (${sumaJerarquias}) no coincide con el total de empleados (${totalEmpleados}).`
      );
      setShowAlert(true);
      return;
    }

    try {
      setIsCreatingEmpresa(true);

      // Create or update empresa in Supabase
      const empresaCreada = await createEmpresa(formData);
      
      // 💾 Guardar datos completos en localStorage incluyendo el ID
      const empresaDataConId = {
        ...formData,
        id: empresaCreada.id,
        empresa_id: empresaCreada.id
      };
      saveStepData("step1", empresaDataConId);
      
      const totalAreas = Number(formData.areas);

      // Navegar con empresa_id real
      navigate("/areas_form", {
        state: {
          totalAreas,
          empleados: formData.empleados,
          jerarquia1: formData.jerarquia1,
          jerarquia2: formData.jerarquia2,
          jerarquia3: formData.jerarquia3,
          jerarquia4: formData.jerarquia4,
          empresa_id: empresaCreada.id
        },
      });
      
    } catch (error) {
      console.error("Error guardando empresa:", error);
      setAlertType("error");
      setAlertMessage("Error guardando la empresa. Por favor, intenta de nuevo.");
      setShowAlert(true);
    } finally {
      setIsCreatingEmpresa(false);
    }
  };

  return (
    <section className="container">
      <StepBreadcrumb steps={["Jerarquías y cargos"]} currentStep={0} />
      <div className="innlab-form-header">
        <TitleSection title="Jerarquías y áreas" />
        <div className="description-header">
          <div className="description-subtitle">
            <Subtitle text="¿Por qué pedimos esta información?" />
            <Description
              text="Los datos que solicitamos sobre jerarquías y áreas de la empresa nos permiten comprender cómo se distribuyen las funciones y la toma de decisiones. Esta información es clave para evaluar el nivel de innovación y detectar oportunidades de mejora dentro de la organización."
              variant="forms"
            />
          </div>
          <Description
            text="Por favor, ingrese únicamente números sin puntos, comas u otros caracteres especiales."
            variant="forms"
            className="description-bottom-space"
          />
        </div>
      </div>

      <div className="form-section">
        <div className="form-section-divider">
          <Subtitle text="Información general" />
          <hr />
        </div>
        <Form
          questions={questions.slice(0, 2)}
          onInputChange={handleInputChange}
          formData={formData}
        />
      </div>

      <div className="form-section">
        <div className="form-section-divider">
          <Subtitle text="Jerarquías" />
          <hr />
        </div>
        <Form
          questions={questions.slice(2)}
          onInputChange={handleInputChange}
          formData={formData}
        />
      </div>

      <div className="buttons-container">
        <Button variant="back" onClick={() => navigate(-1)} disabled={isCreatingEmpresa} />
        <Button 
          variant="next" 
          text={isCreatingEmpresa ? "Creando empresa..." : "Siguiente"} 
          onClick={handleSubmit} 
          disabled={isCreatingEmpresa}
        />
      </div>

      <img
        className="linea-curva"
        src="/BgLine-decoration.png"
        alt="Imagen decorativa"
      />
      <img
        className="puntos"
        src="/BgPoints-decoration.png"
        alt="imagen decorativa"
      />

      {showAlert && (
        <Alert
          type={alertType}
          message={alertMessage}
          onClose={() => setShowAlert(false)}
        />
      )}
    </section>
  );
}