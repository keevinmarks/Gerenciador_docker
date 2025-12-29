"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import ButtonLogoff from "@/components/system/ButtonLogoff";
import { useUser } from "@/contexts/UserContext";

/* ===================== TYPES ===================== */

type Props = {
  children: ReactNode;
};

/* ===================== ANIMATIONS ===================== */

const dropdownVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: -8,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring" as const,
      stiffness: 260,
      damping: 20,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: -6,
    filter: "blur(4px)",
    transition: {
      duration: 0.15,
    },
  },
};

const pageVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

/* ===================== COMPONENT ===================== */

export default function Layout({ children }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();

  /* Fecha dropdown ao clicar fora */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-white to-blue-200">
      {/* ===================== HEADER ===================== */}
      <header className="sticky top-0 z-50 bg-blue-700 shadow-lg">
        <nav className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link
            href="/system/home"
            className="text-2xl font-extrabold text-white tracking-wide hover:text-blue-200 transition"
          >
            ManagerSys
          </Link>

          {/* Menu Desktop */}
          <ul className="hidden md:flex items-center gap-8 text-white/90 font-medium">
            {[
              { label: "Computadores", href: "/system/gerenciadordetelas" },
              { label: "Impressoras", href: "/system/gerenciadordeimpressora" },
              { label: "Usuários", href: "/system/gerenciadordeusuarios" },
            ].map((item) => (
              <li key={item.href} className="relative group">
                <Link href={item.href} className="hover:text-white transition">
                  {item.label}
                </Link>
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-white transition-all group-hover:w-full" />
              </li>
            ))}
          </ul>

          {/* Avatar */}
          <div className="relative" ref={menuRef}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="rounded-full border-2 border-transparent hover:border-white transition"
            >
              <Image
                src={user?.path_img ? `http://api:3001/${user.path_img}` : "/images/default.jpg"}
                width={44}
                height={44}
                alt="Perfil"
                className="rounded-full object-cover"
                unoptimized={!!user?.path_img}
              />
            </motion.button>

            {/* ===================== DROPDOWN ===================== */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute right-0 mt-3 w-64 rounded-xl bg-white text-gray-800 shadow-xl ring-1 ring-blue-100"
                >
                  {/* User Info */}
                  <div className="px-5 py-4 border-b">
                    {user ? (
                      <>
                        <p className="font-semibold">
                          Olá, {user.displayName ?? user.user_name ?? user.name} 👋
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-red-500">
                        Usuário não autenticado
                      </p>
                    )}
                  </div>

                  {/* Links */}
                  <div className="px-2 py-2 space-y-1">
                    {[
                      { label: "Gerenciar Perfil", href: "/system/gerenciadordeusuarios" },
                      { label: "Impressoras", href: "/system/gerenciadordeimpressora" },
                      { label: "Computadores", href: "/system/gerenciadordetelas" },
                      { label: "Máquina na Rede", href: "/system/maquinanarede" },
                      { label: "Histórico", href: "/system/historicodoscomputadores" },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>

                  {/* Logout */}
                  <div className="border-t px-2 py-2">
                    <ButtonLogoff />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>
      </header>

      {/* ===================== CONTENT ===================== */}
      <motion.main
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 p-6 bg-white rounded-t-2xl shadow-md border border-blue-100"
      >
        {children}
      </motion.main>
    </div>
  );
}
