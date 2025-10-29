"use client";
import { useEffect, useState } from "react";
import { Plus, X, Pencil, Trash } from "lucide-react";
import ModalUser from "@/components/users/ModalUser";
import TableUsers from "@/components/users/TableUsers";
import { getUsers } from "@/actions/userAction";
import { User } from "@/types/types";

// type User = {
//   id: string;
//   nome: string;
//   cargo: string;
//   email: string;
//   senha?: string; // adicionado para consistência
//   permissao: "Admin" | "User";
//   status: "Ativo" | "Desativado";
//   foto?: string;
// };

export default function UserManager() {
  // const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  // const [editingUser, setEditingUser] = useState<User | null>(null);
  // const [loading, setLoading] = useState(false);
  // const [errorMsg, setErrorMsg] = useState("");
  // const [deleteUser, setDeleteUser] = useState<User | null>(null);

  // const [formData, setFormData] = useState<Omit<User, "id">>({
  //   nome: "",
  //   email: "",
  //   senha: "",
  //   permissao: "User",
  //   status: "Ativo",
  //   foto: "",
  // });

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       setLoading(true);
  //       const res = await fetch("http://localhost:3001/api/users");
  //       if (!res.ok) throw new Error(`HTTP ${res.status}`);
  //       const data = await res.json();
  //       setUsers(Array.isArray(data) ? data : []);
  //     } catch {
  //       setUsers([]);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchUsers();
  // }, []);

  // const handleChange = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  // ) => {
  //   const { name, value, files } = e.target as HTMLInputElement;
  //   if (name === "foto" && files && files[0]) {
  //     const reader = new FileReader();
  //     reader.onload = () =>
  //       setFormData((prev) => ({ ...prev, foto: reader.result as string }));
  //     reader.readAsDataURL(files[0]);
  //   } else {
  //     setFormData((prev) => ({ ...prev, [name]: value }));
  //   }
  // };

  // const handleSave = async () => {
  //   if (!formData.nome.trim() || !formData.email.trim()) {
  //     setErrorMsg("Preencha os campos obrigatórios: Nome e Email.");
  //     return;
  //   }
  //   setErrorMsg("");

  //   try {
  //     if (editingUser) {
  //       const res = await fetch(
  //         `http://localhost:3001/api/users/${editingUser.id}`,
  //         {
  //           method: "PUT",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify(formData),
  //         }
  //       );
  //       if (!res.ok) throw new Error();
  //       setUsers((prev) =>
  //         prev.map((u) =>
  //           u.id === editingUser.id ? { ...u, ...formData } : u
  //         )
  //       );
  //     } else {
  //       const res = await fetch("http://localhost:3001/api/users", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(formData),
  //       });
  //       if (!res.ok) throw new Error();
  //       const newUser = await res.json();
  //       setUsers((prev) => [...prev, newUser]);
  //     }

  //     setFormData({
  //       nome: "",
  //       cargo: "",
  //       email: "",
  //       senha: "",
  //       permissao: "User",
  //       status: "Ativo",
  //       foto: "",
  //     });
  //     setEditingUser(null);
  //     setShowModal(false);
  //   } catch {
  //     setErrorMsg("Erro ao salvar usuário.");
  //   }
  // };

  // const confirmDelete = async () => {
  //   if (!deleteUser) return;
  //   try {
  //     const res = await fetch(`http://localhost:3001/api/users/${deleteUser.id}`, {
  //       method: "DELETE",
  //     });
  //     if (!res.ok) throw new Error();
  //     setUsers((prev) => prev.filter((u) => u.id !== deleteUser.id));
  //     setDeleteUser(null);
  //   } catch {
  //     setErrorMsg("Erro ao excluir usuário.");
  //   }
  // };

  // const handleToggleStatus = async (id: string) => {
  //   const user = users.find((u) => u.id === id);
  //   if (!user) return;
  //   const updatedStatus = user.status === "Ativo" ? "Desativado" : "Ativo";

  //   try {
  //     const res = await fetch(`http://localhost:3001/api/users/${id}`, {
  //       method: "PATCH",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ status: updatedStatus }),
  //     });
  //     if (!res.ok) throw new Error();
  //     setUsers((prev) =>
  //       prev.map((u) => (u.id === id ? { ...u, status: updatedStatus } : u))
  //     );
  //   } catch {
  //     setErrorMsg("Erro ao atualizar status.");
  //   }
  // };
  const getUsersList = async () => {
    const userList = await getUsers();
    console.log(userList);
    setUsers(userList);
  }
  useEffect(() => {
    getUsersList();
  },[]);
  return (
    <div className="p-6 bg-gray-50 min-h-screen text-black">
      <h1 className="text-3xl font-extrabold mb-6 text-center">
        Gerenciamento de Usuários
      </h1>

      <div className="flex justify-end mb-6">
        <button
          onClick={() => {setShowModal(true);}}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          <Plus className="w-5 h-5" />
          Adicionar Usuário
        </button>
      </div>

      {/* {errorMsg && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{errorMsg}</div>
      )} */}

      <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
        <TableUsers users={users}/>
      </div>

      {showModal && (
        <ModalUser showModal={setShowModal} editingUser={false}/>
      )}

      {/* {deleteUser && (
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
      )} */}
    </div>
  );
}
