import { supabase } from './supabaseClient';

// Obtiene el número de respuestas de encuestas para una empresa
export async function getSurveyProgress(empresaId) {
  // 1. Buscar todos los usuarios de la empresa
  const { data: usuarios, error: errorUsuarios } = await supabase
    .from('usuarios')
    .select('id')
    .eq('empresa_id', empresaId);
  if (errorUsuarios) throw errorUsuarios;
  if (!usuarios || usuarios.length === 0) return 0;

  const userIds = usuarios.map(u => u.id);

  // 2. Contar respuestas en survey_responses de esos usuarios
  const { count, error: errorRespuestas } = await supabase
    .from('survey_responses')
    .select('id', { count: 'exact', head: true })
    .in('user_id', userIds);
  if (errorRespuestas) throw errorRespuestas;
  return count || 0;
}
