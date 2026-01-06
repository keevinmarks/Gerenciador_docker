"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Sparkles, ArrowRight } from "lucide-react";
import Image from "next/image";

type Props = {
  userName: string;
  userEmail: string;
  userImage?: string | null;
  onClose: () => void;
};

export default function WelcomeModal({
  userName,
  userEmail,
  userImage,
  onClose,
}: Props) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 6000); // Fecha automaticamente após 6 segundos

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999] p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-white via-blue-50 to-indigo-50 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-blue-100"
          >
            {/* Header com fundo gradiente */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center relative overflow-hidden">
              {/* Elementos decorativos */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-2 right-4 text-blue-300/30"
              >
                <Sparkles className="w-12 h-12" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="relative z-10"
              >
                <h2 className="text-3xl font-extrabold text-white mb-2">
                  Bem-vindo!
                </h2>
                <p className="text-blue-100 text-sm">
                  Que bom te ver por aqui
                </p>
              </motion.div>
            </div>

            {/* Conteúdo */}
            <div className="p-8">
              {/* Avatar */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="flex justify-center mb-6"
              >
                <div className="relative">
                  <img
                    src={
                      userImage
                        ? (userImage.startsWith("http") ? userImage : `/api/uploads?path=${encodeURIComponent(userImage)}`)
                        : "/images/default.jpg"
                    }
                    width={80}
                    height={80}
                    alt="Perfil"
                    className="rounded-full object-cover border-4 border-blue-500 shadow-lg"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-0 right-0 bg-green-400 rounded-full p-2 border-4 border-white"
                  >
                    <CheckCircle className="w-5 h-5 text-white" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Informações do usuário */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center mb-6"
              >
                <p className="text-2xl font-bold text-slate-800 mb-1">
                  {userName}
                </p>
                <p className="text-sm text-slate-600">{userEmail}</p>
              </motion.div>

              {/* Mensagem de boas-vindas */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl p-4 mb-6"
              >
                <p className="text-slate-700 text-sm font-medium">
                  ✨ Você está pronto para gerenciar todos os seus ativos de TI.
                  Explore as funcionalidades e organize tudo com facilidade!
                </p>
              </motion.div>

              {/* Features rápidas */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="space-y-2 mb-6"
              >
                {[
                  "📱 Gerenciar Computadores",
                  "🖨️ Controlar Impressoras",
                  "👥 Administrar Usuários",
                ].map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + idx * 0.1 }}
                    className="flex items-center gap-2 text-sm text-slate-700"
                  >
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                    {feature}
                  </motion.div>
                ))}
              </motion.div>

              {/* Botão de fechar */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClose}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                Começar a Explorar
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              {/* Dica */}
              <p className="text-xs text-slate-500 text-center mt-4">
                (Fechará automaticamente em alguns segundos)
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
