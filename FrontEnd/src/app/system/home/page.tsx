"use client";

import { useEffect, useState } from "react";
import { Pencil, CheckCircle, XCircle } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Printer } from "@/types/types";
import { motion, AnimatePresence } from "framer-motion";
import { getPrinters } from "@/actions/printersAction";
import { getComputers } from "@/actions/computersAction";

type Device = {
  id: string;
  nome: string;
  ip: string;
  mac: string;
  tipo: "Computador" | "Impressora";
  tipoMaquina?: string;
  status: "Ativo" | "Inativo";
};

const COLORS = ["#22c55e", "#ef4444"];

export default function Dashboard() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [printers, setPrinters] = useState<Printer[]>([]);

  const fetchDevices = async () => {
    try {
      const computers = await getComputers();
      const data: Device[] = Array.isArray(computers)
        ? computers.map((c) => ({
            id: String(c.id_computer ?? c.asset_number),
            nome: c.name_computer ?? "",
            ip: "",
            mac: c.mac_computer ?? "",
            tipoMaquina: c.type_computer ?? "",
            tipo: "Computador",
            status: c.status_computer === 1 ? "Ativo" : "Inativo",
          }))
        : [];
      setDevices(data);
    } catch (error) {
      console.error("Erro ao buscar dispositivos:", error);
      setDevices([]);
    } finally {
      setLoading(false);
    }
  };

    const fetchPrinters = async () => {
      try {
        const data = await getPrinters();
        setPrinters(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erro ao buscar impressoras:", err);
        setPrinters([]);
      }
    };

  useEffect(() => {
    fetchDevices();
    fetchPrinters();
    const interval = setInterval(() => {
      fetchDevices();
      fetchPrinters();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const computadores = devices.filter((d) => d.tipo === "Computador");
  const ativos = computadores.filter((c) => c.status === "Ativo").length;
  const inativos = computadores.filter((c) => c.status === "Inativo").length;
  const impressoras = printers;

  const statusData = [
    { name: "Ativos", value: ativos },
    { name: "Inativos", value: inativos },
  ];

  const printersAtivos = impressoras.filter((p) => p.status_printer === 1)
    .length;
  const printersInativos = impressoras.length - printersAtivos;

  const printersStatusData = [
    { name: "Ativos", value: printersAtivos },
    { name: "Inativos", value: printersInativos },
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
          ["Inativos", inativos],
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
        <div className="bg-white shadow rounded-xl p-6 border">
          <h3 className="font-medium mb-3">Computadores (Ativos / Inativos)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={statusData} dataKey="value" innerRadius={55}>
                {statusData.map((_, i: number) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white shadow rounded-xl p-6 border">
          <h3 className="font-medium mb-3">Impressoras (Ativas / Inativas)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={printersStatusData} dataKey="value" innerRadius={55}>
                {printersStatusData.map((_, i: number) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
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
                  {i === 0
                    ? (list as Device[]).map((item) => (
                        <motion.tr key={item.id} className="border-b">
                          <td className="py-2">{item.nome}</td>
                          <td className="py-2">{item.tipoMaquina || "-"}</td>
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
                      ))
                    : (list as Printer[]).map((p) => (
                        <motion.tr key={p.id_printer ?? p.mac_printer} className="border-b">
                          <td className="py-2">{p.name_printer}</td>
                          <td className="py-2">{p.mac_printer}</td>
                          <td className="py-2">{p.reason || "-"}</td>
                          <td className="py-2">
                            {p.status_printer === 1 ? (
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
