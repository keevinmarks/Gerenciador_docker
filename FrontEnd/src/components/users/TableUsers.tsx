import { User } from "@/types/types";
import UserItem from "./UserItem";
import { motion } from "framer-motion";

type Props = {
    users: User[];
    getUsers: () => void;
}
const TableUsers = ({users, getUsers}:Props) => {
    return (
      <motion.table initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }} className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b bg-gray-100 text-gray-700">
            <th className="py-3 px-4">Foto</th>
            <th className="py-3 px-4">Nome</th>
            <th className="py-3 px-4">Email</th>
            <th className="py-3 px-4">Permissão</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4 text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <motion.tr key={user.id ?? index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.03 }} className="border-b hover:bg-gray-50">
              <UserItem user={user} getUsers={getUsers} />
            </motion.tr>
          ))}
        </tbody>
      </motion.table>
    );
}

export default TableUsers;