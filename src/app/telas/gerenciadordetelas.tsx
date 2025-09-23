"use client";
import { useState } from "react";
import { MoreHorizontal, Plus, X } from "lucide-react";

type Computer = {
  id: number;
  nome: string;
  mac: string;
  tombo: string;
  status: "Ativo" | "Desativado";
  dataSaida: string | null;
  motivoSaida: string | null;
  dataRetorno: string | null;
};

const ComputerList = () => {
  const [computers, setComputers] = useState<Computer[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState<Computer>({
    id: Date.now(),
    nome: "",
    mac: "",
    tombo: "",
    status: "Ativo",
    dataSaida: null,
    motivoSaida: null,
    dataRetorno: null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setComputers([...computers, { ...form, id: Date.now() }]);
    setShowModal(false);
    setForm({
      id: Date.now(),
      nome: "",
      mac: "",
      tombo: "",
      status: "Ativo",
      dataSaida: null,
      motivoSaida: null,
      dataRetorno: null,
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Gerenciamento de Computadores
      </h1>

      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-700">
            Lista de Computadores
          </h2>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
          >
            <Plus className="w-4 h-4" />
            Adicionar Computador
          </button>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 text-left text-sm text-gray-600">
                <th className="py-3 px-4">Nome</th>
                <th className="py-3 px-4">MAC</th>
                <th className="py-3 px-4">Tombo</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Data Saída</th>
                <th className="py-3 px-4">Motivo</th>
                <th className="py-3 px-4">Data Retorno</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-200">
              {computers.map((pc) => (
                <tr key={pc.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">{pc.nome}</td>
                  <td className="py-3 px-4">{pc.mac}</td>
                  <td className="py-3 px-4">{pc.tombo}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        pc.status === "Ativo"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {pc.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">{pc.dataSaida || "N/A"}</td>
                  <td className="py-3 px-4">{pc.motivoSaida || "N/A"}</td>
                  <td className="py-3 px-4">{pc.dataRetorno || "N/A"}</td>
                  <td className="py-3 px-4 text-right">
                    <button className="p-2 rounded-full hover:bg-gray-100">
                      <MoreHorizontal className="w-5 h-5 text-gray-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Adicionar */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Adicionar Computador</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="nome"
                placeholder="Nome"
                value={form.nome}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
                required
              />
              <input
                type="text"
                name="mac"
                placeholder="MAC Address"
                value={form.mac}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
                required
              />
              <input
                type="text"
                name="tombo"
                placeholder="Tombo"
                value={form.tombo}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
                required
              />
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="Ativo">Ativo</option>
                <option value="Desativado">Desativado</option>
              </select>
              <input
                type="date"
                name="dataSaida"
                value={form.dataSaida || ""}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
              />
              <input
                type="text"
                name="motivoSaida"
                placeholder="Motivo da saída"
                value={form.motivoSaida || ""}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
              />
              <input
                type="date"
                name="dataRetorno"
                value={form.dataRetorno || ""}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-md"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComputerList;
