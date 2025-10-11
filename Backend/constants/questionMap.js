const questionMap = {
  // Estrategia
  Q1:  { categoria: "Estrategia", subdimension: "Definición" },
  Q12: { categoria: "Estrategia", subdimension: "Enfoque" },
  Q21: { categoria: "Estrategia", subdimension: "Entorno y Prospectiva" },
  Q30: { categoria: "Estrategia", subdimension: "Propósito" },
  Q39: { categoria: "Estrategia", subdimension: "Visión" },

  // Gobernanza
  Q2:  { categoria: "Gobernanza", subdimension: "Organigrama" },
  Q3:  { categoria: "Gobernanza", subdimension: "Organigrama" },
  Q4:  { categoria: "Gobernanza", subdimension: "Organigrama" },
  Q13: { categoria: "Gobernanza", subdimension: "Evaluación de ideas" },
  Q22: { categoria: "Gobernanza", subdimension: "Habilitadores" },
  Q31: { categoria: "Gobernanza", subdimension: "Indicadores" },
  Q40: { categoria: "Gobernanza", subdimension: "Paneles de control" },

  // Colaboración (antes Cultura Organizacional)
  Q5:  { categoria: "Colaboración", subdimension: "Fluidez" },
  Q14: { categoria: "Colaboración", subdimension: "Resultados" },
  Q23: { categoria: "Colaboración", subdimension: "Transparencia" },
  Q32: { categoria: "Colaboración", subdimension: "Interconexión" },
  Q41: { categoria: "Colaboración", subdimension: "Socios externos" },

  // Clima (nueva categoría)
  Q6:  { categoria: "Clima", subdimension: "Creatividad" },
  Q15: { categoria: "Clima", subdimension: "Fallo y Error" },
  Q24: { categoria: "Clima", subdimension: "Franqueza" },
  Q33: { categoria: "Clima", subdimension: "Mentalidad de cambio" },
  Q42: { categoria: "Clima", subdimension: "Toma de riesgos" },

  // Personas
  Q7:  { categoria: "Personas", subdimension: "Conocimiento" },
  Q16: { categoria: "Personas", subdimension: "Diversidad" },
  Q25: { categoria: "Personas", subdimension: "Eventos" },
  Q34: { categoria: "Personas", subdimension: "Formación" },
  Q43: { categoria: "Personas", subdimension: "Reclutamiento" },

  // Liderazgo (nueva categoría)
  Q8:  { categoria: "Liderazgo", subdimension: "Acción" },
  Q17: { categoria: "Liderazgo", subdimension: "Modelo a seguir" },
  Q26: { categoria: "Liderazgo", subdimension: "Narrativas" },
  Q35: { categoria: "Liderazgo", subdimension: "Patrocinio y apoyo" },
  Q44: { categoria: "Liderazgo", subdimension: "Retar" },

  // Procesos
  Q9:  { categoria: "Procesos", subdimension: "Descubrimiento y empatía" },
  Q18: { categoria: "Procesos", subdimension: "Ideación" },
  Q27: { categoria: "Procesos", subdimension: "Evaluación y aprobación" },
  Q36: { categoria: "Procesos", subdimension: "Validaciones y pruebas" },
  Q45: { categoria: "Procesos", subdimension: "Protección i+d" },

  // Recursos (nueva categoría)
  Q10: { categoria: "Recursos", subdimension: "Dinero" },
  Q19: { categoria: "Recursos", subdimension: "Espacios" },
  Q28: { categoria: "Recursos", subdimension: "Expertos" },
  Q37: { categoria: "Recursos", subdimension: "Recompensas" },
  Q46: { categoria: "Recursos", subdimension: "Tecnología" },

  // Resultados
  Q11: { categoria: "Resultados", subdimension: "Exito externo" },
  Q20: { categoria: "Resultados", subdimension: "Éxito financiero" },
  Q29: { categoria: "Resultados", subdimension: "Éxito General" },
  Q38: { categoria: "Resultados", subdimension: "Éxito Personal" },
  Q47: { categoria: "Resultados", subdimension: "Fracasos y cierres" }
};

module.exports = questionMap;
