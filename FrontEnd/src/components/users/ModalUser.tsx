import { User } from "@/types/types";
import { X } from "lucide-react";
import { useState } from "react";

type Props = {
  showModal: (value:boolean) => void;
  editingUser: boolean;
  user?: User
}

const ModalUser = ({showModal, editingUser, user}:Props) => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [position, setPosition] = useState<string>("");
  const [level, setLevel] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSave = async () => {
    console.log("Ação de salvar usuário");
  };
  return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-blue-700">
              {editingUser ? "Editar Usuário" : "Adicionar Usuário"}
            </h3>
            <button
              onClick={() => showModal(false)}
              className="hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 text-black">
            <input
              type="text"
              name="nome"
              placeholder="Nome"
              value={name}
              onChange={e => setName(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            />
            <input
              type="text"
              name="cargo"
              placeholder="Cargo"
              value={position}
              onChange={e => setPosition(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            />
            <input
              type="password"
              name="senha"
              placeholder="Digite uma senha"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            />
            <select
              name="permissao"
              value={level}
              onChange={e => setLevel(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
            <select
              name="status"
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="Ativo">Ativo</option>
              <option value="Desativado">Desativado</option>
            </select>
            {/*
            <input
              type="file"
              name="foto"
              accept="image/*"
              onChange={handleChange}
              className="file:mr-4 file:rounded-full file:border-0 file:bg-blue-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-violet-50 hover:file:bg-blue-700"
            />
            {formData.foto && (
              <img
                src={formData.foto}
                alt="Preview"
                className="w-20 h-20 rounded-full border object-cover mt-2"
              />
            )}*/}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => showModal(false)}
              className="px-4 py-2 border rounded-md text-black"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
  )
}

export default ModalUser;