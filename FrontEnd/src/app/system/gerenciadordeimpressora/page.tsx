// /page.tsx
"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import ModalImpressora from "@/components/impresoras/Modalimpresora";
import TableImpressoras from "@/components/impresoras/Tableimpresoras";
import { Impressora } from "@/types/types";
import { getImpressoras } from "@/actions/impresorasAction";

const ImpressoraList = () => {
  const [showModal, setShowModal] = useState(false);
  const [impressoras, setImpressoras] = useState<Impressora[]>([]);

  const loadImpressoras = async () => {
    const data = await getImpressoras();
    setImpressoras(data ?? []);
  };

  useEffect(() => {
    loadImpressoras();
  }, []);

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-2xl font-bold text-black mb-6">
        Gerenciamento de Impressoras
      </h1>

      <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Lista de Impressoras</h2>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Adicionar Impressora
          </button>
        </div>

        <TableImpressoras impressoras={impressoras} modalUpdate={loadImpressoras} />
      </div>

      {showModal && (
        <ModalImpressora
          setShowModal={setShowModal}
          isEditing={false}
          updateImpressoraList={loadImpressoras}
        />
      )}
    </div>
  );
};

export default ImpressoraList;
