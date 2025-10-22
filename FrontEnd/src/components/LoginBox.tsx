"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import validateUser from "@/actions/validateAction";

const LoginBox = () => {
  const router = useRouter();

  const [inputUser, setInputUser] = useState<string>("");
  const [inputPassword, setInputPassword] = useState<string>("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await validateUser({
        name: inputUser,
        password: inputPassword,
      });

      if (!response.success) {
        alert(response.message);
        return;
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Erro durante login:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-gray-100 to-white px-4">
      {/* Logo */}
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

      {/* Título */}
      <h1 className="text-3xl font-extrabold text-gray-900 animate-fade-in">
        Nome Provisório
      </h1>
      <p className="text-gray-600 mb-8 text-sm animate-fade-in">
        Acesse para gerenciar os ativos de TI
      </p>

      {/* Card de Login */}
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-200 animate-fade-up">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Login</h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {/* Usuário */}
          <div className="flex flex-col text-left">
            <label
              htmlFor="inputUser"
              className="text-sm font-medium text-gray-700 mb-1"
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
                         placeholder:text-gray-400 text-black bg-white"
              value={inputUser}
              onChange={(e) => setInputUser(e.target.value)}
              required
            />
          </div>

          {/* Senha */}
          <div className="flex flex-col text-left">
            <label
              htmlFor="inputPassword"
              className="text-sm font-medium text-gray-700 mb-1"
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
                         placeholder:text-gray-400 text-black bg-white"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              required
            />
          </div>

          {/* Botão */}
          <button
            type="submit"
            className="cursor-pointer w-full bg-blue-600 text-white 
                       font-semibold py-2 rounded-lg 
                       hover:bg-blue-700 active:scale-95 transition-all duration-200"
          >
            Entrar
          </button>
        </form>

        {/* Link registro */}
        <p className="mt-6 text-sm text-gray-600 text-center">
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

