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
    // 🔹 Carrega usuário do localStorage (se existir)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
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
