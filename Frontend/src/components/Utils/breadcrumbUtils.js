// Utilidades para guardar y cargar el progreso en localStorage

export function saveStepData(stepKey, data) {
  const progress = JSON.parse(localStorage.getItem("growinn-progress") || "{}");
  progress[stepKey] = data;
  localStorage.setItem("growinn-progress", JSON.stringify(progress));
}

export function loadStepData(stepKey) {
  const progress = JSON.parse(localStorage.getItem("growinn-progress") || "{}");
  return progress[stepKey] || null;
}

export function loadAllProgress() {
  return JSON.parse(localStorage.getItem("growinn-progress") || "{}");
}

export function clearProgress() {
  localStorage.removeItem("growinn-progress");
}

// Función para debugging - exponer en window
export function debugClearAll() {
  console.log('🧹 Limpiando todo el localStorage de Growinn...');
  localStorage.removeItem("growinn-progress");
  console.log('✅ localStorage limpiado. Recarga la página para ver cambios.');
}

// Exponer para debugging en consola del navegador
if (typeof window !== 'undefined') {
  window.clearGrowinnData = debugClearAll;
  console.log('💡 Tip: Si la tabla tiene datos corruptos, ejecuta: clearGrowinnData()');
}
