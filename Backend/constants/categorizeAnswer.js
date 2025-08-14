// utils/categorizeResponses.js
const questionMap = require("./questionMap");

function categorizeResponses(responses) {
  const results = {};

  responses.forEach(({ questionId, answer }) => {
    const questionInfo = questionMap[questionId];

    if (!questionInfo) {
      console.warn(`Pregunta ${questionId} no encontrada en questionMap`);
      return;
    }

    const { categoria, subdimension } = questionInfo;

    // Si no existe la categoría, la creamos
    if (!results[categoria]) {
      results[categoria] = {};
    }

    // Si no existe la subdimensión, la creamos
    if (!results[categoria][subdimension]) {
      results[categoria][subdimension] = {
        total: 0,
        count: 0,
        promedio: 0
      };
    }

    // Sumamos valores
    results[categoria][subdimension].total += answer;
    results[categoria][subdimension].count += 1;
  });

  // Calculamos promedios
  for (const categoria in results) {
    for (const subdimension in results[categoria]) {
      const data = results[categoria][subdimension];
      data.promedio = data.total / data.count;
    }
  }

  return results;
}

module.exports = categorizeResponses;
