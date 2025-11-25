import { User } from "@/types/types";
import {delete}

type Props = {
    setModal: (value:boolean) => void;
    user: User
}

const ShowModalDelete = ({setModal, user}: Props) => {

    const handleDelete = () => {

    }
    return(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
            <h3 className="text-lg font-semibold text-red-700 mb-4">
              Deseja realmente excluir o usuário <b>{user.user_name}</b>?
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Essa ação é irreversível e removerá o usuário do sistema.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setModal(false)}
                className="px-4 py-2 border rounded-md text-black"
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
    )
}

export default ShowModalDelete;