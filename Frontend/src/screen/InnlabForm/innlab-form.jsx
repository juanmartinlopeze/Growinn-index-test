import { useState } from "react";
import { Tooltip, NextButton, BackButton, TitleSection, Form, Subtitle, Description } from '../../components/index';
import { useNavigate } from "react-router-dom"; // Importar useNavigate
import "./innlab-form.css";

export function InnlabForm() {
  const [formData, setFormData] = useState({
    empleados: "",
    jerarquia1: "",
    jerarquia2: "",
    jerarquia3: "",
    jerarquia4: "",
    areas: "",
  });

  const navigate = useNavigate(); // Inicializar useNavigate

  const questions = [
    { id: 1, title: "¿Cuántos empleados tiene tu empresa?", placeholder: "Digite aquí", icon: null, field: "empleados" },
    { id: 2, title: "¿Cuántos empleados hay en la jerarquía 1?", placeholder: "Digite aquí", icon: <Tooltip triggerText={<img src="/info-circle.png" alt="Jerarquía 1" />} popupText="La Jerarquia 1 (Ejecución): realiza tareas operativas esenciales. Ej: Gerente general, CEO, Director(a)" />, field: "jerarquia1" },
    { id: 3, title: "¿Cuántos empleados hay en la jerarquía 2?", placeholder: "Digite aquí", icon: <Tooltip triggerText={<img src="/info-circle.png" alt="Jerarquía 2" />} popupText="La Jerarquia 2 (Supervisión): asegura que las tareas se cumplan según procedimientos y estándares. Ej: Jefes de departamento, líderes de área" />, field: "jerarquia2" },
    { id: 4, title: "¿Cuántos empleados hay en la jerarquía 3?", placeholder: "Digite aquí", icon: <Tooltip triggerText={<img src="/info-circle.png" alt="Jerarquía 3" />} popupText="La Jerarquia 3 (Gerencial): implementa estrategias y toma decisiones a mediano plazo. Ej: Coordinadores, supervisores" />, field: "jerarquia3" },
    { id: 5, title: "¿Cuántos empleados hay en la jerarquía 4?", placeholder: "Digite aquí", icon: <Tooltip triggerText={<img src="/info-circle.png" alt="Jerarquía 4" />} popupText="La Jerarquia 4 (Directivo): define la estrategia general, establece objetivos y asigna recursos. Ej: Operarios, asistentes, cargos operativos" />, field: "jerarquia4" },
    { id: 6, title: "¿Cuántas áreas tiene tu empresa?", placeholder: "Digite aquí", icon: null, field: "areas" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    // Verificar si todos los campos están llenos
    const isFormComplete = Object.values(formData).every((value) => value.trim() !== "");

    if (!isFormComplete) {
      alert("Por favor, completa todos los campos antes de continuar.");
      return; // Detener el envío si hay campos vacíos
    }

    const totalEmpleados = Number(formData.empleados || 0);
    const sumaJerarquias =
      Number(formData.jerarquia1 || 0) +
      Number(formData.jerarquia2 || 0) +
      Number(formData.jerarquia3 || 0) +
      Number(formData.jerarquia4 || 0);

    // Validación de la suma de empleados
    if (sumaJerarquias !== totalEmpleados) {
      alert(
        `La suma de empleados en las jerarquías (${sumaJerarquias}) no coincide con el total de empleados (${totalEmpleados}). Por favor, corrige los valores.`
      );
      return; // Detener el envío si la suma no coincide
    }

    const totalAreas = Number(formData.areas || 0);

    const payload = {
      empleados: totalEmpleados,
      jerarquia1: Number(formData.jerarquia1),
      jerarquia2: Number(formData.jerarquia2),
      jerarquia3: Number(formData.jerarquia3),
      jerarquia4: Number(formData.jerarquia4),
      areas: totalAreas,
      areas_nombres: Array.from({ length: totalAreas }, (_, i) => `Área ${i + 1}`),
    };

    try {
      const response = await fetch("http://localhost:3000/empresas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Formulario enviado exitosamente");
        setFormData({
          empleados: "",
          jerarquia1: "",
          jerarquia2: "",
          jerarquia3: "",
          jerarquia4: "",
          areas: "",
        });
        navigate("/datos_prueba"); // Navegar a la siguiente pantalla solo si todo está correcto
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData);
        alert("Error al enviar el formulario");
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      alert("Error al enviar el formulario");
    }
  };

  return (
    <section className="container">
      <div className="innlab-form-header">
        <div className="jerarquia-header">
          <TitleSection title="Jerarquías y cargos" />
        </div>
        <Subtitle text="¿Por qué pedimos esta información?" />
        <Description
          text="Los datos que solicitamos sobre jerarquías y áreas de la empresa nos permiten comprender cómo se distribuyen las funciones y la toma de decisiones. Esta información es clave para evaluar el nivel de innovación y detectar oportunidades de mejora dentro de la organización."
          variant="forms"
        />
      </div>

      <div className="forms-container">
        <Description
          text="Por favor, ingrese únicamente números sin puntos, comas u otros caracteres especiales."
          variant="forms2"
        />
        <Form
          questions={questions}
          onInputChange={handleInputChange}
          formData={formData}
        />
      </div>

      <div className="buttons-container">
        <BackButton />
        <NextButton text="Siguiente" onClick={handleSubmit} />
      </div>
    </section>
  );
}