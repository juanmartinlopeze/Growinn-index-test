import React, { useState } from "react";
import { NavBar, Button } from "../../components/index";
import { useLocation, useNavigate } from "react-router-dom";
import { FormAreas } from "../../components/FormAreas/form_areas";
import "./areas_form.css";

export function AreasForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const totalAreas = location.state?.totalAreas || 0; // Recibe el número de áreas desde la pantalla anterior
  const [formData, setFormData] = useState({});

  // Generar dinámicamente las preguntas basadas en el número de áreas
  const questions = Array.from({ length: totalAreas }, (_, i) => ({
    id: i + 1,
    field: `area${i + 1}`,
    title: `¿Cuál es el nombre del área ${i + 1}?`,
    placeholder: "Digite aquí",
  }));

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Nombres de las áreas:", formData);
    // Redirigir a la pantalla DatosPrueba con los nombres de las áreas
    navigate("/datos_prueba", { state: { areas: formData } });
  };

  return (
    <div className="areas-form">
      <h1>Formulario de Áreas</h1>
      <div className="areas-form-container">
        <FormAreas
          questions={questions}
          onInputChange={handleInputChange}
          formData={formData}
        />
      </div>
      <div className="buttons-container">
        <Button variant="next" text="Siguiente" onClick={handleSubmit} />
      </div>
    </div>
  );
}