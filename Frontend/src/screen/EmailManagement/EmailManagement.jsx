import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderTable from "../../components/AdminTable/HeaderTable";
import { StepBreadcrumb } from "../../components/StepBreadcrumb/breadcrumb";
import {
  Button,
  Description,
  TitleSection,
  Alert,
} from "../../components/index";

export function EmailManagement() {
  const navigate = useNavigate();

  const [progress, setProgress] = useState(169);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [messageTitle, setMessageTitle] = useState("");

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
          onClick={() => {
            setAlertType("confirmResend");
            setShowAlert(true);
          }}
          className="w-[534px] shrink-0"
        />

        <Button
          variant="analytics"
          text="Analizar resultados"
          onClick={() => {
            setAlertType("confirmAnalysis");
            setShowAlert(true);
          }}
          className="w-[534px] shrink-0"
        />
      </div>

      {/** Toast flotante bottom-right para mensajes */}
      {message && (
        <div
          className="fixed bottom-8 right-8 z-50"
          style={{
            display: "flex",
            width: "386px",
            height: "113px",
            padding: "24px",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: "8px",
            flexShrink: 0,
            borderRadius: "8px",
            border: "1px solid #CCC",
            background: "#FFF",
            boxShadow: "0 4px 8px 0 rgba(0,0,0,0.12)",
          }}
        >
          {messageType === "success" ? (
            <div>
              <h4 className="text-base font-medium text-gray-900 mb-1 text-left">
                {messageTitle || "Correos reenviados"}
              </h4>
              <p className="text-sm text-gray-700 text-left">{message}</p>
            </div>
          ) : (
            <p
              className={`text-sm ${
                messageType === "error"
                  ? "text-semantic-error"
                  : "text-gray-700"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      )}

      {showAlert && (
        <Alert
          type={alertType || "confirmResend"}
          onClose={() => setShowAlert(false)}
          onCancel={() => setShowAlert(false)}
          onConfirm={async () => {
            // manejar confirmaciones por tipo
            if (alertType === "confirmResend") {
              setMessageType("success");
              setMessageTitle("Correos reenviados");
              setMessage(
                "Se han reenviado los correos a 75 participantes pendientes"
              );
            }
            if (alertType === "confirmAnalysis") {
              setMessageType("success");
              setMessageTitle("Análisis iniciado");
              setMessage("Generando reporte de resultados..");
            }
            setShowAlert(false);
            setAlertType(null);
          }}
        />
      )}

      {/* Header strip for the table: left, 3 center, right */}
      <div className="inline-flex items-center mt-8" role="presentation">
        <HeaderTable label="Área" variant="left" />
        <HeaderTable label="J1" variant="center" />
        <HeaderTable label="J2" variant="center" />
        <HeaderTable label="J3" variant="center" />
        <HeaderTable label="Completado" variant="right" />
      </div>

      <img className="line-bckg-img" src="/BgLine-decoration2.png" alt="" />
      <img className="line-bckg-img2" src="/BgLine-decoration3.png" alt="" />
      <img className="squares-bckg-img" src="/squaresBckg.png" alt="" />
    </section>
  );
}
