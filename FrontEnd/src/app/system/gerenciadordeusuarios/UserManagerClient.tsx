"use client";

import { useEffect, useState } from "react";
import { Plus, Users } from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

import ModalUser from "@/components/users/ModalUser";
import TableUsers from "@/components/users/TableUsers";
import { User } from "@/types/types";

/* ======================
   VARIANTES
====================== */

const page: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 18 },
  },
};

const stagger: Variants = {
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const pulse: Variants = {
  animate: {
    scale: [1, 1.04, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

/* ======================
   PROPS
====================== */

type Props = {
  initialUsers: User[];
};

/* ======================
   COMPONENTE
====================== */

export default function UserManagerClient({ initialUsers }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState<User[]>(initialUsers ?? []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUsersList = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/users", { cache: "no-store" });
      const json = await res.json();

      if (res.ok && Array.isArray(json.data)) {
        setUsers(json.data);
      } else {
        setError(json.message || "Erro ao buscar usuários");
        setUsers([]);
      }
    } catch (e) {
      setError(String(e));
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialUsers || initialUsers.length === 0) {
      getUsersList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialUsers]);

  return (
    <motion.div
      className="p-6 bg-gradient-to-br from-gray-50 to-white min-h-screen text-black"
      variants={page}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="max-w-6xl mx-auto"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        {/* HEADER */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-extrabold">
              Gerenciamento de Usuários
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Visualize, edite e gerencie os usuários do sistema.
            </p>
          </div>

          <motion.button
            variants={pulse}
            animate="animate"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-3
                       bg-gradient-to-r from-blue-600 to-indigo-600
                       text-white px-4 py-2 rounded-xl
                       shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Adicionar Usuário
          </motion.button>
        </motion.div>

        {/* CARD */}
        <motion.div
          variants={fadeUp}
          className="bg-white shadow-xl rounded-2xl p-5 border border-gray-200"
        >
          <AnimatePresence mode="wait">
            {loading ? (
              /* LOADING */
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4 py-6"
              >
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-10 bg-gray-200 rounded-lg animate-pulse"
                  />
                ))}
              </motion.div>
            ) : error ? (
              /* ERROR */
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="py-8 text-center text-red-600 font-medium"
              >
                {error}
              </motion.div>
            ) : users.length === 0 ? (
              /* EMPTY */
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center py-14 text-center"
              >
                <Users className="w-14 h-14 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700">
                  Nenhum usuário encontrado
                </h3>
                <p className="text-gray-500 mt-2">
                  Clique em <strong>Adicionar Usuário</strong> para começar
                </p>
              </motion.div>
            ) : (
              /* TABELA */
              <motion.div
                key="table"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <TableUsers users={users} getUsers={getUsersList} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* MODAL */}
      <AnimatePresence>
        {showModal && (
          <ModalUser
            showModal={setShowModal}
            editingUser={false}
            getUsers={getUsersList}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
