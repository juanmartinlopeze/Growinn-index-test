import React from "react";
import ProgressBar from "./ProgressBar";
import { COMPLETED_WIDTH, ROW_HEIGHT, TOTAL_TABLE_WIDTH } from "./columnSizes";

export default function BarCell({ percent = 0 }) {
  return (
    <div
      className="bar-cell flex items-center"
      style={{
        flex: `${COMPLETED_WIDTH} 0 auto`,
        flexBasis: `${(COMPLETED_WIDTH / TOTAL_TABLE_WIDTH) * 100}%`,
        height: ROW_HEIGHT,
        padding: 12,
        gap: 10,
        flexShrink: 0,
        border: "1px solid #E5E7EB",
        background: "#FFF",
        boxSizing: "border-box",
      }}
    >
      <ProgressBar percent={percent} />
    </div>
  );
}
