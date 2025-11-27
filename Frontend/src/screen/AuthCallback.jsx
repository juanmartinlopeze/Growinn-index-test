import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function AuthCallback() {
  const [status, setStatus] = useState('Validando tu cuenta…')

  useEffect(() => {
    (async () => {
      try {
        // For email verification, Supabase automatically sets the session
        // We just need to wait a moment and then get the session
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        console.log('🟠 session:', session);
        if (sessionError) throw sessionError
        if (!session) {
          throw new Error('No session found after email verification')
        }

        // Get the user with metadata
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        console.log('🟠 userError:', userError);
        console.log('🟠 user:', user);
        if (userError) throw userError
        if (!user) throw new Error('No user found')
        // Guardar el user_id en localStorage para el resto de la app
        window.localStorage.setItem('user_id', user.id);

        // Check if user has pending empresa data in metadata
        if (user?.user_metadata?.pending_empresa) {
          setStatus('Guardando datos de tu empresa…')

          const { company, organization_type, adress, category, sector } = user.user_metadata.pending_empresa

          // Save empresa to database
          const backendUrl = import.meta.env.VITE_API_URL || 'https://backend-growinn-index.onrender.com'
          const response = await fetch(`${backendUrl}/register/empresa`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
              company,
              organization_type,
              adress,
              category,
              sector,
            }),
          })

          if (!response.ok) {
            const errorData = await response.json()
            console.error('Error saving empresa:', errorData)
            // Continue anyway - user is authenticated
          } else {
            // Clean up pending_empresa from metadata
            await supabase.auth.updateUser({
              data: {
                pending_empresa: null,
              },
            })
          }
        }

        setStatus('¡Todo listo! Redirigiendo…')
        setTimeout(() => window.location.replace('/'), 1500)
      } catch (e) {
        console.error('Auth callback error:', e)
        setStatus(`Error: ${e?.message || 'Error al validar tu cuenta'}. Redirigiendo…`)
        setTimeout(() => window.location.replace('/login'), 3000)
      }
    })()
  }, [])

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <p style={{ fontSize: '18px' }}>{status}</p>
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #f56f10',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
