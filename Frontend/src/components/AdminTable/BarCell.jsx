import React from "react";
import ProgressBar from "./ProgressBar";
import { COMPLETED_WIDTH, ROW_HEIGHT } from "./columnSizes";

export default function BarCell({ percent = 0 }) {
  return (
    <div
      className="bar-cell flex items-center"
      style={{
        width: COMPLETED_WIDTH,
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
