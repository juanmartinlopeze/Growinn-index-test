import React from "react";
import { Button } from "../index";
import "./Alert.css";

export const Alert = ({
  type = "info",
  title,
  message,
  icon,
  buttons,
  position = "top-center",
  onClose,
  onConfirm,
  onCancel,
  className = "",
  ...props
}) => {
  const presets = {
    complete: {
      title: "Completa todos los campos",
      message:
        "Para continuar asegurate que todos los campos estén correctamente diligenciados.",
      buttons: [
        {
          variant: "ok",
          text: "Ok",
          onClick: onClose || onCancel,
        },
      ],
    },
    error: {
      title: "Error de validación",
      message:
        "La suma de las jerarquías no coincide con el total de empleados.",
      buttons: [
        {
          variant: "ok",
          text: "Cerrar",
          onClick: onClose || onCancel,
        },
      ],
    },
    generalError: {
      title: "Error inesperado",
      message:
        "No pudimos procesar tu formulario. Verifica los campos e inténtalo de nuevo.",
      buttons: [
        {
          variant: "ok",
          text: "Cerrar",
          onClick: onClose,
        },
      ],
    },
    delete: {
      title: "Eliminar el subcargo",
      message: "¿Estás seguro de que quieres eliminar este elemento?",
      buttons: [
        {
          variant: "cancel",
          text: "Cancelar",
          onClick: onCancel || onClose,
        },
        {
          variant: "delete",
          text: "Eliminar",
          onClick: onConfirm || onClose,
        },
      ],
    },
    confirmResend: {
      title: "¿Estás seguro?",
      message:
        "Se reenviarán correos de recordatorio a 75 participantes que aún no han completado la encuesta. Esta acción no se puede deshacer.",
      buttons: [
        {
          variant: "cancel",
          text: "Cancelar",
          onClick: onCancel || onClose,
        },
        {
          // usamos la variante 'submit' (PrincipalButton) para que tenga el mismo diseño que "Guardar"
          variant: "submit",
          text: "Sí, reenviar correos",
          onClick: onConfirm || onClose,
          className: "confirm-resend-button",
        },
      ],
    },
    analysisStarted: {
      title: "Análisis iniciado",
      message: "Generando reporte de resultados..",
      buttons: [
        {
          variant: "ok",
          text: "Ok",
          onClick: onClose || onConfirm,
        },
      ],
    },
    confirmAnalysis: {
      title: "¿Estás seguro?",
      message: "¿Deseas hacer el análisis de los resultados?",
      buttons: [
        {
          variant: "cancel",
          text: "Cancelar",
          onClick: onCancel || onClose,
        },
        {
          variant: "submit",
          text: "Sí, analizar resultados",
          onClick: onConfirm || onClose,
        },
      ],
    },
  };

  const current = presets[type] || {};

  return (
    <div className={`alert-overlay`}>
      <div
        className={`alert alert-${type} alert-position-${position} ${className}`}
        {...props}
      >
        {(icon || current.icon) && (
          <div className="alert-icon">{icon || current.icon}</div>
        )}

        <div className="alert-title">
          <p>{title || current.title}</p>
        </div>
        <div className="alert-message">
          <p>{message || current.message}</p>
        </div>

        <div className="alert-actions">
          {(buttons || current.buttons)?.map((btn, index) => (
            <Button
              key={index}
              variant={btn.variant}
              text={btn.text}
              icon={btn.icon}
              to={btn.to}
              onClick={btn.onClick}
              className={btn.className}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
