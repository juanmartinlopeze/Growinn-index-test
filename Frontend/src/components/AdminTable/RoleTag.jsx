import React from "react";

export default function RoleTag({ total = 0, answered = 0 }) {
  return (
    <div
      className="role-tag flex items-center justify-center px-6"
      style={{
        height: 30,
        gap: 8,
        flex: "1 0 0",
        borderRadius: 8,
        background: "#E9683B",
        color: "#FFF",
        textAlign: "center",
      }}
    >
      <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 14 }}>
        {answered}
      </span>
      <div
        style={{ width: 1, height: 23, background: "#FFF", margin: "0 12px" }}
      />
      <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 14 }}>
        {total}
      </span>
    </div>
  );
}
