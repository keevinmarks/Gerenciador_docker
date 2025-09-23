"use client";
import { useState, useEffect, useRef, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import ButtonLogoff from "@/components/ButtonLogoff";

type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fecha o menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-dark flex flex-col bg-gradient-to-br from-blue-100 via-gray-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-black px-4">
      {/* Header fixo no topo */}
      <header className="bg-dark-800 shadow-md sticky top-0 z-50 bg-gradient-to-br from-blue-100 via-gray-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-black px-4">
        <nav className="mx-auto flex max-w-7xl items-center justify-between py-3 px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-extrabold text-accent-blue hover:text-blue-400 transition-colors"
          >
            ManagerSys
          </Link>

          {/* Menu principal */}
          <ul className="hidden md:flex items-center gap-8 font-medium text-text-secondary text-base">
            <li>
              <Link
                href="/FrontEnd/src/app/telas/gerenciadordetelas.tsx"
                className="hover:text-accent-blue transition-colors"
              >
                Computadores
              </Link>
            </li>
            <li>
              <Link
                href="/FrontEnd/src/app/telas/gerenciadordeimpressora.tsx"
                className="hover:text-accent-blue transition-colors"
              >
                Impressoras
              </Link>
            </li>
            <li>
              <Link
                href="/FrontEnd/src/app/telas/gerenciadordetelas.tsx"
                className="hover:text-accent-blue transition-colors"
              >
                Usuários
              </Link>
            </li>
          </ul>

          {/* Dropdown de usuário */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="focus:outline-none rounded-full border-2 border-transparent hover:border-accent-blue transition"
            >
              <Image
                src={"/images/default.jpg"}
                width={42}
                height={42}
                alt="Perfil"
                className="h-11 w-11 rounded-full object-cover"
              />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-3 w-60 origin-top-right rounded-xl bg-dark-800 shadow-xl ring-1 ring-black ring-opacity-50 animate-fadeIn">
                <div className="py-3">
                  {/* Cabeçalho do usuário */}
                  <div className="px-5 pb-3 border-b border-dark-900">
                    <p className="font-semibold text-text-primary">Olá, Kevin!</p>
                    <p className="text-xs text-text-secondary truncate">
                      kevin.marques@email.com
                    </p>
                  </div>

                  {/* Opções */}
                  <div className="px-2 py-2 flex flex-col gap-1">
                    <Link
                      href="@/app/telas/gerenciadordeusuarios.tsx"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-text-secondary hover:bg-dark-900 hover:text-accent-blue transition"
                    >
                      ⚙️ Gerenciar Perfil
                    </Link>
                    <Link
                      href="@/app/telas/gerenciadordeimpressora.tsx"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-text-secondary hover:bg-dark-900 hover:text-accent-blue transition"
                    >
                      🖨️ Impressoras
                    </Link>
                    <Link
                      href="@/app/telas/gerenciadordecomputadores.tsx"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-text-secondary hover:bg-dark-900 hover:text-accent-blue transition"
                    >
                      💻 Computadores
                    </Link>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-dark-900 mt-2 pt-2 px-2">
                    <ButtonLogoff />
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* Conteúdo */}
      <main className="flex-1 w-full p-4 text-text-primary">{children}</main>
    </div>
  );
};

export default Layout;
