const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');

// Cache simple para evitar re-llamadas innecesarias
const cache = new Map();
const CACHE_DURATION = 30000; // 30 segundos

function getCacheKey(url) {
    return url;
}

function isValidCache(timestamp) {
    return Date.now() - timestamp < CACHE_DURATION;
}

async function fetchWithCache(url, options = {}) {
    const cacheKey = getCacheKey(url);
    const cached = cache.get(cacheKey);
    
    // Si hay cache válido y no es una mutación, usarlo
    if (cached && isValidCache(cached.timestamp) && (!options.method || options.method === 'GET')) {
        console.log('📦 Usando cache para:', url);
        return cached.data;
    }

    console.log('🌐 Fetching:', url);
    const res = await fetch(url, options);
    if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    
    const data = await res.json();
    
    // Solo cachear GET requests exitosos
    if (!options.method || options.method === 'GET') {
        cache.set(cacheKey, {
            data,
            timestamp: Date.now()
        });
    }
    
    return data;
}

// Función para invalidar cache relacionado
function invalidateCache(pattern) {
    for (const key of cache.keys()) {
        if (key.includes(pattern)) {
            cache.delete(key);
        }
    }
}

// 📁 EMPRESAS

export async function fetchEmpresas() {
    return await fetchWithCache(`${BASE_URL}/empresas`);
}

// 🛠️ AREAS

export async function fetchAreas(empresaId) {
    return await fetchWithCache(`${BASE_URL}/areas/empresa/${empresaId}`);
}

export async function updateArea(areaId, nombreNuevo) {
    const data = await fetchWithCache(`${BASE_URL}/areas/${areaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombreNuevo }),
    });
    
    // Invalidar cache relacionado
    invalidateCache('/areas/');
    return data;
}

// 📦 CARGOS

export async function fetchCargos() {
    return await fetchWithCache(`${BASE_URL}/cargos`);
}

export async function saveCargo({ nombre, personas = 0, area_id, jerarquia_id }) {
    const data = await fetchWithCache(`${BASE_URL}/cargos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, personas, area_id, jerarquia_id }),
    });
  
    // Invalidar cache relacionado
    invalidateCache('/cargos');
    return data;
}

export async function deleteCargo(cargoId) {
    const data = await fetchWithCache(`${BASE_URL}/cargos/${cargoId}`, {
        method: 'DELETE',
    });
    
    // Invalidar cache relacionado
    invalidateCache('/cargos');
    invalidateCache('/subcargos');
    return data;
}

export async function updateCargo(cargoId, cargoActualizado) {
    const data = await fetchWithCache(`${BASE_URL}/cargos/${cargoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cargoActualizado),
    });
    
    // Invalidar cache relacionado
    invalidateCache('/cargos');
    return data;
}

// 📦 SUBCARGOS

export async function fetchSubcargos() {
    return await fetchWithCache(`${BASE_URL}/subcargos`);
}

export async function fetchSubcargosByCargo(cargoId) {
    return await fetchWithCache(`${BASE_URL}/subcargos/cargo/${cargoId}`);
}

export async function saveSubcargo({ nombre, personas = 0, cargo_id }) {
    const data = await fetchWithCache(`${BASE_URL}/subcargos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, personas, cargo_id }),
    });
    
    // Invalidar cache relacionado
    invalidateCache('/subcargos');
    return data;
}

export async function deleteSubcargo(id) {
    const data = await fetchWithCache(`${BASE_URL}/subcargos/${id}`, {
        method: 'DELETE',
    });
    
    // Invalidar cache relacionado
    invalidateCache('/subcargos');
    return data;
}

export async function updateSubcargo(subcargoId, { nombre, personas }) {
  const data = await fetchWithCache(`${BASE_URL}/subcargos/${subcargoId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, personas }),
  });
  
  // Invalidar cache relacionado
  invalidateCache('/subcargos');
  return data;
}

// 👤 USUARIOS

export async function fetchUsuarios() {
    const res = await fetch(`${BASE_URL}/usuarios`);
    if (!res.ok) throw new Error('Error cargando usuarios');
    return res.json();
}

export async function saveUsuario(usuario) {
    const res = await fetch(`${BASE_URL}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al crear usuario');
    return data;
}

export async function updateUsuario(usuarioId, usuarioActualizado) {
    const res = await fetch(`${BASE_URL}/usuarios/${usuarioId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuarioActualizado),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error actualizando usuario');
    return data;
}

export async function deleteUsuario(usuarioId) {
    const res = await fetch(`${BASE_URL}/usuarios/${usuarioId}`, {
        method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al eliminar usuario');
    return data;
}
