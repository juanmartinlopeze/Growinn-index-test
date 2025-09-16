// src/components/UiButtons/PrincipalButton.jsx
import React from "react";

const BASE = `
  inline-flex items-center justify-center
  px-[var(--padding-md,0.75rem)] py-[var(--padding-sm,0.5rem)]
  gap-[var(--spacing-xs,0.25rem)]
  rounded-[var(--padding-xs,0.25rem)]
  font-['Plus_Jakarta_Sans'] text-[var(--font-size-content-btn,0.875rem)] font-medium leading-normal
  transition-colors
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
  focus-visible:ring-[color:var(--color-primary-n200,#f6c3b1)]
  border
  /* 👇 Estas clases son ESTÁTICAS; solo leen variables */
  bg-[var(--btn-bg)] border-[color:var(--btn-border)] text-[color:var(--btn-text)]
  hover:bg-[var(--btn-bg-hover)] hover:border-[color:var(--btn-border-hover)] hover:text-[color:var(--btn-text-hover)]
  active:bg-[var(--btn-bg-pressed)] active:border-[color:var(--btn-border-pressed)] active:text-[color:var(--btn-text-pressed)]
  disabled:bg-[var(--btn-bg-disabled)] disabled:border-[color:var(--btn-border-disabled)] disabled:text-[color:var(--btn-text-disabled)]
  disabled:opacity-100 disabled:cursor-not-allowed
`;

// Mapa: qué prefijo usar según color/variant
const PREFIX = (color, variant) => `--btn-${color}-${variant}-`;

// Devuelve el objeto style con las 12 CSS vars que lee BASE
function styleFrom(prefix) {
  return {
    // default
    "--btn-bg": `var(${prefix}bg-default)`,
    "--btn-border": `var(${prefix}border-default)`,
    "--btn-text": `var(${prefix}text-default)`,
    // hover
    "--btn-bg-hover": `var(${prefix}bg-hover)`,
    "--btn-border-hover": `var(${prefix}border-hover)`,
    "--btn-text-hover": `var(${prefix}text-hover)`,
    // pressed
    "--btn-bg-pressed": `var(${prefix}bg-pressed)`,
    "--btn-border-pressed": `var(${prefix}border-pressed)`,
    "--btn-text-pressed": `var(${prefix}text-pressed)`,
    // disabled
    "--btn-bg-disabled": `var(${prefix}bg-disabled)`,
    "--btn-border-disabled": `var(${prefix}border-disabled)`,
    "--btn-text-disabled": `var(${prefix}text-disabled)`,
  };
}

export default function PrincipalButton({
  color = "orange", // 'white' | 'n100' | 'orange'
  variant = "fill", // 'fill' | 'outline'
  as = "button",
  className = "",
  disabled = false,
  children = "placeholder-text",
  ...rest
}) {
  const Comp = as;
  const prefix = PREFIX(color, variant);
  const style = styleFrom(prefix);

  return (
    <Comp
      className={`${BASE} ${className}`}
      style={style}
      disabled={as === "button" ? disabled : undefined}
      aria-disabled={as !== "button" ? disabled : undefined}
      {...rest}
    >
      {children}
    </Comp>
  );
}
