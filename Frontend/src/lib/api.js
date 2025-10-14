import { supabase } from './supabaseClient'

const BASE_URL = import.meta.env.VITE_API_URL

export async function apiFetch(path, options = {}) {
	console.log('🌐 API Debug:', {
		baseUrl: BASE_URL,
		fullUrl: `${BASE_URL}${path}`,
		environment: import.meta.env.MODE,
		path,
		method: options.method || 'GET'
	});

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

	console.log('📡 API Response:', {
		status: res.status,
		statusText: res.statusText,
		url: res.url
	});

	return res
}

// Función para crear empresa en Supabase
export async function createEmpresa(empresaData) {
	try {
		console.log("🏢 Creando empresa en Supabase:", empresaData);
		
		const { data, error } = await supabase
			.from('empresas')
			.insert([{
				nombre: empresaData.nombre || 'Empresa sin nombre',
				cantidad_empleados: parseInt(empresaData.empleados, 10),
				jerarquia1: parseInt(empresaData.jerarquia1, 10),
				jerarquia2: parseInt(empresaData.jerarquia2, 10),
				jerarquia3: parseInt(empresaData.jerarquia3, 10),
				jerarquia4: parseInt(empresaData.jerarquia4, 10),
				areas: parseInt(empresaData.areas, 10)
			}])
			.select()
			.single();

		if (error) {
			console.error("❌ Error creando empresa:", error);
			throw error;
		}

		console.log("✅ Empresa creada exitosamente:", data);
		return data;
	} catch (error) {
		console.error("❌ Error en createEmpresa:", error);
		throw error;
	}
}
