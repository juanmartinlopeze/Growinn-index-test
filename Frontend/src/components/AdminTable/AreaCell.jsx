import React from "react";

export default function AreaCell({ label }) {
  return (
    <div
      className="area-cell flex items-center px-3"
      style={{
        width: 189,
        height: 61,
        gap: 10,
        border: "1px solid #CCC",
        background: "#FFF",
        color: "#000",
        boxSizing: "border-box",
      }}
    >
      <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 14 }}>
        {label}
      </span>
    </div>
  );
}
