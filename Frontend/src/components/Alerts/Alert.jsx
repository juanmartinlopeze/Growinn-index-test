import React from "react";
import { Button } from "../index";
import "./Alert.css";

// Icons de ejemplo (reemplaza con los tuyos)
// import successIcon from "/public/success-icon.svg";
// import warningIcon from "/public/warning-icon.svg";
// import errorIcon from "/public/error-icon.svg";
// import infoIcon from "/public/info-icon.svg";

export const Alert = ({
    type = "info",
    title,
    message,
    icon,
    buttons,
    position = "top-center",
    onClose,
    className = "",
    ...props
}) => {

    const presets = {
        success: {
            title: "Completa todos los campos",
            message: "Para continuar asegurate que todos los campos estén correctamente diligenciados.",
            // icon: <img src={successIcon} alt="Éxito" />,
            buttons: [
                {
                    variant: "ok",
                    text: "",
                    onClick: onClose,
                }
            ]
        },
        error: {
            title: "¡Error!",
            message: "Ocurrió un problema inesperado.",
            // icon: <img src={errorIcon} alt="Error" />,
            buttons: [
                {
                    variant: "cancel",
                    text: "Cerrar",
                    onClick: onClose
                }
            ]
        },
        warning: {
            title: "Advertencia",
            message: "Revisa esta información antes de continuar.",
            // icon: <img src={warningIcon} alt="Advertencia" />,
            buttons: [
                {
                    variant: "cancel",
                    text: "Entendido",
                    onClick: onClose
                }
            ]
        },
        info: {
            title: "Información",
            message: "Este es un mensaje informativo.",
            // icon: <img src={infoIcon} alt="Información" />,
            buttons: [
                {
                    variant: "default",
                    text: "OK",
                    onClick: onClose
                }
            ]
        }
    };

    // Usa props o presets si no vienen definidas
    const current = presets[type] || {};

    return (
        <div className={`alert alert-${type} alert-position-${position} ${className}`} {...props}>
            {(icon || current.icon) && (
                <div className="alert-icon">
                    {icon || current.icon}
                </div>
            )}

            <div className="alert-title"><p>{title || current.title}</p></div>
            <div className="alert-message"><p>{message || current.message}</p></div>

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
    );
};
