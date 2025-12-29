"use client";

import { useEffect, useState } from "react";
import { Plus, Monitor } from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

import ModalComputer from "@/components/computers/ModalComputer";
import TableComputers from "@/components/computers/TableComputers";
import { Computer } from "@/types/types";
import { getComputers } from "@/actions/computersAction";

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
   COMPONENTE
====================== */

const ComputerList = () => {
  const [showModal, setShowModal] = useState(false);
  const [computers, setComputers] = useState<Computer[]>([]);
  const [loading, setLoading] = useState(true);

  const getCompu = async () => {
    setLoading(true);
    const computersResp = await getComputers();
    setComputers(Array.isArray(computersResp) ? computersResp : []);
    setLoading(false);
  };

  useEffect(() => {
    getCompu();
  }, []);

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6"
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
        {/* TÍTULO */}
        <motion.h1
          variants={fadeUp}
          className="text-3xl font-bold text-gray-800 mb-8"
        >
          Gerenciamento de Computadores
        </motion.h1>

        {/* CARD */}
        <motion.div
          variants={fadeUp}
          className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-700">
              Lista de Computadores
            </h2>

            <motion.button
              variants={pulse}
              animate="animate"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700
                         text-white text-sm font-medium px-4 py-2
                         rounded-xl shadow-lg"
            >
              <Plus size={16} />
              Adicionar
            </motion.button>
          </div>

          {/* CONTEÚDO */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-10 bg-gray-200 rounded-lg animate-pulse"
                  />
                ))}
              </motion.div>
            ) : computers.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center py-14 text-center"
              >
                <Monitor className="w-14 h-14 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700">
                  Nenhum computador cadastrado
                </h3>
                <p className="text-gray-500 mt-2">
                  Clique em <strong>Adicionar</strong> para começar
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="table"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <TableComputers
                  computers={computers}
                  modalUpdate={getCompu}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* MODAL */}
      <AnimatePresence>
        {showModal && (
          <ModalComputer
            setShowModal={setShowModal}
            isEditing={false}
            updateComputerList={getCompu}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ComputerList;
