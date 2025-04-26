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
