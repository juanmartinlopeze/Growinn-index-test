import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const UserEmpresaContext = createContext();

export function useUserEmpresa() {
  return useContext(UserEmpresaContext);
}

export function UserEmpresaProvider({ children }) {
  const [user, setUser] = useState(null);
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserEmpresa() {
      setLoading(true);
      // Obtener usuario actual
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      setUser(user || null);
      // Obtener empresa asociada si hay user
      if (user && user.id) {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/empresas`);
          const empresas = await res.json();
          // Filtrar empresa por user_id
          const empresaActual = empresas.find(e => String(e.user_id) === String(user.id));
          setEmpresa(empresaActual || null);
        } catch (e) {
          setEmpresa(null);
        }
      } else {
        setEmpresa(null);
      }
      setLoading(false);
    }
    fetchUserEmpresa();
  }, []);

  return (
    <UserEmpresaContext.Provider value={{ user, empresa, loading }}>
      {children}
    </UserEmpresaContext.Provider>
  );
}
