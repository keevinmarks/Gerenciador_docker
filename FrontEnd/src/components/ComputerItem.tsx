"use client"
import { Computer } from "@/types/types"
import { Pencil, Trash } from "lucide-react"
import { useState } from "react"
import ModalComputer from "./ModalComputer"
type Props = {
    modalUpdate: () => void;
    computer:Computer;
}
const ComputerItem = ({computer, modalUpdate}:Props) => {
    const [modalEdit, setModalEdit] = useState<boolean>(false)
    const handleEdit = () => {
        setModalEdit(true);
    }
    const setDeleteId = (id:number) => {
        if(confirm(`Tem certeza que deseja deletar o computador de id: ${id} ?`)){
            alert("Computador deletado");
        }
    }

    const formatDate = (dataValue:string | null) => {
        if(dataValue){
            const dateSplit = dataValue.split("-");
            return `${dateSplit[2]}/${dateSplit[1]}/${dateSplit[0]}`
        }else{
            return null
        }
    }

    return(
        <tr key={computer.id_computer} className="hover:bg-blue-50/40">
            <td className="py-3 px-4">{computer.type_computer}</td>
            <td className="py-3 px-4">{computer.name_computer}</td>
            <td className="py-3 px-4">{computer.mac_computer}</td>
            <td className="py-3 px-4">{computer.asset_number}</td>
            <td className="py-3 px-4">
            <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                computer.status_computer === 1
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
            >
                {computer.status_computer=== 1? "Ativo": "Desativado"}
            </span>
            </td>
            <td className="py-3 px-4">{formatDate(computer.exit_date) || "N/A"}</td>
            <td className="py-3 px-4">{computer.reason || "N/A"}</td>
            <td className="py-3 px-4">{formatDate(computer.return_date) || "N/A"}</td>
            <td className="py-3 px-4 text-right flex gap-2 justify-end">
            <button
                onClick={handleEdit}
                className="p-2 rounded-full hover:bg-blue-100"
            >
                <Pencil className="w-5 h-5 text-blue-600" />
            </button>
            <button
                onClick={() => setDeleteId(computer.id_computer as number)}
                className="p-2 rounded-full hover:bg-red-100"
            >
                <Trash className="w-5 h-5 text-red-600" />
            </button>
            </td>
            {modalEdit && <ModalComputer isEditing={true} computer={computer} setModalEdit={setModalEdit} updateComputerList={modalUpdate}/>}
        </tr>
    )
}

export default ComputerItem;