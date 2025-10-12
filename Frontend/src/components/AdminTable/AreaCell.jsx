import React from "react";
import { AREA_WIDTH, ROW_HEIGHT } from "./columnSizes";

export default function AreaCell({ label }) {
  return (
    <div
      className="area-cell flex items-center px-3"
      style={{
        width: AREA_WIDTH,
        height: ROW_HEIGHT,
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
