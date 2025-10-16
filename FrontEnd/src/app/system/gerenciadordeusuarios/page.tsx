"use client";
import { useEffect, useState } from "react";
import { Plus, X, Pencil, Trash } from "lucide-react";

type User = {
  id: string;
  nome: string;
  email: string;
  senha?: string; // adicionado para consistência
  permissao: "Admin" | "User";
  status: "Ativo" | "Desativado";
  foto?: string;
};

export default function UserManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [deleteUser, setDeleteUser] = useState<User | null>(null);

  const [formData, setFormData] = useState<Omit<User, "id">>({
    nome: "",
    email: "",
    senha: "",
    permissao: "User",
    status: "Ativo",
    foto: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:3001/api/users");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "foto" && files && files[0]) {
      const reader = new FileReader();
      reader.onload = () =>
        setFormData((prev) => ({ ...prev, foto: reader.result as string }));
      reader.readAsDataURL(files[0]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    if (!formData.nome.trim() || !formData.email.trim()) {
      setErrorMsg("Preencha os campos obrigatórios: Nome e Email.");
      return;
    }
    setErrorMsg("");

    try {
      if (editingUser) {
        const res = await fetch(
          `http://localhost:3001/api/users/${editingUser.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          }
        );
        if (!res.ok) throw new Error();
        setUsers((prev) =>
          prev.map((u) =>
            u.id === editingUser.id ? { ...u, ...formData } : u
          )
        );
      } else {
        const res = await fetch("http://localhost:3001/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error();
        const newUser = await res.json();
        setUsers((prev) => [...prev, newUser]);
      }

      setFormData({
        nome: "",
        email: "",
        senha: "",
        permissao: "User",
        status: "Ativo",
        foto: "",
      });
      setEditingUser(null);
      setShowModal(false);
    } catch {
      setErrorMsg("Erro ao salvar usuário.");
    }
  };

  const confirmDelete = async () => {
    if (!deleteUser) return;
    try {
      const res = await fetch(`http://localhost:3001/api/users/${deleteUser.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setUsers((prev) => prev.filter((u) => u.id !== deleteUser.id));
      setDeleteUser(null);
    } catch {
      setErrorMsg("Erro ao excluir usuário.");
    }
  };

  const handleToggleStatus = async (id: string) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;
    const updatedStatus = user.status === "Ativo" ? "Desativado" : "Ativo";

    try {
      const res = await fetch(`http://localhost:3001/api/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: updatedStatus }),
      });
      if (!res.ok) throw new Error();
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: updatedStatus } : u))
      );
    } catch {
      setErrorMsg("Erro ao atualizar status.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-black">
      <h1 className="text-3xl font-extrabold mb-6 text-center">
        Gerenciamento de Usuários
      </h1>

      <div className="flex justify-end mb-6">
        <button
          onClick={() => {
            setEditingUser(null);
            setFormData({
              nome: "",
              email: "",
              senha: "",
              permissao: "User",
              status: "Ativo",
              foto: "",
            });
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          <Plus className="w-5 h-5" />
          Adicionar Usuário
        </button>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{errorMsg}</div>
      )}

      <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
        {loading ? (
          <p>Carregando usuários...</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-gray-100 text-gray-700">
                <th className="py-2 px-3">Foto</th>
                <th className="py-2 px-3">Nome</th>
                <th className="py-2 px-3">Email</th>
                <th className="py-2 px-3">Permissão</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-2 px-3">
                    {user.foto ? (
                      <img
                        src={user.foto}
                        alt={user.nome}
                        className="w-10 h-10 rounded-full border object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                        {user.nome?.[0] ?? "U"}
                      </div>
                    )}
                  </td>
                  <td className="py-2 px-3 font-medium">{user.nome}</td>
                  <td className="py-2 px-3">{user.email}</td>
                  <td className="py-2 px-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        user.permissao === "Admin"
                          ? "bg-red-100 text-red-700 border border-red-300"
                          : "bg-gray-100 text-gray-700 border border-gray-300"
                      }`}
                    >
                      {user.permissao}
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    <span
                      onClick={() => handleToggleStatus(user.id)}
                      className={`cursor-pointer px-3 py-1 rounded-full text-sm font-medium ${
                        user.status === "Ativo"
                          ? "bg-green-100 text-green-700 border border-green-300"
                          : "bg-yellow-100 text-yellow-700 border border-yellow-300"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-center flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setEditingUser(user);
                        setFormData({
                          nome: user.nome,
                          email: user.email,
                          senha: "",
                          permissao: user.permissao,
                          status: user.status,
                          foto: user.foto || "",
                        });
                        setShowModal(true);
                      }}
                      className="p-2 rounded-full hover:bg-indigo-100"
                    >
                      <Pencil className="w-5 h-5 text-black" />
                    </button>
                    <button
                      onClick={() => setDeleteUser(user)}
                      className="p-2 rounded-full hover:bg-red-100"
                    >
                      <Trash className="w-5 h-5 text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-blue-700">
                {editingUser ? "Editar Usuário" : "Adicionar Usuário"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
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
                value={formData.nome}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
              <input
                type="password"
                name="senha"
                placeholder="Digite uma senha"
                value={formData.senha}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
              <select
                name="permissao"
                value={formData.permissao}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="Ativo">Ativo</option>
                <option value="Desativado">Desativado</option>
              </select>
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
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
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
      )}

      {deleteUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
            <h3 className="text-lg font-semibold text-red-700 mb-4">
              Deseja realmente excluir o usuário <b>{deleteUser.nome}</b>?
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Essa ação é irreversível e removerá o usuário do sistema.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteUser(null)}
                className="px-4 py-2 border rounded-md text-black"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
