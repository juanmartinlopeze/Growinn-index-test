import React from "react";
import AreaCell from "./AreaCell";
import RoleCell from "./RoleCell";
import BarCell from "./BarCell";
import { TOTAL_TABLE_WIDTH } from "./columnSizes";

export default function TableRowExample({
  areaLabel = "\u00c1rea 1",
  percent = 20,
  // roles: array of 3 items [{ answered, total }, ...]
  roles = null,
}) {
  const r0 = roles && roles[0] ? roles[0] : { answered: 0, total: 0 };
  const r1 = roles && roles[1] ? roles[1] : { answered: 0, total: 0 };
  const r2 = roles && roles[2] ? roles[2] : { answered: 0, total: 0 };

  return (
    <div
      className="inline-flex items-center"
      style={{ width: "100%", gap: 0, alignItems: "stretch" }}
    >
      <AreaCell label={areaLabel} />
      {/* First role with numbers */}
      <RoleCell answered={r0.answered} total={r0.total} />
      <RoleCell answered={r1.answered} total={r1.total} />
      <RoleCell answered={r2.answered} total={r2.total} />
      <BarCell percent={percent} />
    </div>
  );
}
