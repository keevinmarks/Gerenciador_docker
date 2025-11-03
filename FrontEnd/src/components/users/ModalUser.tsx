import { insertUsers } from "@/actions/userAction";
import { User } from "@/types/types";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  showModal: (value:boolean) => void;
  editingUser: boolean;
  user?: User;
  getUsers: () => void;
}

const ModalUser = ({showModal, editingUser, user, getUsers}:Props) => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [position, setPosition] = useState<string>("");
  const [level, setLevel] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [repassword, setRePassword] = useState<boolean>(false);

  useEffect(() => {
    if(editingUser && user){
      setName(user.user_name);
      setPosition(user.position);
      setEmail(user.email_user);
      setLevel(user.level_user === 2? "Admin":"User");
      setStatus(user.status_user === 1? "Ativo": "Desativado");
      setRePassword(user.reset_password === 1);
    }
  }, [])
  const handleSave = async () => {
    if(!editingUser){
      const user = {
        user_name: name,
        position: position,
        email_user: email,
        status_user: status === 'Ativo'? 1 : 0,
        level_user: level === "Administrador"? 2 : 1,
        password_user: password,
        reset_password: repassword? 1 : 0
      }

      const values = Object.values(user);

      const hasEmptyField = values.some(value => value === undefined || value === null || value === "");

      if(hasEmptyField){
        alert("Preencha todos os campos");
        return;
      }

      await insertUsers(user);
      await getUsers();
      showModal(false);
    }
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
              <option value="" disabled>Nível de acesso</option>
              <option value="Usuário">Usuário</option>
              <option value="Administrador">Administrador</option>
            </select>
            <select
              name="status"
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="" disabled>Status</option>
              <option value="Ativo">Ativo</option>
              <option value="Desativado">Desativado</option>
            </select>
            <div className="flex flex-row gap-3 w-full justify-center">
              <input type="checkbox" className="h-6 w-6" checked={repassword} onChange={e => setRePassword(e.target.checked)}/>
              <div>O usuário deve alterar a senha no próximo login</div>
            </div>
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
              className="px-4 py-2 border rounded-md text-black cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
            >
              {editingUser? "Salvar" : "Adicionar"}
            </button>
          </div>
        </div>
      </div>
  )
}

export default ModalUser;