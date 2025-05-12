import React, { useState } from "react";
import { Button } from "../../components/index";
import { useLocation, useNavigate } from "react-router-dom";
import { FormAreas } from "../../components/FormAreas/form_areas";
import { TitleSection, Subtitle, Description } from "../../components/index";
import "./areas_form.css";

export function AreasForm() {
  const location = useLocation();
  const navigate = useNavigate();

  // Recibimos todo el estado enviado desde InnlabForm
  const {
    totalAreas = 0,
    empleados,
    jerarquia1,
    jerarquia2,
    jerarquia3,
    jerarquia4,
  } = location.state || {};

  const [formData, setFormData] = useState({});

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

  const handleSubmit = async () => {
    const nombresAreas = Object.values(formData).map(nombre => nombre.trim());

    if (nombresAreas.some(nombre => nombre === "")) {
      alert("Por favor completa todos los nombres de áreas.");
      return;
    }

    const payload = {
      nombre: "Empresa sin nombre", // puedes reemplazar esto si tienes un nombre real
      cantidad_empleados: Number(empleados),
      jerarquia: 4,
      jerarquia1: Number(jerarquia1),
      jerarquia2: Number(jerarquia2),
      jerarquia3: Number(jerarquia3),
      jerarquia4: Number(jerarquia4),
      areas: nombresAreas,
    };

    try {
      const res = await fetch("http://localhost:3000/empresas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Error:", error);
        alert(error.error || "❌ Error al crear empresa");
        return;
      }

      const data = await res.json();
      console.log("✅ Empresa creada con áreas:", data);

      navigate("/datos_prueba", { state: { empresaId: data.empresa.id } });

    } catch (err) {
      console.error("❌ Error en la petición:", err);
      alert("No se pudo guardar la empresa");
    }
  };

  return (
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
          onClick={() => navigate("/")} // Redirige al home
        />
        <Button variant="next" text="Siguiente" onClick={handleSubmit} />
      </div>

      {/* Imágenes decorativas */}
      <img
        className="linea-curva"
        src="/BgLine-decoration.png"
        alt="Imagen decorativa"
      />
      <img
        className="puntos"
        src="/BgPoints-decoration.png"
        alt="Imagen decorativa"
      />
    </section>
  );
}
