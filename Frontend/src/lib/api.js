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
