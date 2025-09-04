import React from "react";
import "./breadcrumb.css";

/**
 * Componente StepBreadcrumb
 * Props:
 * - steps: array de nombres de los pasos
 * - currentStep: índice del paso actual (0-based)
 * - onStepClick: función opcional para cambiar de paso (solo si el paso es clickeable)
 * - clickableSteps: array de índices de pasos que pueden ser clickeados
 */
export function StepBreadcrumb({
  steps,
  currentStep,
  onStepClick,
  clickableSteps = [],
}) {
  return (
    <nav className="step-breadcrumb">
      <ul>
        {steps.map((step, idx) => {
          const isActive = idx === currentStep;
          const isClickable =
            clickableSteps.includes(idx) && idx !== currentStep;
          const isCompleted = idx < currentStep;

          let className = "breadcrumb-step";
          if (isCompleted) className += " completed";
          if (isActive) className += " active";
          if (isClickable) className += " clickable";

          return (
            <li
              key={step}
              className={className}
              onClick={isClickable ? () => onStepClick(idx) : undefined}
              aria-current={isActive ? "step" : undefined}
            >
              {step}
              {idx < steps.length - 1 && (
                <span className="breadcrumb-separator">&gt;</span>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
