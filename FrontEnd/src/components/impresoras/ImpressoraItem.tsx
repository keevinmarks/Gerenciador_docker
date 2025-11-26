"use client";

import { useState } from "react";
import { Pencil, Trash } from "lucide-react";
import { Impressora } from "@/types/types";
import ModalImpressora from "./Modalimpresora";
import { deleteImpressora } from "@/actions/impresorasAction";

type Props = {
  impressora: Impressora;
  modalUpdate: () => void;
};

const ImpressoraItem = ({ impressora, modalUpdate }: Props) => {
  const [editing, setEditing] = useState(false);

  const handleDelete = async () => {
    if (!impressora.id_impressora) {
      alert("Impressora sem ID válido.");
      return;
    }

    const confirmDelete = confirm("Confirmar exclusão da impressora?");
    if (!confirmDelete) return;

    try {
      await deleteImpressora(impressora.id_impressora);
      await modalUpdate();
    } catch (error) {
      console.error(error);
      alert("Erro ao deletar impressora.");
    }
  };

  return (
    <>
      <tr>
        <td className="py-3 px-4">{impressora.name_impressora}</td>
        <td className="py-3 px-4">{impressora.mac_impressora}</td>
        <td className="py-3 px-4">{impressora.asset_number}</td>
        <td className="py-3 px-4">
          {impressora.status_impressora === 1 ? "Ativo" : "Desativado"}
        </td>
        <td className="py-3 px-4">{impressora.exit_date ?? "-"}</td>
        <td className="py-3 px-4">{impressora.reason ?? "-"}</td>
        <td className="py-3 px-4">{impressora.return_date ?? "-"}</td>

        <td className="py-3 px-4 text-right">
          <div className="flex justify-end items-center gap-2">
            <button
              onClick={() => setEditing(true)}
              className="p-2 rounded-md hover:bg-gray-100"
              title="Editar"
            >
              <Pencil className="w-4 h-4" />
            </button>

            <button
              onClick={handleDelete}
              className="p-2 rounded-md hover:bg-red-50 text-red-600"
              title="Excluir"
            >
              <Trash className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>

      {editing && (
        <ModalImpressora
          isEditing={true}
          impressora={impressora}
          setShowModal={setEditing}
          setModalEdit={setEditing}
          updateImpressoraList={modalUpdate}
        />
      )}
    </>
  );
};

export default ImpressoraItem;

