"use client";
import { useEffect, useState } from "react";

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

  // 🔹 Busca dispositivos no backend (que está rodando no Docker)
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/devices");
        const data: Device[] = await res.json();

        // Separa computadores e impressoras
        setComputadores(data.filter((d) => d.tipo === "Computador"));
        setImpressoras(data.filter((d) => d.tipo === "Impressora"));
      } catch (error) {
        console.error("Erro ao buscar dispositivos:", error);
      }
    };

    fetchDevices();

    // Atualiza a cada 30 segundos automaticamente
    const interval = setInterval(fetchDevices, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-8 bg-white">
      {/* ================== Computadores ================== */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            💻 Computadores Ativos na Rede
          </h2>
        </div>
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="py-2 px-3">Nome</th>
              <th className="py-2 px-3">IP</th>
              <th className="py-2 px-3">MAC</th>
              <th className="py-2 px-3">Status</th>
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
                <td className="py-2 px-3">{pc.mac}</td>
                <td className="py-2 px-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      pc.status === "Ativo"
                        ? "bg-green-100 text-green-700 border border-green-300"
                        : "bg-red-100 text-red-700 border border-red-300"
                    }`}
                  >
                    {pc.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================== Impressoras ================== */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            🖨️ Impressoras Ativas na Rede
          </h2>
        </div>
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="py-2 px-3">Nome</th>
              <th className="py-2 px-3">IP</th>
              <th className="py-2 px-3">MAC</th>
              <th className="py-2 px-3">Status</th>
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
                <td className="py-2 px-3">{imp.mac}</td>
                <td className="py-2 px-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      imp.status === "Ativo"
                        ? "bg-green-100 text-green-700 border border-green-300"
                        : "bg-red-100 text-red-700 border border-red-300"
                    }`}
                  >
                    {imp.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
