"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0 },
};

export default function RegistroBox() {
  const router = useRouter();

  const [inputUser, setInputUser] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");

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
      console.error(error);
      alert("Erro inesperado. Tente novamente.");
    }
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-white px-4"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {/* Ícone topo */}
      <motion.div
        variants={fadeUp}
        whileHover={{ scale: 1.05 }}
        className="flex items-center justify-center mb-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 120 }}
          className="bg-blue-600 p-4 rounded-full shadow-lg"
        >
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
        </motion.div>
      </motion.div>

      {/* Título */}
      <motion.h1
        variants={fadeUp}
        className="text-3xl font-extrabold text-gray-900 mb-2"
      >
        Criar Conta
      </motion.h1>

      <motion.p
        variants={fadeUp}
        className="text-gray-600 mb-8 text-sm"
      >
        Preencha os campos para se registrar
      </motion.p>

      {/* Card */}
      <motion.div
        variants={fadeUp}
        className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-200"
      >
        <motion.form
          onSubmit={handleRegister}
          className="flex flex-col gap-5"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {/* Usuário */}
          <motion.div variants={fadeUp} className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Usuário
            </label>
            <input
              type="text"
              placeholder="Digite seu nome de usuário"
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 text-black"
              value={inputUser}
              onChange={(e) => setInputUser(e.target.value)}
              required
            />
          </motion.div>

          {/* Email */}
          <motion.div variants={fadeUp} className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Digite seu email"
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 text-black"
              value={inputEmail}
              onChange={(e) => setInputEmail(e.target.value)}
              required
            />
          </motion.div>

          {/* Senha */}
          <motion.div variants={fadeUp} className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              placeholder="Digite sua senha"
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 text-black"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              required
            />
          </motion.div>

          {/* Botão */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Registrar
          </motion.button>
        </motion.form>

        <motion.p
          variants={fadeUp}
          className="mt-6 text-sm text-gray-600 text-center"
        >
          Já tem uma conta?{" "}
          <Link href="/" className="text-blue-600 hover:underline">
            Faça login
          </Link>
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
