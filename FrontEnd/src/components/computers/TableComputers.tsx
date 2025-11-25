"use client"
import { Computer } from "@/types/types";
import ComputerItem from "./ComputerItem";

type Props = {
  modalUpdate: () => void;
  computers:Computer[];
}
const TableComputers = ({computers, modalUpdate}:Props) => {

  return(
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-xs overflow-hidden">
          <thead>
            <tr className="bg-blue-50 text-left text-sm text-black">
              <th className="py-3 px-4 border-b">Tipo</th>
              <th className="py-3 px-4 border-b">Nome</th>
              <th className="py-3 px-4 border-b">MAC</th>
              <th className="py-3 px-4 border-b">Tombo</th>
              <th className="py-3 px-4 border-b">Status</th>
              <th className="py-3 px-4 border-b">Data Saída</th>
              <th className="py-3 px-4 border-b">Motivo</th>
              <th className="py-3 px-4 border-b">Data Retorno</th>
              <th className="py-3 px-4 border-b text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-200 text-black">
            {computers?.map((pc, index) => <ComputerItem computer={pc} key={index} modalUpdate={modalUpdate}/>)}
          </tbody>
        </table>
      </div>
  )
}

export default TableComputers;