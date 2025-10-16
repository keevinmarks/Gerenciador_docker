"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const RegistroBox = () => {
  const router = useRouter();

  const [inputUser, setInputUser] = useState<string>("");
  const [inputEmail, setInputEmail] = useState<string>("");
  const [inputPassword, setInputPassword] = useState<string>("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: inputUser,
          email: inputEmail,
          password: inputPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Erro ao registrar usuário.");
        return;
      }

      alert("Conta criada com sucesso!");
      router.push("/");
    } catch (error) {
      console.error("Erro durante registro:", error);
      alert("Erro inesperado. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      {/* Ícone topo */}
      <div className="flex items-center justify-center mb-6">
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
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </div>
      </div>

      {/* Título */}
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
        Criar Conta
      </h1>
      <p className="text-gray-600 mb-8 text-sm">
        Preencha os campos para se registrar
      </p>

      {/* Card de Registro */}
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
        <form onSubmit={handleRegister} className="flex flex-col gap-5">
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
              placeholder="Digite seu nome de usuário"
              className="border rounded-lg px-3 py-2 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 
                         placeholder:text-gray-400 text-black bg-white"
              value={inputUser}
              onChange={(e) => setInputUser(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="flex flex-col text-left">
            <label
              htmlFor="inputEmail"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="inputEmail"
              placeholder="Digite seu email"
              className="border rounded-lg px-3 py-2 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 
                         placeholder:text-gray-400 text-black bg-white"
              value={inputEmail}
              onChange={(e) => setInputEmail(e.target.value)}
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
            Registrar
          </button>
        </form>

        {/* Link login */}
        <p className="mt-6 text-sm text-gray-600 text-center">
          Já tem uma conta?{" "}
          <Link href="/" className="text-blue-600 hover:underline">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegistroBox;
