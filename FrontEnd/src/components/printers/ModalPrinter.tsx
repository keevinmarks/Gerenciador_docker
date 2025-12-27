"use client";

import { Printer } from "@/types/types";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { insertPrinter, updatePrinter } from "@/actions/printersAction";

type Props = {
  setShowModal: (value: boolean) => void;
  updatePrinterList: () => void;
  isEditing: boolean;
  printer?: Printer;
};

const ModalPrinter = ({
  setShowModal,
  updatePrinterList,
  isEditing,
  printer,
}: Props) => {
  const [name, setName] = useState("");
  const [mac, setMac] = useState("");
  const [asset, setAsset] = useState("");
  const [status, setStatus] = useState<"Ativo" | "Desativado">("Ativo");
  const [exitDate, setExitDate] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [returnDate, setReturnDate] = useState<string | null>(null);

  useEffect(() => {
    if (printer) {
      setName(printer.name_printer);
      setMac(printer.mac_printer);
      setAsset(String(printer.asset_number));
      setStatus(printer.status_printer === 1 ? "Ativo" : "Desativado");
      setExitDate(printer.exit_date ?? null);
      setReason(printer.reason ?? "");
      setReturnDate(printer.return_date ?? null);
    }
  }, [printer]);

  const handleSave = async () => {
    if (!name || !mac || !asset) return;

    if (isEditing && printer) {
      const payload: Printer = {
        id_printer: printer.id_printer,
        name_printer: name,
        mac_printer: mac,
        asset_number: Number(asset),
        status_printer: status === "Ativo" ? 1 : 0,
        exit_date: exitDate ?? undefined,
        reason: reason || undefined,
        return_date: returnDate ?? undefined,
      };

      await updatePrinter(payload);
    } else {
      const payload: Omit<Printer, "id_printer"> = {
        name_printer: name,
        mac_printer: mac,
        asset_number: Number(asset),
        status_printer: status === "Ativo" ? 1 : 0,
        exit_date: exitDate ?? undefined,
        reason: reason || undefined,
        return_date: returnDate ?? undefined,
      };

      await insertPrinter(payload);
    }

    await updatePrinterList();
    setShowModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-blue-700">
            {isEditing ? "Editar Impressora" : "Adicionar Impressora"}
          </h3>

          <button onClick={() => setShowModal(false)}>
            <X />
          </button>
        </div>

        <div className="space-y-4">
          <input
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          />

          <input
            placeholder="MAC"
            value={mac}
            onChange={(e) => setMac(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          />

          <input
            type="number"
            placeholder="Tombo"
            value={asset}
            onChange={(e) => setAsset(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          />

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as "Ativo" | "Desativado")
            }
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="Ativo">Ativo</option>
            <option value="Desativado">Desativado</option>
          </select>

          <div className="flex justify-end gap-3">
            <button onClick={() => setShowModal(false)}>
              Cancelar
            </button>

            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              {isEditing ? "Salvar" : "Adicionar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalPrinter;
