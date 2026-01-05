"use client";

import { User } from "@/types/types";
import { Pencil, Trash, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import ModalUser from "./ModalUser";
import ShowModalDelete from "./ShowModalDelete";
import { motion } from "framer-motion";
import { deleteUser } from "@/actions/userAction";
import { useUser } from "@/contexts/UserContext";
import { addUserHistory, type UserHistWithActor } from "@/actions/historyAction";

type Props = {
  user: User;
  getUsers: () => void;
};

const UserItem = ({ user, getUsers }: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const { user: actor } = useUser();

  const handleEdit = () => {
    setShowModal(true);
  };

  const handleOpenDeleteModal = () => {
    setShowModalDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (!user.id) return;
    
    try {
      // record to local history before deletion (include actor)
      try{
        const entry: Omit<UserHistWithActor, "when"> = {
          id: user.id ?? null,
          nome: user.user_name,
          email: user.email_user,
          nivel: user.level_user === 2 ? "Administrador" : "Usuário",
          status: user.status_user === 1 ? "Ativo" : "Inativo",
          motivo: "Excluído",
          actorId: actor?.id ?? null,
          actorName: actor?.user_name ?? actor?.displayName ?? actor?.name ?? null,
          action: "Excluído",
        };
        addUserHistory(entry);
      }catch(err){
        console.warn('failed to add user history', err);
      }

      const response = await deleteUser(user.id);
      if (response.success) {
        setShowModalDelete(false);
        getUsers();
      } else {
        alert(response.message || "Erro ao deletar usuário");
      }
    } catch (error) {
      console.error("Erro ao deletar:", error);
      alert("Erro ao deletar usuário");
    }
  };

  return (
    <>
      <motion.td initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className="py-2 px-3">
        <Image
          src={
            user.path_img
              ? (user.path_img.startsWith("http") ? user.path_img : `/api/uploads?path=${encodeURIComponent(user.path_img)}`)
              : "/images/default.jpg"
          }
          width={40}
          height={40}
          alt="Foto_perfil"
          className="rounded-full object-cover"
          unoptimized={!!user.path_img}
        />
      </motion.td>

      <motion.td initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} className="py-2 px-3 font-medium">{user.user_name}</motion.td>
      <motion.td initial={{ opacity: 0, x: -3 }} animate={{ opacity: 1, x: 0 }} className="py-2 px-3">{user.email_user}</motion.td>

      <motion.td initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-2 px-3">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            user.level_user === 2
              ? "bg-red-100 text-red-700 border border-red-300"
              : "bg-gray-100 text-gray-700 border border-gray-300"
          }`}
        >
          {user.level_user === 2 ? "Administrador" : "Usuário"}
        </span>
      </motion.td>

      <motion.td initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-2 px-3">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            user.status_user === 1
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-yellow-100 text-yellow-700 border border-yellow-300"
          }`}
        >
          {user.status_user === 1 ? "Ativo" : "Inativo"}
        </span>
      </motion.td>

      <motion.td initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-2 px-3 flex justify-center gap-2">
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
      </motion.td>

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
    </>
  );
};

export default UserItem;
