// Archivo: utils/addArea.js

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');

export async function handleAddArea(areas, setAreas, empresaId, showAlert) {
  try {
    const nombre = `Área ${areas.length + 1}`

    // 1. Crear el área en Supabase
    const res = await fetch(`${BASE_URL}/areas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre,
        empresa_id: empresaId
      })
    });

    const nuevaArea = await res.json();

    if (!res.ok) throw new Error(nuevaArea.error || 'Error creando área');

    // 2. Actualizar frontend
    setAreas(prev => [...prev, nuevaArea]);

    if (showAlert) {
      showAlert({
        type: 'complete',
        title: 'Área creada',
        message: `La nueva área "${nombre}" fue añadida correctamente.`,
      })
    }

    return nuevaArea
  } catch (err) {
    console.error('❌ Error al añadir área:', err)
    if (showAlert) {
      showAlert({
        type: 'generalError',
        title: 'Error al crear área',
        message: err.message || 'No pudimos añadir la nueva área. Intenta de nuevo.',
      })
    }
    return null
  }
}
