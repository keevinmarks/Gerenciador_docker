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
};

/* ===================== CONTEXT ===================== */

const UserContext = createContext<UserContextType | undefined>(undefined);

/* ===================== PROVIDER ===================== */

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Primeiro carrega um valor provisório do localStorage (para evitar piscar vazio),
    // mas sempre consulta /api/me para garantir que pegamos o usuário atual da sessão.
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        // ignore malformed
      }
    }

    (async () => {
      try {
        const res = await fetch('/api/me');
        if (!res.ok) return;
        const json = await res.json();
        if (json && json.success && json.data) {
          const resolvedName = json.data.user_name ?? json.data.name ?? json.data.user?.name ?? "";
          const u = {
            id: String(json.data.id),
            name: resolvedName,
            user_name: json.data.user_name ?? undefined,
            displayName: resolvedName,
            path_img: json.data.path_img ?? json.data.user?.path_img ?? null,
            email: json.data.email_user ?? json.data.email ?? json.data.user?.email ?? "",
          };
          setUser(u);
          try { localStorage.setItem('user', JSON.stringify(u)); } catch { /* ignore */ }
        } else {
          // Se /api/me não retornar usuário, limpe o localStorage (sessão inválida)
          try { localStorage.removeItem('user'); } catch { }
          setUser(null);
        }
      } catch {
        // network error: keep stored user if present
      }
    })();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
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
