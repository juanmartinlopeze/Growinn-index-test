import React from "react";
import AreaCell from "./AreaCell";
import RoleCell from "./RoleCell";
import BarCell from "./BarCell";
import { TOTAL_TABLE_WIDTH } from "./columnSizes";

export default function TableRowExample({
  areaLabel = "Área 1",
  percent = 20,
}) {
  return (
    <div
      className="inline-flex items-center"
      style={{
        width: TOTAL_TABLE_WIDTH,
        gap: 0,
      }}
    >
      <AreaCell label={areaLabel} />
      {/* First role with numbers */}
      <RoleCell answered={10} total={50} />
      {/* Empty roles (placeholder) */}
      <RoleCell answered={0} total={0} />
      <RoleCell answered={0} total={0} />
      <BarCell percent={percent} />
    </div>
  );
}
