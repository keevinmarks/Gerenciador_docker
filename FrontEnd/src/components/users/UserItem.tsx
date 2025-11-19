import { User } from "@/types/types";
import { Pencil, Trash, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import ModalUser from "./ModalUser";


type Props = {
    user: User;
    getUsers: () => void;
}

const UserItem = ({user, getUsers}:Props) => {
    const [showModal, setShowModal] = useState<boolean>(false)

    const HandleEdit = () => {
        setShowModal(true);
    }

    const HandleDelete = () => {
        console.log("Deletar usuário: " + user.id);
    }
    console.log("Imagem aqui");
    console.log(user.path_img);
    return (
        <tr className="border-b hover:bg-gray-50 transition">
            <td className="py-2 px-3">
                {user.path_img ? (
                <Image
                    src={`http://localhost:3001/uploads/${user.path_img}`}
                    width={40}
                    height={40}
                    alt="Foto_perfil"
                    className="rounded-full object-cover"
                />
                ) : (
                <Image
                    src={"/images/default.jpg"}
                    width={40}
                    height={40}
                    alt="Foto_perfil"
                    className="rounded-full object-cover"
                />
                )}
            </td>
            <td className="py-2 px-3 font-medium">{user.user_name}</td>
            <td className="py-2 px-3">{user.email_user}</td>
            <td className="py-2 px-3">
                <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user.level_user === 1
                    ? "bg-red-100 text-red-700 border border-red-300"
                    : "bg-gray-100 text-gray-700 border border-gray-300"
                }`}
                >
                {user.level_user === 2 ? "Administrador" : "Usuário"}
                </span>
            </td>
            <td className="py-2 px-3">
                <span
                className={`cursor-pointer px-3 py-1 rounded-full text-sm font-medium ${
                    user.status_user === 1
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : "bg-yellow-100 text-yellow-700 border border-yellow-300"
                }`}
                >
                {user.status_user === 1 ? "Ativo" : "Inativo"}
                </span>
            </td>
            <td className="py-2 px-3 text-center flex justify-center gap-2">
                <button onClick={HandleEdit} className="p-2 rounded-full hover:bg-indigo-100 cursor-pointer">
                    <Pencil className="w-5 h-5 text-black" />
                </button>
                <button onClick={HandleDelete} className="p-2 rounded-full hover:bg-red-100 cursor-pointer">
                    <Trash className="w-5 h-5 text-red-600" />
                </button>
                <button onClick={HandleDelete} className="p-2 rounded-full hover:bg-red-100 cursor-pointer">
                    <Plus className="w-5 h-5 text-red-600" />
                </button>
            </td>
            {showModal && <ModalUser editingUser={true} showModal={setShowModal} user={user} getUsers={getUsers}/>}
        </tr>
    )
}

export default UserItem;