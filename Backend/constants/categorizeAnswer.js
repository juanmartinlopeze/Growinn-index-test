// utils/categorizeResponses.js
const questionMap = require("./questionMap");

function categorizeResponses(responses) {
  const results = {};

  responses.forEach(({ questionId, answer, jerarquia }) => {
    const questionInfo = questionMap[questionId];

    if (!questionInfo) {
      console.warn(`Pregunta ${questionId} no encontrada en questionMap. Todas las claves disponibles:`, Object.keys(questionMap));
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
        J1: { total: 0, count: 0 },
        J2: { total: 0, count: 0 },
        J3: { total: 0, count: 0 },
        J4: { total: 0, count: 0 }
      };
    }

    // Sumamos valores por jerarquía
    if (jerarquia && results[categoria][subdimension][jerarquia]) {
      results[categoria][subdimension][jerarquia].total += answer;
      results[categoria][subdimension][jerarquia].count += 1;
    }
  });

  // Calculamos promedios por jerarquía y subcategoría
  for (const categoria in results) {
    for (const subdimension in results[categoria]) {
      const subData = results[categoria][subdimension];
      
      // Calcular promedios por jerarquía
      ['J1', 'J2', 'J3', 'J4'].forEach(j => {
        if (subData[j].count > 0) {
          subData[j] = subData[j].total / subData[j].count;
        } else {
          subData[j] = 0;
        }
      });

      // Calcular promedio de la subcategoría
      const validPromedios = ['J1', 'J2', 'J3', 'J4']
        .map(j => subData[j])
        .filter(promedio => promedio > 0);
      
      subData.promedio_subcategoria = validPromedios.length > 0 
        ? validPromedios.reduce((a, b) => a + b, 0) / validPromedios.length 
        : 0;
    }
  }

  return results;
}

module.exports = categorizeResponses;