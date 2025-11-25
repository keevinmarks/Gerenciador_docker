import { deleteComputer } from "@/actions/computersAction";

type Props = {
  updateList: () => void;
  showModal: (value:boolean) => void;
  computer_id: number;
}
const ModalDeltete = ({showModal, computer_id, updateList}:Props) => {

    const handleDelete = async () => {
      await deleteComputer(computer_id);
      await updateList();
      showModal(false);
    }
    const handleCancel = () => {
      showModal(false);
    }
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-red-600 mb-4">
              Confirmar Exclusão
            </h3>
            <p className="text-sm text-gray-700 mb-6">
              Tem certeza que deseja excluir este computador?
              <br />
              <span className="font-semibold text-red-600">Consequências:</span>
              <br />-O computador será removido da lista.
              <br />-Essa ação não pode ser desfeita.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border rounded-md text-black cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium transition-colors cursor-pointer"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
    )
}

export default ModalDeltete;