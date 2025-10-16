"use client"
import { getComputers } from "@/actions/computersAction";
import { Computer } from "@/types/types";
import { useEffect, useState } from "react";
import ComputerItem from "./ComputerItem";


const TableComputers = () => {
  const [computers, setComputers] = useState<Computer[]>();
  const getCompu = async () => {
    const computersResp = await getComputers();
    console.log(computersResp);
    setComputers(computersResp);
  }
  useEffect(() => {
    getCompu()
  },[])

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
            {computers?.map((pc, index) => <ComputerItem computer={pc} key={index}/>)}
          </tbody>
        </table>
      </div>
  )
}

export default TableComputers;