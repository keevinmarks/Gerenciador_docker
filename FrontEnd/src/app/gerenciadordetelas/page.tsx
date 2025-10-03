"use client";
import { useState } from "react";
import { Plus, X, Pencil, Trash } from "lucide-react";

type Computer = {
  id: number;
  tipo: string;
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
  const [editingComputer, setEditingComputer] = useState<Computer | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [form, setForm] = useState<Computer>({
    id: Date.now(),
    tipo: "Positivo",
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

    if (editingComputer) {
      setComputers((prev) =>
        prev.map((pc) => (pc.id === editingComputer.id ? { ...form } : pc))
      );
      setEditingComputer(null);
    } else {
      setComputers([...computers, { ...form, id: Date.now() }]);
    }

    setShowModal(false);
    setForm({
      id: Date.now(),
      tipo: "Positivo",
      nome: "",
      mac: "",
      tombo: "",
      status: "Ativo",
      dataSaida: null,
      motivoSaida: null,
      dataRetorno: null,
    });
  };

  const handleEdit = (pc: Computer) => {
    setForm(pc);
    setEditingComputer(pc);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-2xl font-bold text-black mb-6">
        Gerenciamento de Computadores
      </h1>

      <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-700">
            Lista de Computadores
          </h2>
          <button
            onClick={() => {
              setEditingComputer(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Adicionar Computador
          </button>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-xs overflow-hidden">
            <thead>
              <tr className="bg-blue-50 text-left text-sm text-black">
                <th className="py-3 px-4 border-b">Tipo</th>
                <th className="py-3 px-4 border-b">Nome</th>
                <th className="py-3 px-4 border-b">MAC</th>
                <th className="py-3 px-4 border-b">Tombo</th>
                <th className="py-3 px-4 border-b">Status</th>
                <th className="py-3 px-4 border-b">Data Saída</th>
                <th className="py-3 px-4 border-b">Motivo</th>
                <th className="py-3 px-4 border-b">Data Retorno</th>
                <th className="py-3 px-4 border-b text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-200 text-black">
              {computers.map((pc) => (
                <tr key={pc.id} className="hover:bg-blue-50/40">
                  <td className="py-3 px-4">{pc.tipo}</td>
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
                  <td className="py-3 px-4 text-right flex gap-2 justify-end">
                    <button
                      onClick={() => handleEdit(pc)}
                      className="p-2 rounded-full hover:bg-blue-100"
                    >
                      <Pencil className="w-5 h-5 text-blue-600" />
                    </button>
                    <button
                      onClick={() => setDeleteId(pc.id)}
                      className="p-2 rounded-full hover:bg-red-100"
                    >
                      <Trash className="w-5 h-5 text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Adição/Edição */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-blue-700">
                {editingComputer ? "Editar Computador" : "Adicionar Computador"}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingComputer(null);
                }}
                className="hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <select
                name="tipo"
                value={form.tipo}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Positivo">Positivo</option>
                <option value="Compaq">Compaq</option>
              </select>

              <input
                type="text"
                name="nome"
                placeholder="Nome"
                value={form.nome}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />

              <input
                type="text"
                name="mac"
                placeholder="MAC Address"
                value={form.mac}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />

              <input
                type="text"
                name="tombo"
                placeholder="Tombo"
                value={form.tombo}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Ativo">Ativo</option>
                <option value="Desativado">Desativado</option>
              </select>

              <input
                type="date"
                name="dataSaida"
                value={form.dataSaida || ""}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

              <input
                type="text"
                name="motivoSaida"
                placeholder="Motivo da saída"
                value={form.motivoSaida || ""}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

              <input
                type="date"
                name="dataRetorno"
                value={form.dataRetorno || ""}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

              <div className="flex justify-end gap-3 text-black">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingComputer(null);
                  }}
                  className="px-4 py-2 border rounded-md text-black"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors"
                >
                  {editingComputer ? "Atualizar" : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-red-600 mb-4">
              Confirmar Exclusão
            </h3>
            <p className="text-sm text-gray-700 mb-6">
              Tem certeza que deseja excluir este computador?
              <br />
              <span className="font-semibold text-red-600">Consequências:</span>
              <br />-O computador será removido da lista.
              <br />-Essa ação não pode ser desfeita.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 border rounded-md text-black"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setComputers((prev) =>
                    prev.filter((pc) => pc.id !== deleteId)
                  );
                  setDeleteId(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComputerList;
