import React from "react";

export default function SurveyProgress({ progress, meta, recomendado = 250, setProgressColor }) {
  return (
    <div className="flex justify-around w-full bg-neutral-white shadow-[var(--elevation-3)] rounded-md">
      {/* Progreso */}
      <div className="flex-1 flex flex-col items-center py-14">
        <h1 className="text-h2 font-medium text-text-primary">Progreso</h1>
        <h1 className={setProgressColor()}>{progress}</h1>
        <h3 className="text-subtitle font-medium text-text-primary">
          Encuestas respondidas
        </h3>
      </div>
      <div className="w-0.5 bg-neutral-200 mx-4 my-14" />
      {/* Meta */}
      <div className="flex-1 flex flex-col items-center py-14">
        <h1 className="text-h2 font-medium text-text-primary">Meta</h1>
        <h1 className="text-h1 font-bold text-semantic-success">{meta}</h1>
        <h3 className="text-subtitle font-medium text-text-primary">
          Encuestas respondidas
        </h3>
      </div>
      <div className="w-0.5 bg-neutral-200 mx-4 my-14" />
      {/* Recomendado */}
      <div className="flex-1 flex flex-col items-center py-14">
        <h1 className="text-h2 font-medium text-text-primary">Recomendado</h1>
        <h1 className="text-h1 font-bold text-blue-500">{recomendado}</h1>
        <h3 className="text-subtitle font-medium text-text-primary">
          Encuestas sugeridas
        </h3>
      </div>
    </div>
  );
}
