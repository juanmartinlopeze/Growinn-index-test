import React from "react";

/**
 * HeaderTable
 * Props:
 * - label: string
 * - variant: 'left' | 'center' | 'right' (defaults to 'left')
 */
export default function HeaderTable({ label = "", variant = "left" }) {
  const baseClasses = "text-black font-normal";

  if (variant === "center") {
    return (
      <div
        className={`${baseClasses} flex items-center justify-center h-11 px-3 gap-2 flex-shrink-0 bg-neutral-100 border border-neutral-200`}
        style={{
          width: 174,
          borderRadius: 0,
        }}
      >
        <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 14 }}>
          {label}
        </span>
      </div>
    );
  }
  if (variant === "right") {
    // right variant (corner with rounded top-right)
    return (
      <div
        className={`${baseClasses} flex items-center justify-center h-11 px-3 gap-2 flex-shrink-0 bg-neutral-100 border border-neutral-200`}
        style={{
          width: 230,
          borderTopRightRadius: 8,
          borderBottomRightRadius: 0,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
        }}
      >
        <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 14 }}>
          {label}
        </span>
      </div>
    );
  }

  // left variant (corner with rounded top-left)
  return (
    <div
      className={`${baseClasses} flex items-center h-11 px-3 gap-2 flex-shrink-0 bg-neutral-100 border border-neutral-200`}
      style={{
        width: 190,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
      }}
    >
      <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 14 }}>
        {label}
      </span>
    </div>
  );
}
