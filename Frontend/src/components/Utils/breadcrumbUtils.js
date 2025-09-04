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
