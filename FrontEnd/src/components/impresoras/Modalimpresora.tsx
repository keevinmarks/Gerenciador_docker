"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Impressora } from "@/types/types";
import { insertImpressora, updateImpressora } from "@/actions/impresorasAction";

type Props = {
  updateImpressoraList: () => void;
  setModalEdit?: (value: boolean) => void;
  setShowModal?: (value: boolean) => void;
  isEditing: boolean;
  impressora?: Impressora;
};

const ModalImpressora = ({
  setShowModal,
  isEditing,
  impressora,
  setModalEdit,
  updateImpressoraList,
}: Props) => {
  const [idImpressora, setIdImpressora] = useState<number | undefined>();
  const [name, setName] = useState<string>("");
  const [mac, setMac] = useState<string>("");
  const [assetNumber, setAssetNumber] = useState<number | "">("");
  const [status, setStatus] = useState<string>("Ativo");
  const [exitDate, setExitDate] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [returnDate, setReturnDate] = useState<string>("");

  const closeModal = () => {
    if (isEditing && setModalEdit) setModalEdit(false);
    if (!isEditing && setShowModal) setShowModal(false);
  };

  const handleActionButton = async () => {
    if (!name || !mac || assetNumber === "" || assetNumber === undefined) {
      alert("Preencha todos os campos obrigatórios: Nome, MAC e Tombo.");
      return;
    }

    const data: Impressora = {
      id_impressora: idImpressora ?? 0,
      name_impressora: name,
      mac_impressora: mac,
      asset_number: Number(assetNumber),
      status_impressora: status === "Ativo" ? 1 : 0,
      exit_date: exitDate || null,
      reason: reason || null,
      return_date: returnDate || null,
    };

    try {
      if (isEditing) {
        if (!idImpressora) {
          alert("ID inválido para edição.");
          return;
        }

        await updateImpressora(idImpressora, data);
      } else {
        await insertImpressora(data);
      }

      await updateImpressoraList();
      closeModal();
    } catch (error) {
      console.error("Erro ao salvar impressora:", error);
      alert("Ocorreu um erro ao salvar.");
    }
  };

  useEffect(() => {
    if (impressora) {
      setIdImpressora(impressora.id_impressora);
      setName(impressora.name_impressora);
      setMac(impressora.mac_impressora);
      setAssetNumber(impressora.asset_number);
      setStatus(impressora.status_impressora === 1 ? "Ativo" : "Desativado");
      setExitDate(impressora.exit_date ?? "");
      setReason(impressora.reason ?? "");
      setReturnDate(impressora.return_date ?? "");
    }
  }, [impressora]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-blue-700">
            {isEditing ? "Editar impressora" : "Adicionar impressora"}
          </h3>

          <button onClick={closeModal} className="hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded-md px-3 py-2 mb-2 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          placeholder="MAC Address"
          value={mac}
          onChange={(e) => setMac(e.target.value)}
          className="w-full border rounded-md px-3 py-2 mb-2 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="number"
          placeholder="Tombo"
          value={assetNumber}
          onChange={(e) =>
            setAssetNumber(e.target.value === "" ? "" : Number(e.target.value))
          }
          className="w-full border rounded-md px-3 py-2 mb-2 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border rounded-md px-3 py-2 mb-2 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Ativo">Ativo</option>
          <option value="Desativado">Desativado</option>
        </select>

        <input
          type="date"
          value={exitDate}
          onChange={(e) => setExitDate(e.target.value)}
          className="w-full border rounded-md px-3 py-2 mb-2 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          placeholder="Motivo da saída"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full border rounded-md px-3 py-2 mb-2 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="date"
          value={returnDate}
          onChange={(e) => setReturnDate(e.target.value)}
          className="w-full border rounded-md px-3 py-2 mb-4 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={closeModal}
            className="px-4 py-2 border rounded-md text-black cursor-pointer"
          >
            Cancelar
          </button>

          <button
            onClick={handleActionButton}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium cursor-pointer"
          >
            {isEditing ? "Salvar" : "Adicionar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalImpressora;
