// Imports básicos do React e Next.js
"use client"
import { useState, useEffect, useRef, ReactNode } from "react";
import Image from 'next/image';
import Link from "next/link";
import ButtonLogoff from "@/components/ButtonLogoff";

type Props = {
    children: ReactNode;
}

const Layout = ({ children }: Props) => {
    // Estado para controlar a visibilidade do menu dropdown
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Efeito para fechar o menu se clicar fora dele
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header com fundo branco, sombra e padding responsivo */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 px-6 lg:px-8">
                    
                    {/* 1. Logo (Esquerda) */}
                    <Link href="#" className="text-2xl font-bold text-gray-800 hover:text-gray-600 transition-colors">
                        {/* Você pode colocar seu logo aqui (texto ou <Image/>) */}
                        ManagerSys
                    </Link>

                    {/* 2. Links de Navegação (Centro) */}
                    <ul className="hidden md:flex items-center gap-10 font-medium text-gray-500 text-base">
                        <li>
                            <Link href={"/system/computers"} className="hover:text-black transition-colors">
                                Computadores
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className="hover:text-black transition-colors">
                                Impressoras
                            </Link>
                        </li>
                        <li>
                            <Link href={"/system/users"} className="hover:text-black transition-colors">
                                Usuários
                            </Link>
                        </li>
                    </ul>

                    {/* 3. Ações do Usuário com Dropdown (Direita) */}
                    <div className="relative" ref={menuRef}>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-full">
                            <Image
                                src={"/images/default.jpg"}
                                width={40}
                                height={40}
                                alt="Perfil"
                                className="h-10 w-10 rounded-full object-cover" // Tamanho fixo para melhor consistência
                            />
                        </button>

                        {/* O Menu Dropdown que aparece/desaparece */}
                        {isMenuOpen && (
                            <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                    <div className="px-4 py-2 text-sm text-gray-700">
                                        <p className="font-semibold">Olá, Kevin!</p>
                                        <p className="text-xs text-gray-500 truncate">kevin.marques@email.com</p>
                                    </div>
                                    <div className="border-t border-gray-100 my-1"></div>
                                    <div className="px-1 py-1">
                                      {/* O ButtonLogoff precisa ser estilizado para parecer um item de menu */}
                                      <ButtonLogoff />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </nav>
            </header>

            {/* Conteúdo principal da página */}
            <main className="w-full min-h-full p-2">
                {children}
            </main>
        </div>
    );
}

export default Layout;