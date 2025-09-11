import { useNavigate } from "react-router-dom";
import "./Button.css";

export const Button = ({
  variant = "default",
  text,
  to,
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

  // Puedes usar SVG directamente o pasar un componente como icon prop
  const DefaultIcons = {
    back: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M15 18l-6-6 6-6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    next: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M9 6l6 6-6 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    download: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 5v14m0 0l-6-6m6 6l6-6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  };

  const renderContent = () => {
    switch (variant) {
      case "back":
        return (
          <div className="button-flex">
            {icon || DefaultIcons.back}
            {text && <div className="button-label">{text}</div>}
          </div>
        );
      case "next":
        return (
          <div className="button-flex">
            {text && <div className="button-label">{text}</div>}
            {icon || DefaultIcons.next}
          </div>
        );
      case "download":
        return (
          <div className="button-flex">
            {icon || DefaultIcons.download}
            {text && <div className="button-label">{text}</div>}
          </div>
        );
      case "submit":
      case "delete":
      case "cancel":
      case "ok":
        return (
          <div className="button-label">
            {text || {
              submit: "Guardar",
              delete: "Eliminar",
              cancel: "Cancelar",
              ok: "Ok",
            }[variant]}
          </div>
        );
      default:
        return <div className="button-label">{text}</div>;
    }
  };

  const defaultType = variant === "submit" ? "submit" : "button";

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
        return variant;
    }
  })();

  return (
    <div className={joinClasses("button-section", className)}>
      <button
        type={defaultType}
        className={joinClasses("custom-button", variantClass)}
        onClick={handleClick}
        {...props}
      >
        {renderContent()}
      </button>
    </div>
  );
};
