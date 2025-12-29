"use client";

import { useEffect, useState } from "react";
import { Plus, Printer as PrinterIcon } from "lucide-react";
import { AnimatePresence, motion, type Variants } from "framer-motion";

import ModalPrinter from "@/components/printers/ModalPrinter";
import ModalDeletePrinter from "@/components/printers/ModalDeletePrinter";
import TablePrinters from "@/components/printers/TablePrinters";
import { Printer } from "@/types/types";
import { getPrinters } from "@/actions/printersAction";

/* ======================
   VARIANTES
====================== */

const pageVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
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

const pulseButton: Variants = {
  animate: {
    scale: [1, 1.04, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const floatIcon: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

/* ======================
   COMPONENTE
====================== */

const PrinterList = () => {
  const [showModal, setShowModal] = useState(false);
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrinter, setSelectedPrinter] =
    useState<Printer | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [printerToDelete, setPrinterToDelete] = useState<Printer | null>(null);

  const loadPrinters = async () => {
    setLoading(true);
    const resp = await getPrinters();
    setPrinters(Array.isArray(resp) ? resp : []);
    setLoading(false);
  };

  useEffect(() => {
    loadPrinters();
  }, []);

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6"
      variants={pageVariants}
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
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Gerenciamento de Impressoras
            </h1>
            <p className="text-gray-500 mt-1">
              Controle, edição e status das impressoras cadastradas
            </p>
          </div>

          <motion.button
            variants={pulseButton}
            animate="animate"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSelectedPrinter(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700
                       text-white px-5 py-3 rounded-xl shadow-lg"
          >
            <Plus size={18} />
            Adicionar
          </motion.button>
        </motion.div>

        {/* CONTEÚDO */}
        <motion.div
          variants={fadeUp}
          className="bg-white rounded-2xl shadow-xl border border-gray-200 p-5"
        >
          {loading ? (
            /* LOADING */
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-10 bg-gray-200 rounded-lg animate-pulse"
                />
              ))}
            </motion.div>
          ) : printers.length === 0 ? (
            /* EMPTY */
            <motion.div
              className="flex flex-col items-center justify-center py-16 text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div variants={floatIcon} animate="animate">
                <PrinterIcon className="text-gray-300 mb-4" size={64} />
              </motion.div>

              <h2 className="text-xl font-semibold text-gray-700">
                Nenhuma impressora cadastrada
              </h2>
              <p className="text-gray-500 mt-2 max-w-sm">
                Clique em <strong>Adicionar</strong> para registrar sua primeira
                impressora no sistema.
              </p>
            </motion.div>
          ) : (
            /* TABELA */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <TablePrinters
                printers={printers}
                onEdit={(printer) => {
                  setSelectedPrinter(printer);
                  setShowModal(true);
                }}
                onDelete={(printer) => {
                  setPrinterToDelete(printer);
                  setShowDeleteModal(true);
                }}
              />
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* MODAIS */}
      <AnimatePresence>
        {showModal && (
          <ModalPrinter
            setShowModal={setShowModal}
            isEditing={!!selectedPrinter}
            printer={selectedPrinter ?? undefined}
            updatePrinterList={loadPrinters}
          />
        )}

        {showDeleteModal && printerToDelete && (
          <ModalDeletePrinter
            printer={printerToDelete}
            showModal={setShowDeleteModal}
            updateList={loadPrinters}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PrinterList;
