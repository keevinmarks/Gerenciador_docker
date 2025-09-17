"use client"
import { deleteCookies } from "@/actions/deleteCookies";

const ButtonLogoff = () =>{
    const HandleButton = async () => {
        await deleteCookies();
    }
    return(
            <button onClick={HandleButton} className="bg-sky-400 py-2 px-3 rounded-md cursor-pointer">Sair</button>
    )
}
export default ButtonLogoff;