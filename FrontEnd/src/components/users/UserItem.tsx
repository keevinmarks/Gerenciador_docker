import { User } from "@/types/types";
import { Pencil, Trash } from "lucide-react";
import Image from "next/image";

type Props = {
    user: User;
}

const UserItem = ({user}:Props) => {


    const HandleSave = () => {
        console.log("Editar usuário: " + user.id);
    }

    const HandleDelete = () => {
        console.log("Deletar usuário: " + user.id);
    }

    return (
        <tr className="border-b hover:bg-gray-50 transition">
            <td className="py-2 px-3">
                {user.path_img ? (
                <Image
                    src={user.path_img}
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
                    user.status_user === true
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : "bg-yellow-100 text-yellow-700 border border-yellow-300"
                }`}
                >
                {user.status_user === true ? "Ativo" : "Inativo"}
                </span>
            </td>
            <td className="py-2 px-3 text-center flex justify-center gap-2">
                <button onClick={HandleSave} className="p-2 rounded-full hover:bg-indigo-100">
                    <Pencil className="w-5 h-5 text-black" />
                </button>
                <button onClick={HandleDelete} className="p-2 rounded-full hover:bg-red-100">
                    <Trash className="w-5 h-5 text-red-600" />
                </button>
            </td>
        </tr>
    )
}

export default UserItem;