import { insertUsers, updateUsers } from "@/actions/userAction";
import { User } from "@/types/types";
import { X } from "lucide-react";
// NOVO: Importe 'ChangeEvent' para o input de arquivo
import { useEffect, useState, ChangeEvent } from "react";

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
  
  // NOVO: State para guardar o arquivo da imagem selecionada
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    if(editingUser && user){
      setName(user.user_name);
      setPosition(user.position);
      setEmail(user.email_user);
      setLevel(user.level_user === 2? "Administrador":"Usuário");
      setStatus(user.status_user === 1? "Ativo": "Desativado");
      setRePassword(user.reset_password === 1? true : false);
      // Não setamos a imagem aqui, pois o input de arquivo é 'uncontrolled'
      // O usuário terá que selecionar uma nova imagem se quiser alterar.
    }
  }, [editingUser, user]) // Adicionado dependências ao useEffect

  // NOVO: Handler para capturar a seleção do arquivo
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    } else {
      setImage(null);
    }
  };

  const handleSave = async () => {
    
    // MODIFICADO: A lógica agora usa FormData em vez de um objeto JSON.
    
    if(!editingUser){
      // --- Bloco de CRIAÇÃO ---
      
      // MODIFICADO: Validação direta dos states
      if (!name || !position || !email || !status || !level || !password) {
        alert("Preencha todos os campos obrigatórios");
        return;
      }

      // MODIFICADO: Criar FormData
      const formData = new FormData();
      formData.append("user_name", name);
      formData.append("position", position);
      formData.append("email_user", email);
      formData.append("status_user", status === 'Ativo' ? "1" : "0");
      formData.append("level_user", level === "Administrador" ? "2" : "1");
      formData.append("password_user", password);
      formData.append("reset_password", repassword ? "1" : "0");
      
      // NOVO: Adicionar a imagem se ela existir
      if (image) {
        formData.append("avatar", image); // 'avatar' é o nome do campo
      }

      await insertUsers(formData); // Envia FormData

    } else {
      // --- Bloco de ATUALIZAÇÃO ---
      
      // Validação (senha não é obrigatória aqui)
      if (!name || !position || !email || !status || !level) {
        alert("Preencha todos os campos obrigatórios (nome, cargo, email, nível, status).");
        return;
      }

      // MODIFICADO: Criar FormData
      const formData = new FormData();

      // Adiciona o ID para o backend saber quem atualizar
      if (user?.id) {
        formData.append("id", user.id.toString());
      }
      formData.append("user_name", name);
      formData.append("position", position);
      formData.append("email_user", email);
      formData.append("status_user", status === "Ativo" ? "1" : "0");
      formData.append("level_user", level === "Administrador" ? "2" : "1");
      formData.append("reset_password", repassword ? "1" : "0");

      // Adiciona a senha APENAS se foi preenchida
      if (password && password.trim() !== "") {
        formData.append("password_user", password);
      }
      
      // NOVO: Adicionar a imagem se ela existir
      if (image) {
        formData.append("avatar", image);
      }

      await updateUsers(formData); // Envia FormData
    }
    
    // Este código é executado para ambos (criação e atualização)
    await getUsers();
    showModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
      {/* MODIFICADO: Adicionado 'overflow-y-auto' ao container e 'my-8' ao modal para permitir scroll */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg my-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-blue-700">
            {editingUser ? "Editar Usuário" : "Adicionar Usuário"}
          </h3>
          <button onClick={() => showModal(false)} className="hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 text-black">
          {/* ... (inputs de name, cargo, email, senha) ... */}
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
              placeholder={editingUser? "Alterar senha" : "Senha"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            />
          {/* ... (selects de permissao e status) ... */}
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
          {/* ... (checkbox de repassword) ... */}
            <div className="flex flex-row gap-3 w-full justify-center">
              <input type="checkbox" className="h-6 w-6" checked={repassword} onChange={e => setRePassword(e.target.checked)}/>
              <div>O usuário deve alterar a senha no próximo login</div>
            </div>
          
          {/* NOVO: Input de arquivo para a foto de perfil */}
          <div className="flex flex-col gap-1">
            <label htmlFor="foto" className="text-sm font-medium text-gray-700">
              Foto de Perfil (Opcional)
            </label>
            <input
              id="foto"
              type="file"
              name="avatar"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileChange}
              className="file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
          </div>
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