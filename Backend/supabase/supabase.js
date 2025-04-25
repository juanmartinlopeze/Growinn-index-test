const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_KEY; // Clave pública (anon)
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Clave de service_role

// Cliente con clave pública (para operaciones de lectura)
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cliente con clave de service_role (para operaciones administrativas)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

module.exports = { supabase, supabaseAdmin };