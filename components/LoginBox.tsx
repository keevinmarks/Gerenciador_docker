"use client";
// Este componente roda no client-side (necessário no app directory do Next.js)

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import validateUser from "@/actions/validateAction";

const LoginBox = () => {
  const router = useRouter();

  // Estados controlados para capturar usuário e senha
  const [inputUser, setInputUser] = useState<string>("");
  const [inputPassword, setInputPassword] = useState<string>("");

  /**
   * Função executada ao enviar o formulário de login
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Impede reload da página

    try {
      const response = await validateUser({
        name: inputUser,
        password: inputPassword,
      });

      if (!response.success) {
        alert(response.message);
        return;
      }

      router.push("/dashboard"); // Redireciona após sucesso
    } catch (error) {
      console.error("Erro durante login:", error);
      alert("Erro inesperado. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-gray-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-black px-4">
      {/* Logo/ícone no topo */}
      <div className="flex items-center justify-center mb-6 animate-fade-in">
        <div className="bg-blue-600 p-4 rounded-full shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="white"
            className="w-10 h-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 6.75h15m-15 4.5h15m-15 4.5h15"
            />
          </svg>
        </div>
      </div>

      {/* Título e subtítulo */}
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white animate-fade-in">
        Nome Provisório
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm animate-fade-in">
        Acesse para gerenciar os ativos de TI
      </p>

      {/* Card de login */}
      <div className="w-full max-w-md bg-white/70 dark:bg-gray-900/70 shadow-xl rounded-2xl p-8 backdrop-blur-md border border-gray-200 dark:border-gray-700 animate-fade-up">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6">
          Login
        </h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {/* Campo de usuário */}
          <div className="flex flex-col text-left">
            <label
              htmlFor="inputUser"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Usuário
            </label>
            <input
              type="text"
              id="inputUser"
              placeholder="Digite seu usuário"
              className="border rounded-lg px-3 py-2 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 
                         focus:border-blue-500 transition 
                         placeholder:text-gray-400 text-black dark:text-white 
                         dark:bg-gray-800 dark:border-gray-700"
              value={inputUser}
              onChange={(e) => setInputUser(e.target.value)}
              required
            />
          </div>

          {/* Campo de senha */}
          <div className="flex flex-col text-left">
            <label
              htmlFor="inputPassword"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Senha
            </label>
            <input
              type="password"
              id="inputPassword"
              placeholder="Digite sua senha"
              className="border rounded-lg px-3 py-2 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 
                         focus:border-blue-500 transition 
                         placeholder:text-gray-400 text-black dark:text-white 
                         dark:bg-gray-800 dark:border-gray-700"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              required
            />
          </div>

          {/* Botão de login */}
          <button
            type="submit"
            className="cursor-pointer w-full bg-blue-600 text-white 
                       font-semibold py-2 rounded-lg 
                       hover:bg-blue-700 active:scale-95 transition-all duration-200"
          >
            Entrar
          </button>
        </form>

        {/* Link de registro */}
        <p className="mt-6 text-sm text-gray-600 dark:text-gray-400 text-center">
          Não tem uma conta?{" "}
          <Link href="/Registro" className="text-blue-600 hover:underline">
            Registre-se
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginBox;
