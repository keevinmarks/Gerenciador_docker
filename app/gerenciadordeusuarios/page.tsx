"use client";
import { useEffect, useState } from "react";

// Definição do tipo de usuário que virá da API
type User = {
  id: string;
  nome: string;
  email: string;
  permissao: "Admin" | "User"; // Nível de permissão
  status: "Ativo" | "Desativado"; // Situação do usuário
  foto?: string; // Foto de perfil (opcional)
};

export default function UserManager() {
  const [users, setUsers] = useState<User[]>([]); // Estado para armazenar a lista de usuários

  // 🔹 Busca os usuários da API ao carregar o componente
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Faz requisição para o backend (rodando no Docker)
        const res = await fetch("http://localhost:3001/api/users");
        const data = await res.json();
        setUsers(data); // Atualiza o estado com os usuários retornados
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    };

    fetchUsers();
  }, []);

  // 🔹 Função para excluir um usuário
  const handleDelete = async (id: string) => {
    await fetch(`http://localhost:3001/api/users/${id}`, { method: "DELETE" });
    // Atualiza a lista local removendo o usuário excluído
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  // 🔹 Função para ativar/desativar um usuário
  const handleToggleStatus = async (id: string) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;

    // Define o novo status (se estava ativo vira desativado e vice-versa)
    const updatedStatus = user.status === "Ativo" ? "Desativado" : "Ativo";

    // Atualiza no backend
    await fetch(`http://localhost:3001/api/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: updatedStatus }),
    });

    // Atualiza no frontend (sem precisar recarregar a página)
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: updatedStatus } : u
      )
    );
  };

  return (
    <div className="p-6">
      {/* Título principal */}
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Gerenciamento de Usuários
      </h1>

      <div className="bg-white shadow-md rounded-lg p-4">
        {/* Cabeçalho do card com botão adicionar */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Usuários do Sistema</h2>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition">
            ➕ Adicionar Usuário
          </button>
        </div>

        {/* Tabela de usuários */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="py-2 px-3">Foto</th>
                <th className="py-2 px-3">Nome</th>
                <th className="py-2 px-3">Email</th>
                <th className="py-2 px-3">Permissão</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {/* Renderiza cada usuário da lista */}
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b last:border-none hover:bg-gray-50"
                >
                  {/* Foto do usuário (se não tiver, mostra inicial do nome) */}
                  <td className="py-2 px-3">
                    {user.foto ? (
                      <img
                        src={user.foto}
                        alt={user.nome}
                        className="w-10 h-10 rounded-full border"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                        {user.nome[0]} {/* Primeira letra do nome */}
                      </div>
                    )}
                  </td>

                  {/* Nome do usuário */}
                  <td className="py-2 px-3 font-medium">{user.nome}</td>

                  {/* Email */}
                  <td className="py-2 px-3">{user.email}</td>

                  {/* Permissão (Admin/User) */}
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

                  {/* Status (Ativo/Desativado) */}
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

                  {/* Ações (Editar e Excluir) */}
                  <td className="py-2 px-3 text-center">
                    <button className="text-indigo-600 hover:text-indigo-800 font-medium mr-3">
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      🗑️ Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
