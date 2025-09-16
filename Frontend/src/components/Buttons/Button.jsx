// src/components/buttons/Button.jsx
import { useNavigate } from "react-router-dom";
import PrincipalButton from "../UiButtons/PrincipalButton";
import ActionButton from "../UiButtons/ActionButton";
import RoleTagButton from "../UiButtons/RoleTagButton";

export const Button = ({
  variant = "default", // 'cancel' | 'delete' | 'submit' | 'next' | 'download' | 'back' | 'ok' | ...
  text,
  to,
  onClick,
  className = "",
  disabled = false,

  // Overrides opcionales
  color, // ej: 'white' | 'orange' | 'n100'
  uiVariant, // 'fill' | 'outline'

  // Control de iconos para ActionButton
  leftIcon, // boolean
  rightIcon, // boolean
  iconLeftType, // 'arrow' | 'download'
  iconRightType, // 'arrow' | 'download'
  arrowDirection = "right", // 'left' | 'right' | 'up' | 'down'

  ...props
}) => {
  const navigate = useNavigate();
  const join = (...xs) => xs.filter(Boolean).join(" ");

  const handleClick = (e) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    if (onClick) onClick(e);
    else if (to) navigate(to);
    else if (variant === "back") navigate(-1);
  };

  // ─────────────────────────────────────────────────────────────
  // 1) Variantes principales → PrincipalButton
  // ─────────────────────────────────────────────────────────────
  if (variant === "cancel" || variant === "delete" || variant === "submit") {
    const map = {
      cancel: { color: "white", uiVariant: "fill", label: "Cancelar" },
      delete: { color: "n100", uiVariant: "fill", label: "Eliminar" },
      submit: { color: "orange", uiVariant: "fill", label: "Guardar" },
    };
    const cfg = map[variant];

    return (
      <div className={join("button-section", className)}>
        <PrincipalButton
          as="button"
          color={color ?? cfg.color}
          variant={uiVariant ?? cfg.uiVariant}
          disabled={disabled}
          onClick={handleClick}
          {...props}
        >
          {text ?? cfg.label}
        </PrincipalButton>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 2) Variantes de acción → ActionButton
  // ─────────────────────────────────────────────────────────────
  if (variant === "next") {
    // Valores por defecto “de diseño” + posibilidad de override
    const cfg = {
      color: color ?? "white",
      uiVariant: uiVariant ?? "fill",
      leftIcon: leftIcon ?? false,
      rightIcon: rightIcon ?? true,
      iconLeftType: iconLeftType ?? "arrow",
      iconRightType: iconRightType ?? "arrow",
      arrowDirection,
      label: text ?? "Siguiente",
    };

    return (
      <div className={join("button-section", className)}>
        <ActionButton
          color={cfg.color}
          variant={cfg.uiVariant}
          leftIcon={cfg.leftIcon}
          rightIcon={cfg.rightIcon}
          iconLeftType={cfg.iconLeftType}
          iconRightType={cfg.iconRightType}
          arrowDirection={cfg.arrowDirection}
          disabled={disabled}
          onClick={handleClick}
          // burbuja derecha negra sólida por defecto (como definimos)
          iconRightScheme={{ color: "black", variant: "fill" }}
          {...props}
        >
          {cfg.label}
        </ActionButton>
      </div>
    );
  }

  if (variant === "download") {
    const cfg = {
      color: color ?? "orange",
      uiVariant: uiVariant ?? "fill",
      leftIcon: leftIcon ?? true,
      rightIcon: rightIcon ?? false,
      iconLeftType: iconLeftType ?? "download",
      iconRightType: iconRightType ?? "arrow",
      arrowDirection,
      label: text ?? "Descargar documento",
    };

    return (
      <div className={join("button-section", className)}>
        <ActionButton
          color={cfg.color}
          variant={cfg.uiVariant}
          leftIcon={cfg.leftIcon}
          rightIcon={cfg.rightIcon}
          iconLeftType={cfg.iconLeftType}
          iconRightType={cfg.iconRightType}
          arrowDirection={cfg.arrowDirection}
          disabled={disabled}
          onClick={handleClick}
          {...props}
        >
          {cfg.label}
        </ActionButton>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 3) Back → RoleTagButton
  // ─────────────────────────────────────────────────────────────
  if (variant === "back") {
    return (
      <div className={join("button-section", className)}>
        <RoleTagButton onClick={handleClick} disabled={disabled} {...props} />
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 4) Fallbacks simples (si los necesitas)
  // ─────────────────────────────────────────────────────────────
  if (variant === "ok") {
    return (
      <div className={join("button-section", className)}>
        <PrincipalButton
          as="button"
          color="white"
          variant="outline"
          disabled={disabled}
          onClick={handleClick}
          {...props}
        >
          {text ?? "Ok"}
        </PrincipalButton>
      </div>
    );
  }

  // default plano
  return (
    <div className={join("button-section", className)}>
      <button
        type="button"
        className="custom-button"
        disabled={disabled}
        onClick={handleClick}
        {...props}
      >
        {text ?? "Button"}
      </button>
    </div>
  );
};
