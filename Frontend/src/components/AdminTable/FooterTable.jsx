import React from "react";
import {
  AREA_WIDTH,
  ROLE_WIDTH,
  COMPLETED_WIDTH,
  HEADER_HEIGHT,
  TOTAL_TABLE_WIDTH,
} from "./columnSizes";

export default function FooterTable({
  label = "",
  variant = "left",
  children = null,
}) {
  const baseClasses = "text-black font-normal";

  // shared style
  const commonStyle = (width, borderRadiusLeft, borderRadiusRight) => ({
    flex: `${width} 0 auto`,
    flexBasis: `${(width / TOTAL_TABLE_WIDTH) * 100}%`,
    height: HEADER_HEIGHT,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: borderRadiusLeft,
    borderBottomRightRadius: borderRadiusRight,
  });

  if (variant === "center") {
    return (
      <div
        className={`${baseClasses} flex items-center justify-center h-11 px-3 gap-2 flex-shrink-0 bg-neutral-100 border border-neutral-200`}
        style={commonStyle(ROLE_WIDTH, 0, 0)}
      >
        {children ? (
          children
        ) : (
          <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 14 }}>
            {label}
          </span>
        )}
      </div>
    );
  }

  if (variant === "right") {
    return (
      <div
        className={`${baseClasses} flex items-center justify-center h-11 px-3 gap-2 flex-shrink-0 bg-neutral-100 border border-neutral-200`}
        style={commonStyle(COMPLETED_WIDTH, 0, 8)}
      >
        {children ? (
          children
        ) : (
          <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 14 }}>
            {label}
          </span>
        )}
      </div>
    );
  }

  // left variant
  return (
    <div
      className={`${baseClasses} flex items-center h-11 px-3 gap-2 flex-shrink-0 bg-neutral-100 border border-neutral-200`}
      style={commonStyle(AREA_WIDTH, 8, 0)}
    >
      {children ? (
        children
      ) : (
        <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 14 }}>
          {label}
        </span>
      )}
    </div>
  );
}
