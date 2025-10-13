import React from "react";

export default function JerarquiaAverage({ percent = 0 }) {
  const pct = Math.max(0, Math.min(100, Math.round(percent)));
  let color = "#EDEDED";
  let border = "#EDEDED";
  let bg = "#FFF";
  if (pct === 0) {
    color = "#9CA3AF";
    border = "#D1D5DB";
    bg = "#F3F4F6";
  } else if (pct <= 30) {
    color = "#EF4444";
    border = "#FCA5A5";
    bg = "#FFF1F2";
  } else if (pct < 100) {
    color = "#F59E0B";
    border = "#FCD34D";
    bg = "#FFFBEB";
  } else {
    color = "#22C55E";
    border = "#86EFAC";
    bg = "#ECFDF5";
  }

  return (
    <div
      style={{
        display: "flex",
        padding: "4px 12px",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        borderRadius: 40,
        border: `1px solid ${border}`,
        background: bg,
        color: color,
        fontFamily: "Plus Jakarta Sans",
        fontSize: 14,
        fontWeight: 400,
      }}
    >
      <span>{pct}%</span>
    </div>
  );
}
