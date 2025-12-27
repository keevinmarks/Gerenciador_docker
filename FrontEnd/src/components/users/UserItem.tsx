import { User } from "@/types/types";
import { Pencil, Trash, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import ModalUser from "./ModalUser";
import ShowModalDelete from "./ShowModalDelete";

type Props = {
  user: User;
  getUsers: () => void;
};

const UserItem = ({ user, getUsers }: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);

  const handleEdit = () => {
    setShowModal(true);
  };

  const handleOpenDeleteModal = () => {
    setShowModalDelete(true);
  };

  const handleConfirmDelete = async () => {
    console.log("Deletar usuário:", user.id);

    // 👉 aqui você chama sua API de delete
    // await deleteUser(user.id)

    setShowModalDelete(false);
    getUsers();
  };

  return (
    <tr className="border-b hover:bg-gray-50 transition">
      <td className="py-2 px-3">
        <Image
          src={
            user.path_img
              ? `http://localhost:3001/${user.path_img}`
              : "/images/default.jpg"
          }
          width={40}
          height={40}
          alt="Foto_perfil"
          className="rounded-full object-cover"
          unoptimized={!!user.path_img}
        />
      </td>

      <td className="py-2 px-3 font-medium">{user.user_name}</td>
      <td className="py-2 px-3">{user.email_user}</td>

      <td className="py-2 px-3">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            user.level_user === 2
              ? "bg-red-100 text-red-700 border border-red-300"
              : "bg-gray-100 text-gray-700 border border-gray-300"
          }`}
        >
          {user.level_user === 2 ? "Administrador" : "Usuário"}
        </span>
      </td>

      <td className="py-2 px-3">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            user.status_user === 1
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-yellow-100 text-yellow-700 border border-yellow-300"
          }`}
        >
          {user.status_user === 1 ? "Ativo" : "Inativo"}
        </span>
      </td>

      <td className="py-2 px-3 flex justify-center gap-2">
        <button onClick={handleEdit} className="p-2 rounded-full hover:bg-indigo-100">
          <Pencil className="w-5 h-5" />
        </button>

        <button
          onClick={handleOpenDeleteModal}
          className="p-2 rounded-full hover:bg-red-100"
        >
          <Trash className="w-5 h-5 text-red-600" />
        </button>

        <button className="p-2 rounded-full hover:bg-gray-100">
          <Plus className="w-5 h-5" />
        </button>
      </td>

      {showModal && (
        <ModalUser
          editingUser
          showModal={setShowModal}
          user={user}
          getUsers={getUsers}
        />
      )}

      {showModalDelete && (
        <ShowModalDelete
          setModal={setShowModalDelete}
          user={user}
          onDelete={handleConfirmDelete}
        />
      )}
    </tr>
  );
};

export default UserItem;
