import { useNavigate } from 'react-router-dom';
import './Button.css';

export const Button = ({
    variant = "default",  // Variantes: back | next | download
    text,
    to,
    onClick,
    className = "",
    icon,
    iconPosition = "left",  // Para el manejo del posicionamiento del icono
    ...props
}) => {
    const navigate = useNavigate();

    const joinClasses = (...classes) => classes.filter(Boolean).join(" ");

    const handleClick = () => {
        if (onClick) onClick();
        if (to) {
            navigate(to);
        }
    };

    const renderContent = () => {
        if (variant === "back") {
            return (
                <div className="button-content">
                    <span className="button-icon">
                        <img src={icon || "/arrow-left.png"} alt="Back Icon" />
                    </span>
                </div>
            );
        }

        if (variant === "next") {
            return (
                <div className="button-content">
                    <span className="button-text">{text}</span>
                    <span className="button-icon">
                        <img src={icon || "/next-icon.png"} alt="Next Icon" />
                    </span>
                </div>
            );
        }

        if (variant === "download") {
            return (
                <div className="button-content">
                    <span className="button-icon">
                        <img
                            src={icon || "/arrow-left.png"}
                            alt="Download Icon"
                            style={{ transform: "rotate(-90deg)" }}
                        />
                    </span>
                    <span className="button-text">{text}</span>
                </div>
            );
        }

        // Variante por defecto
        return <span className="button-text">{text}</span>;
    };

    return (
        <section className={joinClasses("button-section", className)}>
            <button
                className={joinClasses("custom-button", variant)}
                onClick={handleClick}
                {...props}
            >
                {renderContent()}
            </button>
        </section>
    );
};
