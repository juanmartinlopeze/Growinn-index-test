import { useState } from "react";
import { Form } from "../../components/Form/Form";
import { NextButton } from "../../components/NextButton/next_button";
import { BackButton } from "../../components/BackButton/back-button";
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
    { id: 2, title: "¿Cuántos son los cargos de cada jerarquía 1?", placeholder: "Digite aquí", icon: <img src="/info-circle.png" alt="Jerarquía" />, field: "jerarquia1" },
    { id: 3, title: "¿Cuántos son los cargos de cada jerarquía 2?", placeholder: "Digite aquí", icon: <img src="/info-circle.png" alt="Jerarquía" />, field: "jerarquia2" },
    { id: 4, title: "¿Cuántos son los cargos de cada jerarquía 3?", placeholder: "Digite aquí", icon: <img src="/info-circle.png" alt="Jerarquía" />, field: "jerarquia3" },
    { id: 5, title: "¿Cuántos son los cargos de cada jerarquía 4?", placeholder: "Digite aquí", icon: <img src="/info-circle.png" alt="Jerarquía" />, field: "jerarquia4" },
    { id: 6, title: "¿Cuántas áreas tiene tu empresa?", placeholder: "Digite aquí", icon: null, field: "areas" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:3000/empresas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
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
        alert("Error al enviar el formulario");
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      alert("Error al enviar el formulario");
    }
  };

  return (
    <section className="forms-container">
      <div>
        <Form
          questions={questions}
          onInputChange={handleInputChange}
          formData={formData}
        />
        <div className="buttons-container">
          <BackButton />
          <NextButton text="Siguiente" onClick={handleSubmit} />
        </div>
      </div>
    </section>
  );
}