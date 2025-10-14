import React from "react";
import RoleTag from "./RoleTag";
import { ROLE_WIDTH, ROW_HEIGHT } from "./columnSizes";

export default function RoleCell({ total = 0, answered = 0 }) {
  return (
    <div
      className="role-cell flex items-center justify-center"
      style={{
        width: ROLE_WIDTH,
        height: ROW_HEIGHT,
        padding: 12,
        gap: 10,
        flexShrink: 0,
        border: "1px solid #E5E7EB",
        background: "#FFF",
        boxSizing: "border-box",
      }}
    >
      <RoleTag total={total} answered={answered} />
    </div>
  );
}
