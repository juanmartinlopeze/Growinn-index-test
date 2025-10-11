// utils/calculateScore.js

function calculateScore(categorizedData) {
  const resultadosFinales = {};

  for (const categoria in categorizedData) {
    resultadosFinales[categoria] = {};
    
    // Variables para calcular promedios de categoría
    const promediosJ1 = [];
    const promediosJ2 = [];
    const promediosJ3 = [];
    const promediosJ4 = [];
    const promediosGenerales = [];

    // Procesar cada subdimensión
    for (const subdimension in categorizedData[categoria]) {
      const subData = categorizedData[categoria][subdimension];
      
      resultadosFinales[categoria][subdimension] = {
        J1: subData.J1,
        J2: subData.J2,
        J3: subData.J3,
        J4: subData.J4,
        promedio_subcategoria: subData.promedio_subcategoria
      };

      // Acumular para promedios de categoría
      if (subData.J1 > 0) promediosJ1.push(subData.J1);
      if (subData.J2 > 0) promediosJ2.push(subData.J2);
      if (subData.J3 > 0) promediosJ3.push(subData.J3);
      if (subData.J4 > 0) promediosJ4.push(subData.J4);
      if (subData.promedio_subcategoria > 0) promediosGenerales.push(subData.promedio_subcategoria);
    }

    // Calcular promedios de categoría
    resultadosFinales[categoria].promedio_categoria_J1 = promediosJ1.length > 0 
      ? promediosJ1.reduce((a, b) => a + b, 0) / promediosJ1.length 
      : 0;
    
    resultadosFinales[categoria].promedio_categoria_J2 = promediosJ2.length > 0 
      ? promediosJ2.reduce((a, b) => a + b, 0) / promediosJ2.length 
      : 0;
    
    resultadosFinales[categoria].promedio_categoria_J3 = promediosJ3.length > 0 
      ? promediosJ3.reduce((a, b) => a + b, 0) / promediosJ3.length 
      : 0;
    
    resultadosFinales[categoria].promedio_categoria_J4 = promediosJ4.length > 0 
      ? promediosJ4.reduce((a, b) => a + b, 0) / promediosJ4.length 
      : 0;

    // Calcular promedio general de la categoría
    resultadosFinales[categoria].promedio_general = promediosGenerales.length > 0 
      ? promediosGenerales.reduce((a, b) => a + b, 0) / promediosGenerales.length 
      : 0;

    // Reorganizar para poner los promedios al inicio
    const { promedio_general, promedio_categoria_J4, promedio_categoria_J3, promedio_categoria_J2, promedio_categoria_J1, ...subdimensiones } = resultadosFinales[categoria];
    
    resultadosFinales[categoria] = {
      promedio_general,
      promedio_categoria_J4,
      promedio_categoria_J3,
      promedio_categoria_J2,
      promedio_categoria_J1,
      ...subdimensiones
    };
  }

  return resultadosFinales;
}

module.exports = calculateScore;
