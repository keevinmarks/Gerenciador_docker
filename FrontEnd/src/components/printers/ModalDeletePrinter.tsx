"use client";

import { deletePrinter } from "@/actions/printersAction";
import { Printer } from "@/types/types";
import { addPrinterHistory } from "@/actions/historyAction";
import { useUser } from "@/contexts/UserContext";

type Props = {
  updateList: () => void;
  showModal: (value: boolean) => void;
  printer: Printer;
};

const ModalDeletePrinter = ({ showModal, printer, updateList }: Props) => {
  const { user: actor } = useUser();
  const handleDelete = async () => {
    if (!printer.id_printer) {
      alert("ID da impressora inválido");
      return;
    }

      try {
        // add to local history before removing
        try {
          addPrinterHistory({
            id: printer.id_printer ?? null,
            tipo: printer.type_printer,
            nome: printer.name_printer,
            mac: printer.mac_printer,
            tombo: printer.asset_number,
            Problema: undefined,
            status: printer.status_printer === 1 ? "Ativo" : "Inativo",
            motivo: "Excluído",
            actorId: actor?.id ?? null,
            actorName: actor?.user_name ?? actor?.displayName ?? actor?.name ?? null,
            action: "Excluído",
          });
        } catch (err) {
          console.warn("history add failed", err);
        }

      const resp = await deletePrinter(printer.id_printer);
      console.debug("deletePrinter response:", resp);
      if (!resp || !resp.success) {
        alert(resp?.message || "Erro ao excluir impressora");
        return;
      }

      await updateList();
      showModal(false);
    } catch (err) {
      console.error("handleDelete error:", err);
      alert("Erro inesperado ao excluir impressora");
    }
  };

  const handleCancel = () => {
    showModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h3 className="text-lg font-semibold text-red-600 mb-4">Confirmar Exclusão</h3>

        <p className="text-sm text-gray-700 mb-6">
          Tem certeza que deseja excluir permanentemente a impressora <strong>{printer.name_printer}</strong>?
          <br />
          Essa ação removerá todos os dados relacionados a essa impressora do banco de dados.
        </p>

        <div className="flex justify-end gap-3">
          <button onClick={handleCancel} className="px-4 py-2 border rounded-md text-black cursor-pointer">
            Cancelar
          </button>

          <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium transition-colors cursor-pointer">
            Excluir Definitivamente
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDeletePrinter;
