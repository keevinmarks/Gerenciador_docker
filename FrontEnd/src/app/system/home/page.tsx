"use client";
import { useEffect, useState } from "react";
import { Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

// 🔹 Tipo de dispositivo
type Device = {
  id: string;
  nome: string;
  ip: string;
  mac: string;
  tipo: "Computador" | "Impressora";
  status: "Ativo" | "Inativo";
};

// 🔹 Cores usadas nos gráficos
const COLORS = ["#22c55e", "#ef4444", "#3b82f6"]; // Verde, Vermelho, Azul

const Dashboard = () => {
  const [computadores, setComputadores] = useState<Device[]>([]);
  const [impressoras, setImpressoras] = useState<Device[]>([]);

  // 🔹 Busca dispositivos da API
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/devices");
        const data: Device[] = await res.json();

        setComputadores(data.filter((d) => d.tipo === "Computador"));
        setImpressoras(data.filter((d) => d.tipo === "Impressora"));
      } catch (error) {
        console.error("Erro ao buscar dispositivos:", error);
      }
    };

    fetchDevices();
    const interval = setInterval(fetchDevices, 30000);
    return () => clearInterval(interval);
  }, []);

  // 🔹 Dados para gráficos
  const ativos = computadores.filter((c) => c.status === "Ativo").length;
  const inativos = computadores.filter((c) => c.status === "Inativo").length;
  const naRede = computadores.filter((c) => c.ip).length; // supondo que IP definido = está na rede

  const statusData = [
    { name: "Ativos", value: ativos },
    { name: "Inativos", value: inativos },
  ];

  const redeData = [
    { name: "Na Rede", value: naRede },
    { name: "Fora da Rede", value: computadores.length - naRede },
  ];

  return (
    <div className="min-h-screen bg-white p-6">
      {/* ================== Cabeçalho ================== */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Dashboard de Dispositivos
      </h1>

      {/* ================== Cards de Estatísticas ================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card Computadores */}
        <div className="bg-white shadow rounded-xl p-5 flex items-center justify-between border">
          <div>
            <p className="text-gray-600 text-sm">Computadores</p>
            <h2 className="text-2xl font-bold text-gray-800">
              {computadores.length}
            </h2>
          </div>
        </div>

        {/* Card Impressoras */}
        <div className="bg-white shadow rounded-xl p-5 flex items-center justify-between border">
          <div>
            <p className="text-gray-600 text-sm">Impressoras</p>
            <h2 className="text-2xl font-bold text-gray-800">
              {impressoras.length}
            </h2>
          </div>
        </div>

        {/* Card Na Rede */}
        <div className="bg-white shadow rounded-xl p-5 flex items-center justify-between border">
          <div>
            <p className="text-gray-600 text-sm">Na Rede</p>
            <h2 className="text-2xl font-bold text-gray-800">{naRede}</h2>
          </div>
        </div>
      </div>

      {/* ================== Gráficos ================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Status dos Computadores */}
        <div className="bg-white shadow rounded-xl p-6 border">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Status dos Computadores
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Computadores na Rede */}
        <div className="bg-white shadow rounded-xl p-6 border">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Computadores na Rede
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={redeData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {redeData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================== Listas ================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lista de Computadores */}
        <div className="bg-white shadow-md rounded-lg p-4 border">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            Computadores
          </h2>
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="py-2 px-3">Nome</th>
                <th className="py-2 px-3">IP</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {computadores.map((pc) => (
                <tr
                  key={pc.id}
                  className="border-b last:border-none hover:bg-gray-50"
                >
                  <td className="py-2 px-3 font-medium">{pc.nome}</td>
                  <td className="py-2 px-3">{pc.ip}</td>
                  <td className="py-2 px-3">
                    {pc.status === "Ativo" ? (
                      <span className="flex items-center gap-1 text-green-600 text-sm">
                        <CheckCircle size={16} /> Ativo
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-600 text-sm">
                        <XCircle size={16} /> Inativo
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-right flex gap-2 justify-end">
                    <button className="p-1 text-blue-600 hover:text-blue-800">
                      <Pencil size={18} />
                    </button>
                    <button className="p-1 text-red-600 hover:text-red-800">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Lista de Impressoras */}
        <div className="bg-white shadow-md rounded-lg p-4 border">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            Impressoras
          </h2>
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="py-2 px-3">Nome</th>
                <th className="py-2 px-3">IP</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {impressoras.map((imp) => (
                <tr
                  key={imp.id}
                  className="border-b last:border-none hover:bg-gray-50"
                >
                  <td className="py-2 px-3 font-medium">{imp.nome}</td>
                  <td className="py-2 px-3">{imp.ip}</td>
                  <td className="py-2 px-3">
                    {imp.status === "Ativo" ? (
                      <span className="flex items-center gap-1 text-green-600 text-sm">
                        <CheckCircle size={16} /> Ativo
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-600 text-sm">
                        <XCircle size={16} /> Inativo
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-right flex gap-2 justify-end">
                    <button className="p-1 text-blue-600 hover:text-blue-800">
                      <Pencil size={18} />
                    </button>
                    <button className="p-1 text-red-600 hover:text-red-800">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
