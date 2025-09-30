import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StepBreadcrumb } from "../../components/StepBreadcrumb/breadcrumb";
import { Button, Description, TitleSection } from "../../components/index";

export function EmailManagement() {
  const navigate = useNavigate();

  const [progress, setProgress] = useState(169);

  const meta = 200;

  function setProgressColor() {
    if (progress < 70) {
      return "text-h1 font-bold text-semantic-error";
    } else if (progress < meta) {
      return "text-h1 font-bold text-extended-yellow";
    } else {
      return "text-h1 font-bold text-semantic-success";
    }
  }

  return (
    <section className="w-full h-full flex flex-col justify-center items-start px-[10%] pt-[10%] gap-5 relative">
      <StepBreadcrumb
        steps={[
          "Jerarquías y cargos",
          "Áreas",
          "Tabla de jerarquías",
          "Resultados",
        ]}
        currentStep={3}
        clickableSteps={[2]}
        onStepClick={(idx) => {
          if (idx === 2) navigate("/datos_prueba");
        }}
      />
      <div className="flex flex-col w-[1125px] items-start gap-[26px]">
        <TitleSection title="Gestión de análisis y respuestas" />
        <div className="flex flex-col items-start gap-[26px] w-full">
          <Description
            variant="forms"
            text="En este apartado podrás consultar el total de encuestas respondidas, reenviar correos a los participantes pendientes y acceder al análisis de resultados para revisar la información obtenida de manera rápida y sencilla."
          />
          <Description
            variant="forms"
            text="En caso de ser necesario puedes reenviar los correos para llegar la meta establecida."
          />
        </div>
      </div>

      <div className="flex justify-around w-full bg-neutral-white shadow-[var(--elevation-3)] rounded-md">
        <div className="flex-1 flex flex-col items-center py-14">
          <h1 className="text-h2 font-medium text-text-primary">Progreso</h1>
          <h1 className={setProgressColor()}>{progress}</h1>
          <h3 className="text-subtitle font-medium text-text-primary">
            Encuestas respondidas
          </h3>
        </div>
        <div className="w-0.5 bg-neutral-200 mx-4 my-14" />
        <div className="flex-1 flex flex-col items-center py-14">
          <h1 className="text-h2 font-medium text-text-primary">Meta</h1>
          <h1 className="text-h1 font-bold text-semantic-success">{meta}</h1>
          <h3 className="text-subtitle font-medium text-text-primary">
            Encuestas respondidas
          </h3>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex w-[1125px] justify-between items-center mt-8">
        <Button
          variant="email"
          text="Reenviar correos"
          onClick={() => console.log("Reenviar correos")}
          className="w-[534px] shrink-0"
        />

        <Button
          variant="analytics"
          text="Analizar resultados"
          onClick={() => console.log("Ver análisis")}
          className="w-[534px] shrink-0"
        />
      </div>

      <section className="navigation-buttons">
        <Button variant="back" to="/upload_page" />
        <Button variant="next" text="Siguiente" to="/validation_page" />
      </section>

      <img className="line-bckg-img" src="/BgLine-decoration2.png" alt="" />
      <img className="line-bckg-img2" src="/BgLine-decoration3.png" alt="" />
      <img className="squares-bckg-img" src="/squaresBckg.png" alt="" />
    </section>
  );
}
