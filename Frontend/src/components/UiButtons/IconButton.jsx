import React from "react";

const cx = (...xs) => xs.filter(Boolean).join(" ");

const BASE = `
  inline-flex items-center justify-center
  p-[var(--padding-xs,4px)]
  rounded-[var(--radius-lg,24px)]
  transition-colors
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
  focus-visible:ring-[color:var(--color-primary-n200,#f6c3b1)]
  
  /* clases ESTÁTICAS que Tailwind sí compila */
  bg-[var(--btn-bg)] border-[color:var(--btn-border)] text-[color:var(--btn-icon)]
  hover:bg-[var(--btn-bg-hover)] hover:border-[color:var(--btn-border-hover)] hover:text-[color:var(--btn-icon-hover)]
  active:bg-[var(--btn-bg-pressed)] active:border-[color:var(--btn-border-pressed)] active:text-[color:var(--btn-icon-pressed)]
  disabled:bg-[var(--btn-bg-disabled)] disabled:border-[color:var(--btn-border-disabled)] disabled:text-[color:var(--btn-icon-disabled)]
  disabled:opacity-100 disabled:cursor-not-allowed
`;

const SIZES = {
  sm: "h-6 w-6 text-[11px]",
  md: "h-7 w-7 text-[12px]",
  lg: "h-8 w-8 text-[14px]",
};

/** prefijo de tokens */
function varSet(color, variant) {
  return `--iconbtn-${color}-${variant}-`;
}

/** genera el style inline con el mapeo a variables puente */
function inlineVars(prefix) {
  return {
    "--btn-bg": `var(${prefix}bg-default)`,
    "--btn-border": `var(${prefix}border-default)`,
    "--btn-icon": `var(${prefix}icon-default)`,

    "--btn-bg-hover": `var(${prefix}bg-hover)`,
    "--btn-border-hover": `var(${prefix}border-hover)`,
    "--btn-icon-hover": `var(${prefix}icon-hover)`,

    "--btn-bg-pressed": `var(${prefix}bg-pressed)`,
    "--btn-border-pressed": `var(${prefix}border-pressed)`,
    "--btn-icon-pressed": `var(${prefix}icon-pressed)`,

    "--btn-bg-disabled": `var(${prefix}bg-disabled)`,
    "--btn-border-disabled": `var(${prefix}border-disabled)`,
    "--btn-icon-disabled": `var(${prefix}icon-disabled)`,
  };
}

export default function IconButton({
  color = "black",
  variant = "fill",
  size = "md",
  as = "button",
  type = "button",
  className,
  children,
  ariaLabel,
  disabled = false,
  ...rest
}) {
  const Comp = as;
  const prefix = varSet(color, variant);
  const classes = cx(BASE, SIZES[size], className);

  return (
    <Comp
      className={classes}
      style={inlineVars(prefix)}
      type={as === "button" ? type : undefined}
      aria-label={ariaLabel}
      disabled={as === "button" ? disabled : undefined}
      aria-disabled={as !== "button" ? disabled : undefined}
      {...rest}
    >
      {children}
    </Comp>
  );
}
