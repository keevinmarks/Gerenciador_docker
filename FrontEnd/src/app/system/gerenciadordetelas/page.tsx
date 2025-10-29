"use client";
import { useEffect, useState } from "react";
import { Plus, X, Pencil, Trash } from "lucide-react";
import ModalComputer from "@/components/computers/ModalComputer";
import TableComputers from "@/components/computers/TableComputers";
import { Computer } from "@/types/types";
import { getComputers } from "@/actions/computersAction";



const ComputerList = () => {
  const [showModal, setShowModal] = useState(false);
  const [computers, setComputers] = useState<Computer[]>([]);

  const getCompu = async () => {
    const computersResp = await getComputers();
    console.log(computersResp);
    setComputers(computersResp);
  }

  useEffect(()=> {
    getCompu();
  },[]);

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-2xl font-bold text-black mb-6">
        Gerenciamento de Computadores
      </h1>

      <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-700">
            Lista de Computadores
          </h2>
          <button
            onClick={() => {
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Adicionar Computador
          </button>
        </div>

        {/* Tabela */}
        <TableComputers computers={computers} modalUpdate={getCompu}/>
      </div>

      {/* Modal de Adição/Edição */}
      {showModal && (<ModalComputer setShowModal={setShowModal} isEditing={false} updateComputerList={getCompu}/>)}
    </div>
  );
};

export default ComputerList;
