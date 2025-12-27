"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

type Device = {
  id: string;
  nome: string;
  ip: string;
  mac: string;
  tipo: "Computador" | "Impressora";
  status: "Ativo" | "Inativo";
};

const COLORS = ["#22c55e", "#ef4444"];

export default function Dashboard() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const res = await fetch("/api/devices", { cache: "no-store" });
        const data: Device[] = await res.json();
        setDevices(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erro ao buscar dispositivos:", error);
        setDevices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
    const interval = setInterval(fetchDevices, 30000);
    return () => clearInterval(interval);
  }, []);

  const computadores = devices.filter((d) => d.tipo === "Computador");
  const impressoras = devices.filter((d) => d.tipo === "Impressora");

  const ativos = computadores.filter((c) => c.status === "Ativo").length;
  const inativos = computadores.filter((c) => c.status === "Inativo").length;
  const naRede = computadores.filter((c) => c.ip).length;

  const statusData = [
    { name: "Ativos", value: ativos },
    { name: "Inativos", value: inativos },
  ];

  const redeData = [
    { name: "Na Rede", value: naRede },
    { name: "Fora da Rede", value: computadores.length - naRede },
  ];

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Carregando dashboard...
      </div>
    );
  }

  return (
    <motion.div className="p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">
        Dashboard de Dispositivos
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          ["Computadores", computadores.length],
          ["Impressoras", impressoras.length],
          ["Ativos", ativos],
          ["Na Rede", naRede],
        ].map(([label, value]) => (
          <div
            key={label}
            className="bg-white shadow rounded-xl p-5 border"
          >
            <p className="text-sm text-gray-600">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {[statusData, redeData].map((data, i) => (
          <div
            key={i}
            className="bg-white shadow rounded-xl p-6 border"
          >
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={data} dataKey="value" innerRadius={55}>
                  {data.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>

      {/* Tabelas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[computadores, impressoras].map((list, i) => (
          <div key={i} className="bg-white shadow p-4 border rounded-lg">
            <h2 className="font-semibold mb-4">
              {i === 0 ? "Computadores" : "Impressoras"}
            </h2>
            <table className="w-full text-sm">
              <tbody>
                <AnimatePresence>
                  {list.map((item) => (
                    <motion.tr key={item.id} className="border-b">
                      <td className="py-2">{item.nome}</td>
                      <td className="py-2">{item.ip || "-"}</td>
                      <td className="py-2">
                        {item.status === "Ativo" ? (
                          <span className="text-green-600 flex items-center gap-1">
                            <CheckCircle size={16} /> Ativo
                          </span>
                        ) : (
                          <span className="text-red-600 flex items-center gap-1">
                            <XCircle size={16} /> Inativo
                          </span>
                        )}
                      </td>
                      <td className="py-2 text-right">
                        <Pencil size={16} />
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
