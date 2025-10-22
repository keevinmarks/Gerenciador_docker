"use client";
import { useState } from "react";
import { Plus, X } from "lucide-react";
import Image from "next/image";
import positivoImg from "@/img/positivo.png";
import compaqImg from "@/img/compaq.png";
import backgroundImg from "@/img/Background.png";


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

  const [selectedComputer, setSelectedComputer] = useState<Computer | null>(
    null
  );

  // Ajuste: caminhos relativos à pasta /public
  const getImage = (tipo: string) => {
    if (tipo.toLowerCase().includes("positivo")) {
      return "/images/positivo.png";
    } else if (tipo.toLowerCase().includes("compaq")) {
      return "/images/compaq.png";
    } else {
      return "/images/default.png";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-black">
      <h1 className="text-2xl font-bold mb-6">Histórico de Computadores</h1>

      <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Histórico</h2>
          <Plus className="w-4 h-4 text-gray-600" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-sm overflow-hidden">
            <thead>
              <tr className="bg-blue-50 text-left text-sm text-black">
                <th className="py-3 px-4 border-b">Tipo</th>
                <th className="py-3 px-4 border-b">Nome</th>
                <th className="py-3 px-4 border-b">MAC</th>
                <th className="py-3 px-4 border-b">Tombo</th>
                <th className="py-3 px-4 border-b">Problema</th>
                <th className="py-3 px-4 border-b">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-200">
              {computers.map((pc) => (
                <tr
                  key={pc.id}
                  onClick={() => setSelectedComputer(pc)}
                  className="hover:bg-blue-50/60 cursor-pointer transition-colors"
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de detalhes */}
      {selectedComputer && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-[420px] relative text-black animate-fadeIn">
            <button
              onClick={() => setSelectedComputer(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition"
            >
              <X size={20} />
            </button>

            <h2 className="text-center text-lg font-semibold mb-1">
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

            <div className="flex justify-center mb-4">
              <Image
                src={getImage(selectedComputer.tipo)}
                alt={selectedComputer.tipo}
                width={200}
                height={150}
                className="object-contain"
              />
            </div>

            <div className="text-sm space-y-1">
              <p>
                <strong>Computador:</strong> {selectedComputer.nome}
              </p>
              <p>
                <strong>Tipo:</strong> {selectedComputer.tipo}
              </p>
              <p>
                <strong>Tombo:</strong> {selectedComputer.tombo}
              </p>
              <p>
                <strong>Problema:</strong> {selectedComputer.Problema}
              </p>
              <p>
                <strong>MAC:</strong> {selectedComputer.mac}
              </p>
              <p>
                <strong>Status:</strong> {selectedComputer.status}
              </p>
            </div>

            <div className="mt-4 text-sm">
              <strong>Observação:</strong>
              <p className="text-justify mt-1 text-gray-700">
                Foi realizada manutenção preventiva e corretiva no computador
                com tombo {selectedComputer.tombo}, endereço MAC{" "}
                {selectedComputer.mac}. As atividades incluíram limpeza interna,
                verificação de hardware e reinstalação do sistema operacional. O
                equipamento foi testado e está funcionando normalmente.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComputerList;
