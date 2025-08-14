// utils/calculateScore.js

function calculateScore(categorizedData) {
  const resultadosFinales = {};

  for (const categoria in categorizedData) {
    resultadosFinales[categoria] = {};

    for (const subdimension in categorizedData[categoria]) {
      const { promedio } = categorizedData[categoria][subdimension];

      let nivel, recomendacion;

      if (promedio <= 2) {
        nivel = "Bajo";
        recomendacion = "Revisar procesos y aplicar mejoras urgentes.";
      } else if (promedio <= 3.5) {
        nivel = "Medio";
        recomendacion = "Existen áreas de mejora, se recomienda análisis detallado.";
      } else {
        nivel = "Alto";
        recomendacion = "Buen desempeño, mantener y reforzar prácticas actuales.";
      }

      resultadosFinales[categoria][subdimension] = {
        promedio,
        nivel,
        recomendacion
      };
    }
  }

  return resultadosFinales;
}

module.exports = calculateScore;
