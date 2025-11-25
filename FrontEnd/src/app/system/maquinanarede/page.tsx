"use client";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Monitor, Printer } from "lucide-react";

// Tipos para computadores e impressoras
type Device = {
  id: string;
  nome: string;
  ip: string;
  mac: string;
  tipo: "Computador" | "Impressora";
  status: "Ativo" | "Inativo";
};

export default function DevicesOnNetwork() {
  const [computadores, setComputadores] = useState<Device[]>([]);
  const [impressoras, setImpressoras] = useState<Device[]>([]);

  // 🔹 Busca dispositivos no backend
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

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* 🔹 Cabeçalho */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Dispositivos na Rede
        </h1>
        <p className="text-gray-600">
          Monitoramento de computadores e impressoras
        </p>
      </header>

      {/* 🔹 Cards Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow rounded-xl p-5 border flex items-center gap-4">
          <Monitor className="text-blue-600" size={28} />
          <div>
            <p className="text-gray-600 text-sm">Computadores</p>
            <h2 className="text-2xl font-bold text-gray-900">
              {computadores.length}
            </h2>
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-5 border flex items-center gap-4">
          <Printer className="text-purple-600" size={28} />
          <div>
            <p className="text-gray-600 text-sm">Impressoras</p>
            <h2 className="text-2xl font-bold text-gray-900">
              {impressoras.length}
            </h2>
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-5 border flex items-center gap-4">
          <CheckCircle className="text-green-600" size={28} />
          <div>
            <p className="text-gray-600 text-sm">Ativos</p>
            <h2 className="text-2xl font-bold text-gray-900">
              {computadores.filter((c) => c.status === "Ativo").length +
                impressoras.filter((i) => i.status === "Ativo").length}
            </h2>
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-5 border flex items-center gap-4">
          <XCircle className="text-red-600" size={28} />
          <div>
            <p className="text-gray-600 text-sm">Inativos</p>
            <h2 className="text-2xl font-bold text-gray-900">
              {computadores.filter((c) => c.status === "Inativo").length +
                impressoras.filter((i) => i.status === "Inativo").length}
            </h2>
          </div>
        </div>
      </div>

      {/* 🔹 Listas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ================== Computadores ================== */}
        <div className="bg-white shadow-md rounded-lg p-4 border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Computadores
          </h2>
          <table className="w-full border-collapse text-left bg-white text-gray-900 rounded-md overflow-hidden">
            <thead className="bg-gray-100">
              <tr className="border-b text-gray-700">
                <th className="py-2 px-3">Nome</th>
                <th className="py-2 px-3">IP</th>
                <th className="py-2 px-3">MAC</th>
                <th className="py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {computadores.map((pc, i) => (
                <tr
                  key={pc.id}
                  className={`border-b last:border-none ${
                    i % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-blue-50`}
                >
                  <td className="py-2 px-3 font-medium">{pc.nome}</td>
                  <td className="py-2 px-3">{pc.ip}</td>
                  <td className="py-2 px-3">{pc.mac}</td>
                  <td className="py-2 px-3">
                    {pc.status === "Ativo" ? (
                      <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                        <CheckCircle size={16} /> Ativo
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-600 text-sm font-medium">
                        <XCircle size={16} /> Inativo
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================== Impressoras ================== */}
        <div className="bg-white shadow-md rounded-lg p-4 border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Impressoras
          </h2>
          <table className="w-full border-collapse text-left bg-white text-gray-900 rounded-md overflow-hidden">
            <thead className="bg-gray-100">
              <tr className="border-b text-gray-700">
                <th className="py-2 px-3">Nome</th>
                <th className="py-2 px-3">IP</th>
                <th className="py-2 px-3">MAC</th>
                <th className="py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {impressoras.map((imp, i) => (
                <tr
                  key={imp.id}
                  className={`border-b last:border-none ${
                    i % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-purple-50`}
                >
                  <td className="py-2 px-3 font-medium">{imp.nome}</td>
                  <td className="py-2 px-3">{imp.ip}</td>
                  <td className="py-2 px-3">{imp.mac}</td>
                  <td className="py-2 px-3">
                    {imp.status === "Ativo" ? (
                      <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                        <CheckCircle size={16} /> Ativo
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-600 text-sm font-medium">
                        <XCircle size={16} /> Inativo
                      </span>
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
}

