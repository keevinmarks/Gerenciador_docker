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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-white to-blue-200">
      {/* Header fixo no topo */}
      <header className="sticky top-0 z-50 bg-blue-700 text-white shadow-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between py-3 px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/dashboard"
            className="text-2xl font-extrabold hover:text-blue-200 transition-colors"
          >
            ManagerSys
          </Link>

          {/* Menu principal */}
          <ul className="hidden md:flex items-center gap-8 font-medium text-white/90 text-base">
            <li>
              <Link href="/system/gerenciadordetelas" className="hover:text-blue-200">
                Computadores
              </Link>
            </li>
            <li>
              <Link
                href="/system/gerenciadordeimpressora"
                className="hover:text-blue-200"
              >
                Impressoras
              </Link>
            </li>
            <li>
              <Link
                href="/system/gerenciadordeusuarios"
                className="hover:text-blue-200"
              >
                Usuários
              </Link>
            </li>
          </ul>

          {/* Dropdown de usuário */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="focus:outline-none rounded-full border-2 border-transparent hover:border-white transition"
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
              <div className="absolute right-0 mt-3 w-60 origin-top-right rounded-xl bg-white text-gray-800 shadow-xl ring-1 ring-blue-100 animate-fadeIn">
                <div className="py-3">
                  {/* Cabeçalho do usuário */}
                  <div className="px-5 pb-3 border-b border-gray-200">
                    <p className="font-semibold">Olá, Kevin!</p>
                    <p className="text-xs text-gray-500 truncate">
                      kevin.marques@email.com
                    </p>
                  </div>

                  {/* Opções */}
                  <div className="px-2 py-2 flex flex-col gap-1">
                    <Link
                      href="/system/gerenciadordeusuarios"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
                    >
                      ⚙️ Gerenciar Perfil
                    </Link>
                    <Link
                      href="/system/gerenciadordeimpressora"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
                    >
                      🖨️ Impressoras
                    </Link>
                    <Link
                      href="/system/gerenciadordetelas"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
                    >
                      💻 Computadores
                    </Link>
                    <Link
                      href="/system/maquinanarede"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
                    >
                      🛜 Maquina na Rede
                    </Link>
                    <Link
                      href="/system/historicodoscomputadores"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
                    >
                      📋 Historico de Computadores
                    </Link>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-200 mt-2 pt-2 px-2">
                    <ButtonLogoff />
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* Conteúdo */}
      <main className="flex-1 w-full p-6 bg-white rounded-t-2xl shadow-md border border-blue-100">
        {children}
      </main>
    </div>
  );
};

export default Layout;
