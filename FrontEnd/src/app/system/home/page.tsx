"use client";
import { useEffect, useState } from "react";
import { getComputers } from "@/actions/computersAction";
import { CheckCircle, XCircle } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ====================================================================
// 🔹 NOVAS TIPAGENS DA API
// ====================================================================

// Tipo dos objetos dentro do array 'data' da API
type DeviceData = {
  id_computer: number | string;
  name_computer: string;
  // Use 'string' para o caso de ter valores como 'Compaq' que você mencionou
  type_computer: "Computador" | "Impressora" | string;
  ip_computer?: string; // Pode não existir na tabela 'computers' do banco
  mac_computer: string;
  asset_number: number;
  status_computer: 0 | 1; // 1 para Ativo, 0 para Inativo
  // Campos de saída/retorno não usados no Dashboard, mas mantidos para tipagem
  exit_date: string;
  reason: string;
  return_date: string;
};

// Tipo da resposta completa que a API retorna
type ApiResponse = {
  success: boolean;
  data: DeviceData[];
};

// 🔹 Tipo de dispositivo USADO NO ESTADO DO COMPONENTE
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

  // 🔹 Busca dispositivos usando a ação de gerenciamento (sem chamar a API diretamente)
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const rows = await getComputers();

        if (!rows || !Array.isArray(rows)) {
          console.error("getComputers retornou valor inválido:", rows);
          return;
        }

        // Mapeia (transforma) os dados do gerenciamento (rows) para o formato Device[]
        const mappedDevices: Device[] = rows.map((d: DeviceData) => ({
          id: String(d.id_computer),
          nome: d.name_computer,
          ip: d.ip_computer ?? "",
          mac: d.mac_computer,
          tipo: d.type_computer === "Impressora" ? "Impressora" : "Computador",
          status: d.status_computer === 1 ? "Ativo" : "Inativo",
        }));

        setComputadores(mappedDevices.filter((d) => d.tipo === "Computador"));
        setImpressoras(mappedDevices.filter((d) => d.tipo === "Impressora"));
      } catch (error) {
        console.error("Erro ao buscar dispositivos via getComputers:", error);
      }
    };

    fetchDevices();
    const interval = setInterval(fetchDevices, 30000);
    return () => clearInterval(interval);
  }, []);

  // 🔹 Dados para gráficos
  const ativosComputadores = computadores.filter(
    (c) => c.status === "Ativo"
  ).length;
  const inativosComputadores = computadores.filter(
    (c) => c.status === "Inativo"
  ).length;
  // Na Rede: conta computadores que têm IP (o valor c.ip não pode ser vazio/falso)
  const naRedeComputadores = computadores.filter((c) => c.ip).length;

  const ativosImpressoras = impressoras.filter(
    (i) => i.status === "Ativo"
  ).length;
  const inativosImpressoras = impressoras.filter(
    (i) => i.status === "Inativo"
  ).length;
  // Na Rede: conta impressoras que têm IP
  const naRedeImpressoras = impressoras.filter((i) => i.ip).length;

  const statusComputadoresData = [
    { name: "Ativos", value: ativosComputadores },
    { name: "Inativos", value: inativosComputadores },
  ];

  const statusImpressorasData = [
    { name: "Ativos", value: ativosImpressoras },
    { name: "Inativos", value: inativosImpressoras },
  ];

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard de Dispositivos</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow rounded-xl p-5 flex items-center justify-between border">
          <div>
            <p className="text-gray-600 text-sm">Computadores</p>
            <h2 className="text-2xl font-bold text-gray-800">{computadores.length}</h2>
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-5 flex items-center justify-between border">
          <div>
            <p className="text-gray-600 text-sm">Impressoras</p>
            <h2 className="text-2xl font-bold text-gray-800">{impressoras.length}</h2>
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-5 flex items-center justify-between border">
          <div>
            <p className="text-gray-600 text-sm">Na Rede</p>
            <h2 className="text-2xl font-bold text-gray-800">{naRedeComputadores + naRedeImpressoras}</h2>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white shadow rounded-xl p-6 border">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Status dos Computadores</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={statusComputadoresData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={5} dataKey="value">
                {statusComputadoresData.map((_, i) => (
                  <Cell key={`pc-${i}`} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white shadow rounded-xl p-6 border">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Status das Impressoras</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={statusImpressorasData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={5} dataKey="value">
                {statusImpressorasData.map((_, i) => (
                  <Cell key={`imp-${i}`} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Listas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg p-4 border">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Computadores</h2>
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="py-2 px-3">Nome</th>
                <th className="py-2 px-3">IP</th>
                <th className="py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {computadores.map((pc) => (
                <tr key={pc.id} className="border-b last:border-none hover:bg-gray-50">
                  <td className="py-2 px-3 font-medium">{pc.nome}</td>
                  <td className="py-2 px-3">{pc.ip || "-"}</td>
                  <td className="py-2 px-3">
                    {pc.status === "Ativo" ? (
                      <span className="flex items-center gap-1 text-green-600 text-sm"><CheckCircle size={16} /> Ativo</span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-600 text-sm"><XCircle size={16} /> Inativo</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/*Impressoras*/}
        <div className="bg-white shadow-md rounded-lg p-4 border">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Impressoras</h2>
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="py-2 px-3">Nome</th>
                <th className="py-2 px-3">IP</th>
                <th className="py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {impressoras.map((imp) => (
                <tr key={imp.id} className="border-b last:border-none hover:bg-gray-50">
                  <td className="py-2 px-3 font-medium">{imp.nome}</td>
                  <td className="py-2 px-3">{imp.ip || "-"}</td>
                  <td className="py-2 px-3">
                    {imp.status === "Ativo" ? (
                      <span className="flex items-center gap-1 text-green-600 text-sm"><CheckCircle size={16} /> Ativo</span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-600 text-sm"><XCircle size={16} /> Inativo</span>
                    )}
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