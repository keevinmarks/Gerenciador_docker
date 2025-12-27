"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Monitor, Printer } from "lucide-react";
import { motion } from "framer-motion";

type Device = {
  id: string;
  nome: string;
  ip: string;
  mac: string;
  tipo: "Computador" | "Impressora";
  status: "Ativo" | "Inativo";
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function DevicesOnNetwork() {
  const [computadores, setComputadores] = useState<Device[]>([]);
  const [impressoras, setImpressoras] = useState<Device[]>([]);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/devices");
        const data: Device[] = await res.json();
        setComputadores(data.filter((d) => d.tipo === "Computador"));
        setImpressoras(data.filter((d) => d.tipo === "Impressora"));
      } catch (error) {
        console.error(error);
      }
    };

    fetchDevices();
    const interval = setInterval(fetchDevices, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="p-6 bg-white min-h-screen"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      <motion.header variants={fadeUp} className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Dispositivos na Rede
        </h1>
        <p className="text-gray-600">
          Monitoramento de computadores e impressoras
        </p>
      </motion.header>

      <motion.div
        variants={stagger}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
      >
        {[
          {
            label: "Computadores",
            value: computadores.length,
            icon: <Monitor className="text-blue-600" size={28} />,
          },
          {
            label: "Impressoras",
            value: impressoras.length,
            icon: <Printer className="text-purple-600" size={28} />,
          },
          {
            label: "Ativos",
            value:
              computadores.filter((c) => c.status === "Ativo").length +
              impressoras.filter((i) => i.status === "Ativo").length,
            icon: <CheckCircle className="text-green-600" size={28} />,
          },
          {
            label: "Inativos",
            value:
              computadores.filter((c) => c.status === "Inativo").length +
              impressoras.filter((i) => i.status === "Inativo").length,
            icon: <XCircle className="text-red-600" size={28} />,
          },
        ].map((card, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            whileHover={{ scale: 1.04 }}
            className="bg-white shadow rounded-xl p-5 border flex items-center gap-4"
          >
            {card.icon}
            <div>
              <p className="text-gray-600 text-sm">{card.label}</p>
              <h2 className="text-2xl font-bold text-gray-900">
                {card.value}
              </h2>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        variants={stagger}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* COMPUTADORES */}
        <motion.div
          variants={fadeUp}
          className="bg-white shadow-md rounded-lg p-4 border"
        >
          <h2 className="text-lg font-semibold mb-4">Computadores</h2>

          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-3">Nome</th>
                <th className="py-2 px-3">IP</th>
                <th className="py-2 px-3">MAC</th>
                <th className="py-2 px-3">Status</th>
              </tr>
            </thead>

            <motion.tbody variants={stagger}>
              {computadores.map((pc, i) => (
                <motion.tr
                  key={pc.id}
                  variants={fadeUp}
                  whileHover={{ scale: 1.01 }}
                  className={`border-b ${
                    i % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="py-2 px-3 font-medium">{pc.nome}</td>
                  <td className="py-2 px-3">{pc.ip}</td>
                  <td className="py-2 px-3">{pc.mac}</td>
                  <td className="py-2 px-3">
                    {pc.status === "Ativo" ? (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle size={16} /> Ativo
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-600">
                        <XCircle size={16} /> Inativo
                      </span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </motion.div>

        {/* IMPRESSORAS */}
        <motion.div
          variants={fadeUp}
          className="bg-white shadow-md rounded-lg p-4 border"
        >
          <h2 className="text-lg font-semibold mb-4">Impressoras</h2>

          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-3">Nome</th>
                <th className="py-2 px-3">IP</th>
                <th className="py-2 px-3">MAC</th>
                <th className="py-2 px-3">Status</th>
              </tr>
            </thead>

            <motion.tbody variants={stagger}>
              {impressoras.map((imp, i) => (
                <motion.tr
                  key={imp.id}
                  variants={fadeUp}
                  whileHover={{ scale: 1.01 }}
                  className={`border-b ${
                    i % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="py-2 px-3 font-medium">{imp.nome}</td>
                  <td className="py-2 px-3">{imp.ip}</td>
                  <td className="py-2 px-3">{imp.mac}</td>
                  <td className="py-2 px-3">
                    {imp.status === "Ativo" ? (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle size={16} /> Ativo
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-600">
                        <XCircle size={16} /> Inativo
                      </span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
