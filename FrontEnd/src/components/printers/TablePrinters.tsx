"use client";

import { Printer } from "@/types/types";
import { Pencil, Trash } from "lucide-react";

type Props = {
  printers: Printer[];
  onEdit: (printer: Printer) => void;
};

const TablePrinters = ({ printers, onEdit }: Props) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-600">
        <thead className="text-xs uppercase bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-3">Nome</th>
            <th className="px-4 py-3">Tombo</th>
            <th className="px-4 py-3">MAC</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Ações</th>
          </tr>
        </thead>

        <tbody>
          {printers.map((printer) => (
            <tr
              key={printer.id_printer}
              className="border-b hover:bg-gray-50"
            >
              <td className="px-4 py-3 font-medium text-gray-900">
                {printer.name_printer}
              </td>

              <td className="px-4 py-3">
                {printer.asset_number}
              </td>

              <td className="px-4 py-3">
                {printer.mac_printer}
              </td>

              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    printer.status_printer === 1
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {printer.status_printer === 1 ? "Ativo" : "Desativado"}
                </span>
              </td>

              <td className="px-4 py-3 flex justify-end gap-2">
                <button
                  onClick={() => onEdit(printer)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Pencil size={16} />
                </button>

                <button className="text-red-600 hover:text-red-800">
                  <Trash size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablePrinters;
