import { useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function AuthCallback() {
  useEffect(() => {
    (async () => {
      try {
        await supabase.auth.exchangeCodeForSession(window.location.href)
        window.location.replace('/')
      } catch (e) {
        console.error(e)
        window.location.replace('/login')
      }
    })()
  }, [])
  return <p style={{ padding: 16 }}>Validando tu cuenta…</p>
}
