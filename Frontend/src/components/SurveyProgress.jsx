function calcularMeta({ N, e = 0.05, z = 1.96, p = 0.5 }) {
  if (!N || N <= 0) return '-';
  const num = Math.pow(z, 2) * p * (1 - p);
  const den = Math.pow(e, 2);
  const n0 = num / den;
  const n = n0 / (1 + (n0 - 1) / N);
  return Math.ceil(n);
}

export default function SurveyProgress({ total, progreso }) {
  const meta = calcularMeta({ N: total });
  return (
    <div className="flex justify-around w-full bg-neutral-white shadow-[var(--elevation-3)] rounded-md">
      {/* Total */}
      <div className="flex-1 flex flex-col items-center py-10">
        <h1 className="text-h2 font-medium text-text-primary">Total</h1>
        <h1 className="text-[48px] font-bold text-gray-900">{total ?? '-'}</h1>
        <h3 className="text-base font-normal text-gray-600 text-center mt-2">
          Participantes activos<br />actualmente
        </h3>
      </div>
      <div className="w-0.5 bg-neutral-200 mx-4 my-10" />
      {/* Progreso */}
      <div className="flex-1 flex flex-col items-center py-10">
        <h1 className="text-h2 font-medium text-text-primary">Progreso</h1>
        <h1 className="text-[48px] font-bold text-red-500">{progreso ?? '-'}</h1>
        <h3 className="text-base font-normal text-gray-600 text-center mt-2">
          Número de encuestas<br />completadas
        </h3>
      </div>
      <div className="w-0.5 bg-neutral-200 mx-4 my-10" />
      {/* Meta */}
      <div className="flex-1 flex flex-col items-center py-10">
        <h1 className="text-h2 font-medium text-text-primary">Meta</h1>
        <h1 className="text-[48px] font-bold text-green-500">{meta}</h1>
        <h3 className="text-base font-normal text-gray-600 text-center mt-2">
          Cantidad mínima<br />recomendada
        </h3>
      </div>
    </div>
  );
}
