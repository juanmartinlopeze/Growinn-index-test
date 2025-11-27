import { supabase } from './supabaseClient'

const BASE_URL = import.meta.env.VITE_API_URL

export async function apiFetch(path, options = {}) {
	const {
		data: { session },
	} = await supabase.auth.getSession()
	const token = session?.access_token

	const res = await fetch(`${BASE_URL}${path}`, {
		method: options.method || 'GET',
		headers: {
			'Content-Type': 'application/json',
			...(options.headers || {}),
			...(token ? { Authorization: `Bearer ${token}` } : {}),
		},
		body: options.body ? JSON.stringify(options.body) : undefined,
	})

	return res
}

// Función para crear o actualizar empresa en Supabase
export async function createEmpresa(empresaData) {
	try {
		// Get the authenticated user
		const { data: { user }, error: userError } = await supabase.auth.getUser();

		if (userError || !user) {
			throw new Error('Usuario no autenticado');
		}

		// Check if user already has an empresa
		const { data: existingEmpresa } = await supabase
			.from('empresas')
			.select('id')
			.eq('user_id', user.id)
			.single();

		// Build payload with only the fields provided (exclude empty strings)
		const empresaPayload = {};

		// Only include fields that are provided and not empty
		if (empresaData.nombre && empresaData.nombre.trim() !== '') {
			empresaPayload.nombre = empresaData.nombre;
		}
		if (empresaData.empleados !== undefined && empresaData.empleados !== '') {
			empresaPayload.cantidad_empleados = parseInt(empresaData.empleados, 10);
		}
		if (empresaData.jerarquia1 !== undefined && empresaData.jerarquia1 !== '') {
			empresaPayload.jerarquia1 = parseInt(empresaData.jerarquia1, 10);
		}
		if (empresaData.jerarquia2 !== undefined && empresaData.jerarquia2 !== '') {
			empresaPayload.jerarquia2 = parseInt(empresaData.jerarquia2, 10);
		}
		if (empresaData.jerarquia3 !== undefined && empresaData.jerarquia3 !== '') {
			empresaPayload.jerarquia3 = parseInt(empresaData.jerarquia3, 10);
		}
		if (empresaData.jerarquia4 !== undefined && empresaData.jerarquia4 !== '') {
			empresaPayload.jerarquia4 = parseInt(empresaData.jerarquia4, 10);
		}
		if (empresaData.areas !== undefined && empresaData.areas !== '') {
			empresaPayload.areas = parseInt(empresaData.areas, 10);
		}
		if (empresaData.jerarquia !== undefined && empresaData.jerarquia !== '') {
			empresaPayload.jerarquia = parseInt(empresaData.jerarquia, 10);
		} else if (!existingEmpresa) {
			empresaPayload.jerarquia = 4; // Default only for new empresas
		}

		let data, error;

		if (existingEmpresa) {
			// Update existing empresa (only updates provided fields)
			// Do not update if payload is empty (only user_id was set)
			if (Object.keys(empresaPayload).length > 0) {
				({ data, error } = await supabase
					.from('empresas')
					.update(empresaPayload)
					.eq('id', existingEmpresa.id)
					.select()
					.single());
			} else {
				// No fields to update, just return existing empresa
				({ data, error } = await supabase
					.from('empresas')
					.select('*')
					.eq('id', existingEmpresa.id)
					.single());
			}
		} else {
			// Create new empresa (ensure we have a name and user_id)
			empresaPayload.user_id = user.id;
			if (!empresaPayload.nombre) {
				empresaPayload.nombre = 'Empresa sin nombre';
			}
			({ data, error } = await supabase
				.from('empresas')
				.insert([empresaPayload])
				.select()
				.single());
		}

		if (error) {
			console.error("Error guardando empresa:", error);
			throw error;
		}

		return data;
	} catch (error) {
		console.error("Error en createEmpresa:", error);
		throw error;
	}
}
