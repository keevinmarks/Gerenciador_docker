"use client";
import { useState } from "react";

type Printer = {
  id: string;
  nome: string;
  mac: string;
  tombo: string;
  status: "Ativo" | "Desativado";
  dataSaida: string;
  motivoSaida: string;
  dataVolta: string;
};

export default function PrinterManager() {
  const [printers, setPrinters] = useState<Printer[]>([
    {
      id: "1",
      nome: "HP LaserJet Pro",
      mac: "00:1A:2B:3C:4D:5E",
      tombo: "IMP-00031",
      status: "Ativo",
      dataSaida: "",
      motivoSaida: "",
      dataVolta: "",
    },
  ]);

  const [formData, setFormData] = useState<Omit<Printer, "id">>({
    nome: "",
    mac: "",
    tombo: "",
    status: "Ativo",
    dataSaida: "",
    motivoSaida: "",
    dataVolta: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPrinter = () => {
    if (!formData.nome || !formData.mac || !formData.tombo) {
      alert("Preencha pelo menos Nome, MAC e Tombo.");
      return;
    }

    const newPrinter: Printer = {
      id: String(Date.now()),
      ...formData,
    };

    setPrinters((prev) => [...prev, newPrinter]);

    // Limpa o formulário
    setFormData({
      nome: "",
      mac: "",
      tombo: "",
      status: "Ativo",
      dataSaida: "",
      motivoSaida: "",
      dataVolta: "",
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Gerenciamento de Impressoras
      </h1>

      {/* Formulário */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Adicionar Impressora</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="nome"
            placeholder="Nome"
            value={formData.nome}
            onChange={handleChange}
            className="border rounded-md px-3 py-2 w-full"
          />
          <input
            type="text"
            name="mac"
            placeholder="MAC Address"
            value={formData.mac}
            onChange={handleChange}
            className="border rounded-md px-3 py-2 w-full"
          />
          <input
            type="text"
            name="tombo"
            placeholder="Tombo"
            value={formData.tombo}
            onChange={handleChange}
            className="border rounded-md px-3 py-2 w-full"
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border rounded-md px-3 py-2 w-full"
          >
            <option value="Ativo">Ativo</option>
            <option value="Desativado">Desativado</option>
          </select>
          <input
            type="date"
            name="dataSaida"
            value={formData.dataSaida}
            onChange={handleChange}
            className="border rounded-md px-3 py-2 w-full"
          />
          <input
            type="text"
            name="motivoSaida"
            placeholder="Motivo da saída"
            value={formData.motivoSaida}
            onChange={handleChange}
            className="border rounded-md px-3 py-2 w-full"
          />
          <input
            type="date"
            name="dataVolta"
            value={formData.dataVolta}
            onChange={handleChange}
            className="border rounded-md px-3 py-2 w-full"
          />
        </div>
        <button
          onClick={handleAddPrinter}
          className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition"
        >
          ➕ Adicionar Impressora
        </button>
      </div>

      {/* Lista de Impressoras */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Lista de Impressoras</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="py-2 px-3">Nome</th>
                <th className="py-2 px-3">MAC</th>
                <th className="py-2 px-3">Tombo</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Data Saída</th>
                <th className="py-2 px-3">Motivo Saída</th>
                <th className="py-2 px-3">Data Volta</th>
              </tr>
            </thead>
            <tbody>
              {printers.map((printer) => (
                <tr key={printer.id} className="border-b last:border-none">
                  <td className="py-2 px-3">{printer.nome}</td>
                  <td className="py-2 px-3">{printer.mac}</td>
                  <td className="py-2 px-3">{printer.tombo}</td>
                  <td className="py-2 px-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        printer.status === "Ativo"
                          ? "bg-green-100 text-green-700 border border-green-300"
                          : "bg-red-100 text-red-700 border border-red-300"
                      }`}
                    >
                      {printer.status}
                    </span>
                  </td>
                  <td className="py-2 px-3">{printer.dataSaida || "N/A"}</td>
                  <td className="py-2 px-3">{printer.motivoSaida || "N/A"}</td>
                  <td className="py-2 px-3">{printer.dataVolta || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
