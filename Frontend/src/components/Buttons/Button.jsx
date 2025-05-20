import { useNavigate } from 'react-router-dom';
import arrowLeft from "../../../public/arrow-left.png";
import nextIcon from "../../../public/next-icon.png";
import './Button.css';

export const Button = ({
    variant = "default",  // Variantes: back | next | download
    text,
    to,                   //Invoca la función navigate
    onClick,
    className = "",
    icon,
    ...props
}) => {
    const navigate = useNavigate();

    const joinClasses = (...classes) => classes.filter(Boolean).join(" ");

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else if (to) {
            navigate(to);
        } else if (variant === "back") {
            navigate(-1);
        }
    };

    const renderContent = () => {
        if (variant === "back") {
            return (
                <div className="button-content" >
                    <span className="button-icon">
                        <img src={icon || arrowLeft} alt="Back Icon" />
                    </span>
                </div>
            );
        }

        if (variant === "next") {
            return (
                <div className="button-content">
                    <span className="button-text">{text}</span>
                    <span className="button-icon">
                        <img src={icon || nextIcon} alt="Next Icon" />
                    </span>
                </div>
            );
        }

        if (variant === "download") {
            return (
                <div className="button-content">
                    <span className="button-icon">
                        <img
                            src={icon || arrowLeft}
                            alt="Download Icon"
                            style={{ transform: "rotate(-90deg)" }}
                        />
                    </span>
                    <span className="button-text">{text}</span>
                </div>
            );
        }

        if (variant === "submit") {
            return <span className="button-text">{text || "Guardar"}</span>;
        }

        if (variant === "delete") {
            return <span className="button-text">{text || "Eliminar"}</span>;
        }

        if (variant === "cancel") {
            return <span className="button-text">{text || "Cancelar"}</span>;
        }

        if (variant === "ok") {
            return <span className="button-text">{text || "Ok"}</span>;
        }

        // Variante por defecto
        return <span className="button-text">{text}</span>;
    };

    // Definir el atributo type dependiendo de la variante: 'submit' para guardar, o 'button' por defecto.
    const defaultType = variant === "submit" ? "submit" : "button";

    // Mapear variantes a clases CSS específicas para los nuevos estilos.
    const variantClass = (() => {
        switch (variant) {
            case "submit":
                return "submit-button";
            case "delete":
                return "delete-button";
            case "cancel":
                return "cancel-button";
            case "ok":
                return "ok-button";
            default:
                return variant; // Usa el mismo nombre de la variante para back, next, download, etc.
        }
    })();

    return (
        <section className={joinClasses("button-section", className)}>
            <button
                className={joinClasses("custom-button", variantClass)}
                onClick={handleClick}
                {...props}
            >
                {renderContent()}
            </button>
        </section>
    );
};
