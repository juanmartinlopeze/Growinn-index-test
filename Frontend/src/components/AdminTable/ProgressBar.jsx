import React from "react";

/**
 * ProgressBar
 * props:
 * - percent: number (0-100)
 */
export default function ProgressBar({ percent = 0 }) {
  const pct = Math.max(0, Math.min(100, Math.round(percent)));

  let fillColor = "#EDEDED"; // gray by default for 0
  if (pct === 0) fillColor = "#EDEDED";
  else if (pct <= 30) fillColor = "#EF4444";
  else if (pct < 100) fillColor = "#F59E0B";
  else fillColor = "#22C55E";

  return (
    <div
      className="progress-wrapper flex items-center gap-2"
      style={{ gap: 10 }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          className="progress-bar-frame"
          style={{
            display: "flex",
            width: 140,
            height: 7,
            alignItems: "center",
            background: "#EDEDED",
            borderRadius: 40,
          }}
        >
          <div
            className="progress-fill"
            style={{
              width: `${pct}%`,
              height: 7,
              borderRadius: 40,
              background: fillColor,
              transition: "width 300ms ease",
            }}
          />
        </div>

        <div style={{ minWidth: 36 }}>
          <span
            style={{
              fontFamily: "Plus Jakarta Sans",
              fontSize: 14,
              fontWeight: 500,
              color: "#000",
            }}
          >
            {pct}%
          </span>
        </div>
      </div>
    </div>
  );
}
