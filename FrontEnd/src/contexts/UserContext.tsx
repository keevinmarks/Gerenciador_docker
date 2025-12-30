"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

/* ===================== TIPOS ===================== */

type User = {
  id: string;
  name: string;
  user_name?: string;
  displayName?: string;
  path_img?: string | null;
  email: string;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  refetchUser: () => Promise<void>;
  clearUserCache: () => void;
};

/* ===================== CONTEXT ===================== */

const UserContext = createContext<UserContextType | undefined>(undefined);

/* ===================== PROVIDER ===================== */

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const fetchUserData = async () => {
    try {
      const res = await fetch('/api/me', { 
        method: 'GET',
        cache: 'no-store',
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      });
      
      if (!res.ok) {
        console.log('Erro ao buscar usuário, status:', res.status);
        try { localStorage.removeItem("user"); } catch { }
        setUser(null);
        return;
      }
      
      const json = await res.json();
      console.log('Dados do usuário recebidos:', json);
      
      if (json && json.success && json.data) {
        // Prioriza user_name que é o campo correto do banco
        const resolvedName = json.data.user_name || json.data.name || json.data.displayName || "Usuário";
        
        const u: User = {
          id: String(json.data.id),
          name: resolvedName,
          user_name: json.data.user_name || undefined,
          displayName: resolvedName,
          path_img: json.data.path_img || null,
          email: json.data.email_user || json.data.email || "",
        };
        
        console.log('Usuário definido:', u);
        setUser(u);
        try { localStorage.setItem('user', JSON.stringify(u)); } catch { /* ignore */ }
      } else {
        console.log('Resposta inválida de /api/me:', json);
        try { localStorage.removeItem('user'); } catch { }
        setUser(null);
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
    }
  };

  const clearUserCache = () => {
    try { localStorage.removeItem("user"); } catch { }
    setUser(null);
  };

  useEffect(() => {
    // Sempre faz um fetch fresh dos dados do usuário
    fetchUserData();
    
    // Refaz a busca a cada 3 minutos para garantir sincronização
    const interval = setInterval(fetchUserData, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, refetchUser: fetchUserData, clearUserCache }}>
      {children}
    </UserContext.Provider>
  );
}

/* ===================== HOOK ===================== */

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser deve ser usado dentro de <UserProvider>");
  }

  return context;
}
