"use client";

import { Printer } from "@/types/types";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { insertPrinter, updatePrinter } from "@/actions/printersAction";
import { useUser } from "@/contexts/UserContext";

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
  const [type, setType] = useState("");
  const [mac, setMac] = useState("");
  const [asset, setAsset] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [typeError, setTypeError] = useState<string | null>(null);
  const [macError, setMacError] = useState<string | null>(null);
  const [assetError, setAssetError] = useState<string | null>(null);
  const [status, setStatus] = useState<"Ativo" | "Inativo">("Ativo");
  const [exitDate, setExitDate] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [returnDate, setReturnDate] = useState<string | null>(null);

  useEffect(() => {
    if (printer) {
      setName(printer.name_printer);
      setType(printer.type_printer ?? "");
      setMac(printer.mac_printer);
      setAsset(String(printer.asset_number));
      setStatus(printer.status_printer === 1 ? "Ativo" : "Inativo");
      setExitDate(printer.exit_date ?? null);
      setReason(printer.reason ?? "");
      setReturnDate(printer.return_date ?? null);
    }
  }, [printer]);

  const { user } = useUser();

  const handleSave = async () => {
    // reset errors
    setNameError(null);
    setTypeError(null);
    setMacError(null);
    setAssetError(null);

    // client-side validation
    let hasError = false;
    if (!name || name.trim().length < 2) {
      setNameError("Nome muito curto (mínimo 2 caracteres)");
      hasError = true;
    }
    if (!type || type.trim().length < 2) {
      setTypeError("Tipo muito curto (mínimo 2 caracteres)");
      hasError = true;
    }
    const macClean = mac.trim();
    if (!macClean || macClean.length < 12 || macClean.length > 30) {
      setMacError("MAC inválido (entre 12 e 30 caracteres)");
      hasError = true;
    }
    const assetNum = Number(asset);
    if (!asset || Number.isNaN(assetNum) || !Number.isFinite(assetNum) || assetNum <= 0) {
      setAssetError("Tombo inválido (número positivo)");
      hasError = true;
    }
    if (hasError) return;

    try {
      if (isEditing && printer) {
        const payload: Printer = {
          id_printer: printer.id_printer,
          name_printer: name,
          type_printer: type,
          mac_printer: mac,
          asset_number: Number(asset),
          status_printer: status === "Ativo" ? 1 : 0,
          exit_date: exitDate ?? undefined,
          reason: status === "Inativo" ? (reason || user?.name || undefined) : (reason || undefined),
          return_date: returnDate ?? undefined,
        };

        const resp = await updatePrinter(payload);
        if (!resp.success) {
          alert(resp.message || "Erro ao atualizar impressora");
          return;
        }
      } else {
        const payload: Omit<Printer, "id_printer"> = {
          name_printer: name,
          type_printer: type,
          mac_printer: mac,
          asset_number: Number(asset),
          status_printer: status === "Ativo" ? 1 : 0,
          exit_date: exitDate ?? undefined,
          reason: status === "Inativo" ? (reason || user?.name || undefined) : (reason || undefined),
          return_date: returnDate ?? undefined,
        };

        const resp = await insertPrinter(payload);
        if (!resp.success) {
          // show backend message when available
          alert(resp.message || "Erro ao inserir impressora");
          return;
        }
      }

      await updatePrinterList();
      setShowModal(false);
    } catch (err) {
      console.error("handleSave:", err);
      alert("Erro inesperado ao salvar impressora");
    }
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
          {nameError && <p className="text-sm text-red-600 mt-1">{nameError}</p>}

          <input
            placeholder="Tipo"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          />
          {typeError && <p className="text-sm text-red-600 mt-1">{typeError}</p>}

          <input
            placeholder="MAC"
            value={mac}
            onChange={(e) => setMac(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          />
          {macError && <p className="text-sm text-red-600 mt-1">{macError}</p>}

          <input
            type="number"
            placeholder="Tombo"
            value={asset}
            onChange={(e) => setAsset(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          />
          {assetError && <p className="text-sm text-red-600 mt-1">{assetError}</p>}

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "Ativo" | "Inativo")}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
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
