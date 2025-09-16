// src/ui/buttons/RoleTagButton.jsx
import React from "react";

export default function RoleTagButton({ children, className = "", ...props }) {
  return (
    <button
      className={`
        flex items-center justify-center gap-[10px]
        px-[var(--padding-md,12px)] py-[var(--padding-md,12px)]
        rounded-[var(--radius-xl,40px)]
        border
        text-black
        bg-white border-[#CCC]

        hover:bg-[#F5F5F5] hover:border-[#999] hover:text-black
        active:bg-[#E0E0E0] active:border-[#666] active:text-black
        disabled:bg-white disabled:border-[#EEE] disabled:text-[#AAA] disabled:cursor-not-allowed

        transition-colors
        ${className}
      `}
      {...props}
    >
      {/* Icono SVG (hereda color con currentColor) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 25 24"
        fill="none"
      >
        <path
          d="M8.325 13L13.925 18.6L12.5 20L4.5 12L12.5 4L13.925 5.4L8.325 11H20.5V13H8.325Z"
          fill="currentColor"
        />
      </svg>

      {children && (
        <span className="text-[14px] font-medium leading-none">{children}</span>
      )}
    </button>
  );
}
