// use fetch to call the app API routes for file uploads
import { addUserHistory, type UserHistWithActor } from "@/actions/historyAction";
import { User } from "@/types/types";
import { X } from "lucide-react";
import { useEffect, useState, ChangeEvent } from "react";
import { motion } from "framer-motion";
import { useUser } from "@/contexts/UserContext";

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
  const [prevStatus, setPrevStatus] = useState<number | null>(null);
  const [password, setPassword] = useState<string>("");
  const [repassword, setRePassword] = useState<boolean>(false);
  
  // NOVO: State para guardar o arquivo da imagem selecionada
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { user: actor } = useUser();

  useEffect(() => {
    if(editingUser && user){
      setName(user.user_name);
      setPosition(user.position);
      setEmail(user.email_user);
      setLevel(user.level_user === 2? "Administrador":"Usuário");
      setStatus(user.status_user === 1? "Ativo": "Desativado");
  setPrevStatus(user.status_user ?? null);
      setRePassword(user.reset_password === 1? true : false);
      // Se houver uma imagem existente do usuário, mostre como preview
      const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
      if (user.path_img) {
        setImagePreview(user.path_img.startsWith("http") ? user.path_img : `/api/uploads?path=${encodeURIComponent(user.path_img)}`);
      } else {
        setImagePreview(null);
      }
    }
  }, [editingUser, user]) // Adicionado dependências ao useEffect

  // NOVO: Handler para capturar a seleção do arquivo
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setImage(f);
      // cria preview temporário
      const url = URL.createObjectURL(f);
      setImagePreview(url);
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
      if (image) formData.append("avatar", image);

      // envia para o route /api/users que encaminha para o backend
      const resp = await fetch("/api/users", { method: "POST", body: formData });
      const result = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        alert(result.message || "Erro ao criar usuário");
        return;
      }
      // registra criação no histórico (actor se disponível)
      try{
        const entry: Omit<UserHistWithActor, "when"> = {
          id: null,
          nome: name,
          email: email,
          nivel: level === "Administrador" ? "Administrador" : "Usuário",
          status: status === "Ativo" ? "Ativo" : "Inativo",
          motivo: "Criado",
          actorId: actor?.id ?? null,
          actorName: actor?.user_name ?? actor?.displayName ?? actor?.name ?? null,
          action: "Criado",
        };
        addUserHistory(entry);
      }catch(err){
        console.warn('add user create history failed', err);
      }

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
      if (image) formData.append("avatar", image);

      const resp = await fetch("/api/users", { method: "PUT", body: formData });
      const result = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        alert(result.message || "Erro ao atualizar usuário");
        console.error('PUT /api/users failed', result);
        return;
      }
      // success - show message if available
      if (result && result.message) {
        // small non-blocking feedback
        console.info('Usuário atualizado:', result.message);
      }
    }
    
    // Este código é executado para ambos (criação e atualização)
    // after save, if updating and status changed to Ativo, add to history
    try{
      if(editingUser){
        const newStatusNum = status === "Ativo" ? 1 : 0;
        if(prevStatus !== null && prevStatus !== newStatusNum && newStatusNum === 1){
          const entry: Omit<UserHistWithActor, "when"> = {
            id: user?.id ?? null,
            nome: name,
            email: email,
            nivel: level === "Administrador" ? "Administrador" : "Usuário",
            status: "Ativo",
            motivo: "Ativado",
            actorId: actor?.id ?? null,
            actorName: actor?.user_name ?? actor?.displayName ?? actor?.name ?? null,
            action: "Ativado",
          };
          addUserHistory(entry);
        }

        // always record an edit action when editing a user
        try{
          const entry: Omit<UserHistWithActor, "when"> = {
            id: user?.id ?? null,
            nome: name,
            email: email,
            nivel: level === "Administrador" ? "Administrador" : "Usuário",
            status: status,
            motivo: "Editado",
            actorId: actor?.id ?? null,
            actorName: actor?.user_name ?? actor?.displayName ?? actor?.name ?? null,
            action: "Editado",
          };
          addUserHistory(entry);
        }catch(err){
          console.warn('add user edit history failed', err);
        }
      }
    }catch(err){
      console.warn('add user history failed', err);
    }

    await getUsers();
    showModal(false);
  };

  // cleanup object URL when modal unmounts or image changes
  useEffect(() => {
    return () => {
      if (imagePreview && image) {
        try {
          URL.revokeObjectURL(imagePreview);
        } catch (e) {
          // ignore
        }
      }
    };
  }, [imagePreview, image]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40"
        onClick={() => showModal(false)}
      />

      <motion.div
        initial={{ y: -20, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 10, opacity: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden"
      >
        <div className="flex items-center justify-between p-5 border-b">
          <h3 className="text-xl font-semibold text-gray-800">{editingUser ? "Editar Usuário" : "Adicionar Usuário"}</h3>
          <button onClick={() => showModal(false)} className="p-2 rounded-md hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Nome</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200" />

            <label className="text-sm text-gray-600">Cargo</label>
            <input type="text" value={position} onChange={e => setPosition(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200" />

            <label className="text-sm text-gray-600">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200" />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-600">Senha</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={editingUser ? "Alterar senha (opcional)" : "Senha"} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200" />

            <label className="text-sm text-gray-600">Nível de Acesso</label>
            <select value={level} onChange={e => setLevel(e.target.value)} className="w-full border rounded-lg px-3 py-2">
              <option value="" disabled>Escolha um nível</option>
              <option value="Usuário">Usuário</option>
              <option value="Administrador">Administrador</option>
            </select>

            <label className="text-sm text-gray-600">Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)} className="w-full border rounded-lg px-3 py-2">
              <option value="" disabled>Escolha status</option>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>

          <div className="md:col-span-2 flex items-center gap-4">
            <input type="checkbox" className="h-5 w-5" checked={repassword} onChange={e => setRePassword(e.target.checked)} />
            <div className="text-sm text-gray-700">O usuário deve alterar a senha no próximo login</div>
          </div>

          <div className="md:col-span-2 flex flex-col gap-2">
            <label className="text-sm text-gray-600">Foto de Perfil (Opcional)</label>
            <div className="flex items-center gap-4">
              {imagePreview ? (
                <img src={imagePreview.startsWith("http") ? imagePreview : imagePreview} alt="preview" className="w-16 h-16 rounded-full object-cover border" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">No</div>
              )}
              <input id="foto" type="file" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} className="file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t">
          <button onClick={() => showModal(false)} className="px-4 py-2 border rounded-lg">Cancelar</button>
          <button onClick={handleSave} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg">{editingUser ? "Salvar" : "Adicionar"}</button>
        </div>
      </motion.div>
    </div>
  )
}

export default ModalUser;