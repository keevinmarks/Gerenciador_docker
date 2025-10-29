import { User } from "@/types/types";
import { Pencil, Trash } from "lucide-react";
import UserItem from "./UserItem";

type Props = {
    users: User[];
}
const TableUsers = ({users}:Props) => {
    return(
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
            {users.map((user, index) => (
              <UserItem key={index} user={user}/>
            ))}
          </tbody>
        </table>
    )
}

export default TableUsers;