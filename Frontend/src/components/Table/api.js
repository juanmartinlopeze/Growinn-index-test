const BASE_URL = 'http://localhost:3000'

export async function fetchEmpresas() {
	const res = await fetch(`${BASE_URL}/empresas`)
	return res.json()
}

export async function fetchRoles(empresaId) {
	const res = await fetch(`${BASE_URL}/roles/empresa/${empresaId}`)
	if (!res.ok) throw new Error('Error cargando roles')
	return res.json()
}

export async function updateEmpresaAreas(empresaId, nombres) {
	return fetch(`${BASE_URL}/empresas/${empresaId}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ areas_nombres: nombres }),
	})
}

export async function saveRole(role) {
	const res = await fetch(`${BASE_URL}/roles`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(role),
	})
	const data = await res.json()
	if (!res.ok) throw new Error(data.message)
	return data
}

export async function fetchAllRoles(empresaId) {
	const res = await fetch(`${BASE_URL}/roles/empresa/${empresaId}`)
	return res.json()
}

export async function deleteRole(roleId) {
	const res = await fetch(`${BASE_URL}/roles/${roleId}`, {
		method: 'DELETE',
	})
	const data = await res.json()
	if (!res.ok) throw new Error(data.error || 'Error al eliminar el rol')
}

export async function deleteSubcargo(roleId, subcargoName) {
    try {
        const res = await fetch(`${BASE_URL}/roles/${roleId}/subcargos/${encodeURIComponent(subcargoName)}`, {
            method: 'DELETE',
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || 'Error al eliminar subcargo');
        }

        return data; // Devuelve la respuesta del servidor
    } catch (error) {
        console.error('❌ Error al eliminar subcargo:', error);
        throw error; // Lanza el error para manejarlo en el frontend
    }
}

export async function deleteArea(empresaId, areaName) {
	console.log(`Llamando a la API para eliminar el área: ${areaName} de la empresa con ID: ${empresaId}`); // Depuración
	const res = await fetch(`${BASE_URL}/areas/${empresaId}/${encodeURIComponent(areaName)}`, {
	  method: 'DELETE',
	});
	const data = await res.json();
	if (!res.ok) {
	  throw new Error(data.error || 'Error al eliminar el área');
	}
	return data;
  }
