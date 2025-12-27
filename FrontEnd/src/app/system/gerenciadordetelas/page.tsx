"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ModalComputer from "@/components/computers/ModalComputer";
import TableComputers from "@/components/computers/TableComputers";
import { Computer } from "@/types/types";
import { getComputers } from "@/actions/computersAction";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const ComputerList = () => {
  const [showModal, setShowModal] = useState(false);
  const [computers, setComputers] = useState<Computer[]>([]);

  const getCompu = async () => {
    const computersResp = await getComputers();
    setComputers(computersResp);
  };

  useEffect(() => {
    getCompu();
  }, []);

  return (
    <motion.div
      className="min-h-screen bg-white p-6"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      <motion.h1
        variants={fadeUp}
        className="text-2xl font-bold text-black mb-6"
      >
        Gerenciamento de Computadores
      </motion.h1>

      <motion.div
        variants={fadeUp}
        className="bg-white rounded-xl shadow p-6 border border-gray-200"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-700">
            Lista de Computadores
          </h2>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Adicionar Computador
          </motion.button>
        </div>

        <motion.div variants={fadeUp}>
          <TableComputers
            computers={computers}
            modalUpdate={getCompu}
          />
        </motion.div>
      </motion.div>

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
