import { deleteComputer } from "@/actions/computersAction";
import { addComputerHistory } from "@/actions/historyAction";
import { Computer } from "@/types/types";
import { useUser } from "@/contexts/UserContext";

type Props = {
  updateList: () => void;
  showModal: (value:boolean) => void;
  computer: Computer;
}
const ModalDeltete = ({showModal, computer, updateList}:Props) => {
    const { user: actor } = useUser();

    const handleDelete = async () => {
      try {
        addComputerHistory({
          id: computer.id_computer ?? null,
          tipo: computer.type_computer,
          nome: computer.name_computer,
          mac: computer.mac_computer,
          tombo: computer.asset_number,
          Problema: undefined,
          status: computer.status_computer === 1 ? "Ativo" : "Desativado",
          motivo: "Excluído",
          actorId: actor?.id ?? null,
          actorName: actor?.user_name ?? actor?.displayName ?? actor?.name ?? null,
          action: "Excluído",
        });
      } catch (err) {
        console.warn("history add failed", err);
      }

      await deleteComputer(computer.id_computer as number);
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