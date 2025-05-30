const BASE_URL = 'http://localhost:3000';

// 📁 EMPRESAS

export async function fetchEmpresas() {
	const res = await fetch(`${BASE_URL}/empresas`);
	if (!res.ok) throw new Error('Error cargando empresas');
	return res.json();
}

// 🛠️ AREAS

export async function fetchAreas(empresaId) {
	const res = await fetch(`${BASE_URL}/areas/empresa/${empresaId}`);
	if (!res.ok) throw new Error('Error cargando áreas');
	return res.json();
}

export async function updateArea(areaId, nombreNuevo) {
	const res = await fetch(`${BASE_URL}/areas/${areaId}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ nombre: nombreNuevo }),
	});
	const data = await res.json();
	if (!res.ok) throw new Error(data.error || 'Error actualizando área');
	return data;
}

// 📦 CARGOS

export async function fetchCargos() {
	const res = await fetch(`${BASE_URL}/cargos`);
	if (!res.ok) throw new Error('Error cargando cargos');
	return res.json();
}

export async function saveCargo({ nombre, personas = 0, area_id, jerarquia_id }) {
	const res = await fetch(`${BASE_URL}/cargos`, {
	  method: 'POST',
	  headers: { 'Content-Type': 'application/json' },
	  body: JSON.stringify({ nombre, personas, area_id, jerarquia_id }), // AÑADIR jerarquia_id AQUÍ
	});
  
	const data = await res.json();
	if (!res.ok) throw new Error(data.error || 'Error al crear cargo');
	return data;
  }
  
  

export async function deleteCargo(cargoId) {
	const res = await fetch(`${BASE_URL}/cargos/${cargoId}`, {
		method: 'DELETE',
	});
	const data = await res.json();
	if (!res.ok) throw new Error(data.error || 'Error al eliminar cargo');
	return data;
}

export async function updateCargo(cargoId, cargoActualizado) {
	const res = await fetch(`${BASE_URL}/cargos/${cargoId}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(cargoActualizado),
	});
	const data = await res.json();
	if (!res.ok) throw new Error(data.error || 'Error actualizando cargo');
	return data;
}

// 📦 SUBCARGOS

export async function fetchSubcargos() {
	const res = await fetch(`${BASE_URL}/subcargos`);
	if (!res.ok) throw new Error('Error cargando subcargos');
	return res.json();
}

export async function fetchSubcargosByCargo(cargoId) {
	const res = await fetch(`${BASE_URL}/subcargos/cargo/${cargoId}`);
	if (!res.ok) throw new Error('Error cargando subcargos por cargo');
	return res.json();
  }
  

  export async function saveSubcargo({ nombre, personas = 0, cargo_id }) {
	const res = await fetch(`${BASE_URL}/subcargos`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ nombre, personas, cargo_id }),
	});
	const data = await res.json();
	if (!res.ok) throw new Error(data.error || 'Error al crear subcargo');
	return data;
}


export async function deleteSubcargo(id) {
	const res = await fetch(`${BASE_URL}/subcargos/${id}`, {
		method: 'DELETE',
	});
	const data = await res.json();
	if (!res.ok) throw new Error(data.error || 'Error al eliminar subcargo');
	return data;
}

export async function updateSubcargo(subcargoId, { nombre, personas }) {
  const res = await fetch(`${BASE_URL}/subcargos/${subcargoId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, personas }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error actualizando subcargo');
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
