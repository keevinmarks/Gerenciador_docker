"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { validateUser } from "@/actions/userAction";
import { useUser } from "@/contexts/UserContext";
import { Loader2, Monitor, User, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LoginBox = () => {
  const router = useRouter();
  const { refetchUser, clearUserCache } = useUser();

  const [inputUser, setInputUser] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);

      const response = await validateUser({
        name: inputUser,
        password: inputPassword,
      });

      if (!response.success) {
        setError(response.message);
        return;
      }

      clearUserCache();
      await new Promise((r) => setTimeout(r, 200));
      await refetchUser();

      router.push("/system/home");
    } catch (err) {
      console.error(err);
      setError("Erro inesperado ao tentar entrar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Painel esquerdo */}
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="hidden md:flex flex-col justify-center p-8 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xl"
        >
          <div className="flex items-center gap-4">
            <Monitor className="w-12 h-12" />
            <h3 className="text-2xl font-bold leading-tight">
              Gerenciamento <br /> de Computadores
            </h3>
          </div>

          <p className="mt-6 text-sm opacity-90 max-w-sm">
            Controle, organização e segurança em um único sistema moderno.
          </p>
        </motion.div>

        {/* Card de login */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Entrar no sistema
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Usuário */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Usuário
              </label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  autoComplete="username"
                  className="w-full rounded-lg border pl-11 pr-3 py-2 text-black bg-white
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Digite seu usuário"
                  value={inputUser}
                  onChange={(e) => setInputUser(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  autoComplete="current-password"
                  className="w-full rounded-lg border pl-11 pr-3 py-2 text-black bg-white
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Digite sua senha"
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Erro animado */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between text-sm">
              <a className="text-blue-600 hover:underline cursor-pointer">
                Esqueceu a senha?
              </a>
            </div>

            {/* Botão */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              disabled={loading}
              className="w-full h-12 rounded-xl font-semibold text-white
                         bg-gradient-to-r from-blue-600 to-indigo-600
                         hover:from-blue-700 hover:to-indigo-700
                         disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Não tem uma conta?{" "}
            <Link
              href="/Registro"
              className="text-blue-600 hover:underline font-medium"
            >
              Registre-se
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginBox;
