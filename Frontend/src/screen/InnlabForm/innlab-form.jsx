import { useState } from "react";
import { Tooltip, NextButton, BackButton, TitleSection, Form } from '../../components/index';
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

  const questions = [
    { id: 1, title: "¿Cuántos empleados tiene tu empresa?", placeholder: "Digite aquí", icon: null, field: "empleados" },
    { id: 2, title: "¿Cuántos son los cargos de cada jerarquía 1?", placeholder: "Digite aquí", icon: <Tooltip triggerText={<img src="/info-circle.png" alt="Jerarquía 1" />} popupText="La Jerarquia 1 (Ejecución): realiza tareas operativas esenciales. Ej: Gerente general, CEO, Director(a)" />, field: "jerarquia1" },
    { id: 3, title: "¿Cuántos son los cargos de cada jerarquía 2?", placeholder: "Digite aquí", icon: <Tooltip triggerText={<img src="/info-circle.png" alt="Jerarquía 2" />} popupText="La Jerarquia 2 (Supervisión): asegura que las tareas se cumplan según procedimientos y estándares. Ej: Jefes de departamento, líderes de área" />, field: "jerarquia2" },
    { id: 4, title: "¿Cuántos son los cargos de cada jerarquía 3?", placeholder: "Digite aquí", icon: <Tooltip triggerText={<img src="/info-circle.png" alt="Jerarquía 3" />} popupText="La Jerarquia 3 (Gerencial): implementa estrategias y toma decisiones a mediano plazo. Ej: Coordinadores, supervisores" />, field: "jerarquia3" },
    { id: 5, title: "¿Cuántos son los cargos de cada jerarquía 4?", placeholder: "Digite aquí", icon: <Tooltip triggerText={<img src="/info-circle.png" alt="Jerarquía 4" />} popupText="La Jerarquia 4 (Directivo): define la estrategia general, establece objetivos y asigna recursos. Ej: Operarios, asistentes, cargos operativos" />, field: "jerarquia4" },
    { id: 6, title: "¿Cuántas áreas tiene tu empresa?", placeholder: "Digite aquí", icon: null, field: "areas" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    const totalAreas = Number(formData.areas || 0);

    const payload = {
      empleados: Number(formData.empleados),
      jerarquia1: Number(formData.jerarquia1),
      jerarquia2: Number(formData.jerarquia2),
      jerarquia3: Number(formData.jerarquia3),
      jerarquia4: Number(formData.jerarquia4),
      areas: totalAreas,
      areas_nombres: Array.from({ length: totalAreas }, (_, i) => `Área ${i + 1}`)
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
      <TitleSection title="Jerarquías y cargos" />
      <div>
        <Form
          questions={questions}
          onInputChange={handleInputChange}
          formData={formData}
        />
        <div className="buttons-container">
          <BackButton />
          <NextButton text="Siguiente" to="/datos_prueba" onClick={handleSubmit} />
        </div>
      </div>
    </section>
  );
}