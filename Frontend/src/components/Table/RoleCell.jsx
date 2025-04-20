import React from 'react';

export default function RoleCell({ role, areaName, onClick }) {
  return role.position ? (
    <span onClick={() => onClick(areaName, role.hierarchy)}>
      <p className="role-name">{role.position}</p> | <p>{role.employees}</p>
    </span>
  ) : (
    <button onClick={() => onClick(areaName, role.hierarchy)}>+</button>
  );
}
