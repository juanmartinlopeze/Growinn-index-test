import React from "react";
import { AREA_WIDTH, ROW_HEIGHT, TOTAL_TABLE_WIDTH } from "./columnSizes";

export default function AreaCell({ label }) {
  return (
    <div
      className="area-cell flex items-center px-3"
      style={{
        flex: `${AREA_WIDTH} 0 auto`,
        // provide a proportional basis so the cell scales when container shrinks
        flexBasis: `${(AREA_WIDTH / TOTAL_TABLE_WIDTH) * 100}%`,
        height: ROW_HEIGHT,
        border: "1px solid #E5E7EB",
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
