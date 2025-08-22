import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

// Dev-only helper so you can use it in the browser console
if (typeof window !== 'undefined') {
  window.supabase = supabase
}
