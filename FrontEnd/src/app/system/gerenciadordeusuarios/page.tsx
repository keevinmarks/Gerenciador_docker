"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ModalUser from "@/components/users/ModalUser";
import TableUsers from "@/components/users/TableUsers";
import { getUsers } from "@/actions/userAction";
import { User } from "@/types/types";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

export default function UserManager() {
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  const getUsersList = async () => {
    const userList = await getUsers();
    setUsers(userList);
  };

  useEffect(() => {
    getUsersList();
  }, []);

  return (
    <motion.div
      className="p-6 bg-gray-50 min-h-screen text-black"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      <motion.h1
        variants={fadeUp}
        className="text-3xl font-extrabold mb-6 text-center"
      >
        Gerenciamento de Usuários
      </motion.h1>

      <motion.div
        variants={fadeUp}
        className="flex justify-end mb-6"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          <Plus className="w-5 h-5" />
          Adicionar Usuário
        </motion.button>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="bg-white shadow-lg rounded-xl p-6 border border-gray-200"
      >
        <TableUsers users={users} getUsers={getUsersList} />
      </motion.div>

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
