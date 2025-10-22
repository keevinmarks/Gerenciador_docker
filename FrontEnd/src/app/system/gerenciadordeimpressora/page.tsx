"use client";
import { useState } from "react";
import { Pencil, Trash, X, Plus } from "lucide-react";

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
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [formData, setFormData] = useState<Omit<Printer, "id">>({
    nome: "",
    mac: "",
    tombo: "",
    status: "Ativo",
    dataSaida: "",
    motivoSaida: "",
    dataVolta: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Novo estado para confirmar exclusão
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSavePrinter = () => {
    if (!formData.nome || !formData.mac || !formData.tombo) {
      alert("Preencha pelo menos Nome, MAC e Tombo.");
      return;
    }

    if (editingId) {
      // Atualiza impressora existente
      setPrinters((prev) =>
        prev.map((printer) =>
          printer.id === editingId ? { ...printer, ...formData } : printer
        )
      );
      setEditingId(null);
    } else {
      // Adiciona nova impressora
      const newPrinter: Printer = {
        id: String(Date.now()),
        ...formData,
      };
      setPrinters((prev) => [...prev, newPrinter]);
    }

    // Limpa formulário
    setFormData({
      nome: "",
      mac: "",
      tombo: "",
      status: "Ativo",
      dataSaida: "",
      motivoSaida: "",
      dataVolta: "",
    });
    setShowModal(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      setPrinters((prev) => prev.filter((p) => p.id !== deleteId));
      setDeleteId(null);
    }
  };

  const handleEdit = (printer: Printer) => {
    const { id, ...rest } = printer;
    setFormData(rest);
    setEditingId(id);
    setShowModal(true);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
        Gerenciamento de Impressoras
      </h1>

      {/* Botão para abrir modal */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => {
            setFormData({
              nome: "",
              mac: "",
              tombo: "",
              status: "Ativo",
              dataSaida: "",
              motivoSaida: "",
              dataVolta: "",
            });
            setEditingId(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          <Plus className="w-5 h-5" />
          Adicionar Impressora
        </button>
      </div>

      {/* Lista de Impressoras */}
      <div className="bg-white shadow-lg rounded-xl p-6 border border-blue-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Lista de Impressoras
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-blue-50 text-gray-800">
                <th className="py-2 px-3">Nome</th>
                <th className="py-2 px-3">MAC</th>
                <th className="py-2 px-3">Tombo</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Data Saída</th>
                <th className="py-2 px-3">Motivo Saída</th>
                <th className="py-2 px-3">Data Volta</th>
                <th className="py-2 px-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {printers.map((printer) => (
                <tr
                  key={printer.id}
                  className="border-b hover:bg-blue-50 transition text-gray-800"
                >
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
                  <td className="py-2 px-3 text-center flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(printer)}
                      className="p-2 rounded-full hover:bg-blue-100"
                    >
                      <Pencil className="w-5 h-5 text-blue-600" />
                    </button>
                    <button
                      onClick={() => setDeleteId(printer.id)}
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

      {/* Modal de Cadastro/Edição */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-200/70 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-blue-700">
                {editingId ? "Editar Impressora" : "Adicionar Impressora"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800">
              <input
                type="text"
                name="nome"
                placeholder="Nome da Impressora"
                value={formData.nome}
                onChange={handleChange}
                className="border border-blue-200 rounded-lg px-3 py-2 w-full focus:ring-blue-400"
              />
              <input
                type="text"
                name="mac"
                placeholder="MAC Address"
                value={formData.mac}
                onChange={handleChange}
                className="border border-blue-200 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                name="tombo"
                placeholder="Tombo (Patrimônio)"
                value={formData.tombo}
                onChange={handleChange}
                className="border border-blue-200 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400"
              />
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="border border-blue-200 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400"
              >
                <option value="Ativo">Ativo</option>
                <option value="Desativado">Desativado</option>
              </select>
              <input
                type="date"
                name="dataSaida"
                value={formData.dataSaida}
                onChange={handleChange}
                className="border border-blue-200 rounded-lg px-3 py-2 w-full focus:ring-blue-400"
              />
              <input
                type="text"
                name="motivoSaida"
                placeholder="Motivo da saída"
                value={formData.motivoSaida}
                onChange={handleChange}
                className="border border-blue-200 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="date"
                name="dataVolta"
                value={formData.dataVolta}
                onChange={handleChange}
                className="border border-blue-200 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded-md text-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={handleSavePrinter}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {deleteId && (
        <div className="fixed inset-0 bg-gray-200/70 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold text-red-600 mb-4">
              Confirmar exclusão
            </h3>
            <p className="text-gray-700 mb-6">
              Deseja realmente apagar esta impressora? <br />
              <span className="text-red-500 font-medium">
                Essa ação não pode ser desfeita.
              </span>
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 border rounded-md text-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Apagar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
