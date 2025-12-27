"use client";

import { Printer } from "@/types/types";
import { Pencil, Trash } from "lucide-react";
import { useState } from "react";
import ModalPrinter from "./ModalPrinter";
import ModalDeletePrinter from "./ModalDeletePrinter";

type Props = {
  printer: Printer;
  modalUpdate: () => void;
};

const PrinterItem = ({ printer, modalUpdate }: Props) => {
  const [modalDelete, setModalDelete] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);

  const formatDate = (value?: string | null) => {
    if (!value) return "N/A";
    const [year, month, day] = value.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <tr className="hover:bg-blue-50/40 transition-colors">
      <td className="py-3 px-4">{printer.name_printer}</td>
      <td className="py-3 px-4">{printer.asset_number}</td>
      <td className="py-3 px-4">{printer.mac_printer}</td>

      <td className="py-3 px-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            printer.status_printer === 1
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {printer.status_printer === 1 ? "Ativo" : "Desativado"}
        </span>
      </td>

      <td className="py-3 px-4">{formatDate(printer.exit_date)}</td>
      <td className="py-3 px-4">{printer.reason || "N/A"}</td>
      <td className="py-3 px-4">{formatDate(printer.return_date)}</td>

      <td className="py-3 px-4 flex justify-end gap-2">
        <button
          onClick={() => setModalEdit(true)}
          className="p-2 rounded-full hover:bg-blue-100 transition"
        >
          <Pencil className="w-5 h-5 text-blue-600" />
        </button>

        <button
          onClick={() => setModalDelete(true)}
          className="p-2 rounded-full hover:bg-red-100 transition"
        >
          <Trash className="w-5 h-5 text-red-600" />
        </button>
      </td>

      {modalEdit && (
        <ModalPrinter
          isEditing
          printer={printer}
          setShowModal={setModalEdit}
          updatePrinterList={modalUpdate}
        />
      )}

      {modalDelete && printer.id_printer !== undefined && (
        <ModalDeletePrinter
          printer_id={printer.id_printer}
          showModal={setModalDelete}
          updateList={modalUpdate}
        />
      )}
    </tr>
  );
};

export default PrinterItem;
