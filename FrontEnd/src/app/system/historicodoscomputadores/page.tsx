"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type Computer = {
  id: number;
  tipo: string;
  nome: string;
  mac: string;
  tombo: string;
  Problema: string;
  status: "Manutenção" | "Retirado";
  dataSaida: string | null;
  motivoSaida: string | null;
  dataRetorno: string | null;
};

// 🔹 Variants
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const modalAnim = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

const ComputerList = () => {
  const [computers] = useState<Computer[]>([
    {
      id: 1,
      tipo: "Positivo",
      nome: "One All in Positive 6200",
      mac: "00:1A:2B:3C:4D:5E",
      tombo: "9999",
      Problema: "Tela Azul",
      status: "Manutenção",
      dataSaida: null,
      motivoSaida: "Manutenção",
      dataRetorno: null,
    },
    {
      id: 2,
      tipo: "Compaq",
      nome: "One All in Compaq 5000",
      mac: "00:AA:BB:CC:DD:EE",
      tombo: "8888",
      Problema: "Placa Mãe Queimada",
      status: "Retirado",
      dataSaida: "29/02/2025",
      motivoSaida: "RETIRE",
      dataRetorno: null,
    },
  ]);

  const [selectedComputer, setSelectedComputer] =
    useState<Computer | null>(null);

  const getImage = (tipo: string) => {
    if (tipo.toLowerCase().includes("positivo")) return "/images/positivo.png";
    if (tipo.toLowerCase().includes("compaq")) return "/images/compaq.png";
    return "/images/default.png";
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-100 p-6 text-black"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      <motion.h1
        variants={fadeUp}
        className="text-2xl font-bold mb-6"
      >
        Histórico de Computadores
      </motion.h1>

      <motion.div
        variants={fadeUp}
        className="bg-white rounded-xl shadow p-6 border border-gray-200"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Histórico</h2>
          <Plus className="w-4 h-4 text-gray-600" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200">
            <thead>
              <tr className="bg-blue-50 text-sm">
                <th className="py-3 px-4">Tipo</th>
                <th className="py-3 px-4">Nome</th>
                <th className="py-3 px-4">MAC</th>
                <th className="py-3 px-4">Tombo</th>
                <th className="py-3 px-4">Problema</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>

            <motion.tbody
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="text-sm divide-y"
            >
              {computers.map((pc) => (
                <motion.tr
                  key={pc.id}
                  variants={fadeUp}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setSelectedComputer(pc)}
                  className="cursor-pointer hover:bg-blue-50/60"
                >
                  <td className="py-3 px-4">{pc.tipo}</td>
                  <td className="py-3 px-4">{pc.nome}</td>
                  <td className="py-3 px-4">{pc.mac}</td>
                  <td className="py-3 px-4">{pc.tombo}</td>
                  <td className="py-3 px-4">{pc.Problema}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        pc.status === "Manutenção"
                          ? "bg-yellow-200 text-yellow-700"
                          : "bg-red-300 text-red-800"
                      }`}
                    >
                      {pc.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>
      </motion.div>

      {/* 🔹 Modal */}
      <AnimatePresence>
        {selectedComputer && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              variants={modalAnim}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-2xl shadow-xl p-6 w-[420px] relative"
            >
              <motion.button
                whileHover={{ rotate: 90, scale: 1.2 }}
                onClick={() => setSelectedComputer(null)}
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
              >
                <X size={20} />
              </motion.button>

              <h2 className="text-center text-lg font-semibold mb-2">
                Histórico do Computador
              </h2>

              <p
                className={`text-center text-sm mb-4 ${
                  selectedComputer.motivoSaida === "Manutenção"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                Status: {selectedComputer.motivoSaida}
              </p>

              <motion.div
                className="flex justify-center mb-4"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
              >
                <Image
                  src={getImage(selectedComputer.tipo)}
                  alt={selectedComputer.tipo}
                  width={200}
                  height={150}
                  className="object-contain"
                />
              </motion.div>

              <div className="text-sm space-y-1">
                <p><strong>Computador:</strong> {selectedComputer.nome}</p>
                <p><strong>Tipo:</strong> {selectedComputer.tipo}</p>
                <p><strong>Tombo:</strong> {selectedComputer.tombo}</p>
                <p><strong>Problema:</strong> {selectedComputer.Problema}</p>
                <p><strong>MAC:</strong> {selectedComputer.mac}</p>
                <p><strong>Status:</strong> {selectedComputer.status}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ComputerList;
