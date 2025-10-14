// src/ui/buttons/ActionButton.jsx
import React from "react";
import IconButton from "./IconButton";

const cx = (...xs) => xs.filter(Boolean).join(" ");

/* Base visual del contenedor (tamaños/espaciados, tipografía, etc.) */
const BASE = `
  inline-flex items-center justify-center
  px-[var(--padding-xxl,12px)] py-[var(--padding-md,5px)]
  gap-[var(--spacing-sm,6px)]
  rounded-[var(--radius-lg,20px)]
  font-['Plus_Jakarta_Sans'] text-[var(--font-size-content-btn,0.75rem)] font-medium leading-normal
  transition-colors
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
  focus-visible:ring-[color:var(--color-primary-n200,#f6c3b1)]
  border

  /* Tokens aplicados (colores) */
  bg-[var(--btn-bg)]
  border-[var(--btn-border)]
  text-[var(--btn-text)]

  hover:bg-[var(--btn-bg-hover)]
  hover:border-[var(--btn-border-hover)]
  hover:text-[var(--btn-text-hover)]

  active:bg-[var(--btn-bg-pressed)]
  active:border-[var(--btn-border-pressed)]
  active:text-[var(--btn-text-pressed)]

  disabled:bg-[var(--btn-bg-disabled)]
  disabled:border-[var(--btn-border-disabled)]
  disabled:text-[var(--btn-text-disabled)]
  disabled:opacity-100
  disabled:cursor-not-allowed
`;

/* Prefijo de tokens para el contenedor */
function varSet(color, variant) {
  // 'white' | 'n100' | 'orange'  +  'fill' | 'outline'
  return `--btn-${color}-${variant}-`;
}

/* Mapea los tokens del set al runtime (para que Tailwind no purgue clases) */
function inlineVars(prefix) {
  return {
    "--btn-bg": `var(${prefix}bg-default)`,
    "--btn-border": `var(${prefix}border-default)`,
    "--btn-text": `var(${prefix}text-default)`,

    "--btn-bg-hover": `var(${prefix}bg-hover)`,
    "--btn-border-hover": `var(${prefix}border-hover)`,
    "--btn-text-hover": `var(${prefix}text-hover)`,

    "--btn-bg-pressed": `var(${prefix}bg-pressed)`,
    "--btn-border-pressed": `var(${prefix}border-pressed)`,
    "--btn-text-pressed": `var(${prefix}text-pressed)`,

    "--btn-bg-disabled": `var(${prefix}bg-disabled)`,
    "--btn-border-disabled": `var(${prefix}border-disabled)`,
    "--btn-text-disabled": `var(${prefix}text-disabled)`,
  };
}

/* Flecha sólida (tu SVG de Figma). Usa currentColor y se rota por dir. */
const Arrow = ({ dir = "right", size = 18 }) => {
  const rot = { left: 0, up: 90, right: 180, down: -90 }[dir] ?? 0;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      style={{ transform: `rotate(${rot}deg)` }}
    >
      <path
        d="M5.21663 8.66663L8.94996 12.4L7.99996 13.3333L2.66663 7.99996L7.99996 2.66663L8.94996 3.59996L5.21663 7.33329H13.3333V8.66663H5.21663Z"
        fill="currentColor"
      />
    </svg>
  );
};

const Download = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 5v10m0 0l-4-4m4 4 4-4M5 19h14"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Mail = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <polyline
      points="22,6 12,13 2,6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Analytics = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M3 3v18h18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m19 9-5 5-4-4-3 3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Esquema de burbujas por defecto (según color/variant del contenedor) */
function defaultIconSchemeFor(btnColor, btnVariant) {
  if (btnColor === "white") return { color: "black", variant: "fill" };
  if (btnColor === "orange" && btnVariant === "fill")
    return { color: "orange-reverse", variant: "fill" };
  if (btnColor === "orange" && btnVariant === "outline")
    return { color: "orange", variant: "outline" };
  return { color: "black", variant: "fill" };
}

export default function ActionButton({
  color = "white",
  variant = "fill",
  as = "button",
  className,
  children = "placeholder-text",
  disabled = false,

  // control de iconos
  leftIcon = false,
  rightIcon = false,
  iconLeftType = "arrow", // 'arrow' | 'download' | 'mail' | 'analytics'
  iconRightType = "arrow", // 'arrow' | 'download' | 'mail' | 'analytics'
  arrowDirection = "right", // 'left' | 'right' | 'up' | 'down'

  // overrides opcionales para el esquema de los bubbles
  iconLeftScheme,
  iconRightScheme,

  ...rest
}) {
  const Comp = as;
  const prefix = varSet(color, variant);
  const classes = cx(BASE, className);

  const leftSch = iconLeftScheme || defaultIconSchemeFor(color, variant);
  const rightSch = iconRightScheme || defaultIconSchemeFor(color, variant);

  return (
    <Comp
      className={classes}
      style={inlineVars(prefix)}
      disabled={as === "button" ? disabled : undefined}
      aria-disabled={as !== "button" ? disabled : undefined}
      {...rest}
    >
      {leftIcon && (
        <IconButton
          as="span"
          color={leftSch.color}
          variant={leftSch.variant}
          size="md"
          ariaLabel="left icon"
          className="shrink-0"
          disabled={disabled}
        >
          {iconLeftType === "download" ? (
            <Download />
          ) : iconLeftType === "mail" ? (
            <Mail />
          ) : iconLeftType === "analytics" ? (
            <Analytics />
          ) : (
            <Arrow dir={arrowDirection} />
          )}
        </IconButton>
      )}

      {children && (
        <span
          className="
            leading-none
            text-[color:var(--btn-text)]
            hover:text-[color:var(--btn-text-hover)]
            active:text-[color:var(--btn-text-pressed)]
            disabled:text-[color:var(--btn-text-disabled)]
          "
        >
          {children}
        </span>
      )}

      {rightIcon && (
        <IconButton
          as="span"
          color={rightSch.color}
          variant={rightSch.variant}
          size="md"
          ariaLabel="right icon"
          className="shrink-0"
          disabled={disabled}
        >
          {iconRightType === "download" ? (
            <Download />
          ) : iconRightType === "mail" ? (
            <Mail />
          ) : iconRightType === "analytics" ? (
            <Analytics />
          ) : (
            <Arrow dir={arrowDirection} />
          )}
        </IconButton>
      )}
    </Comp>
  );
}
