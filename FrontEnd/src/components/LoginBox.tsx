"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import validateUser from "@/actions/validateAction";
const LoginBox = () => {
    const router = useRouter();
    const [inputUser, setInputUser] = useState<string>("");
    const [inputPassword, setInputPassword] = useState<string>("");
    const HandleEntryButton = async () => {
        const response = await validateUser({name: inputUser, password: inputPassword});
        if(!response.success){
            alert(response.message);
        }

    }

    return(
        <div className="h-96 w-96 bg-transparent border-2 border-gray-600 shadow-xl rounded-2xl p-8 flex flex-col justify-center backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                Login
            </h2>
            <form action={HandleEntryButton} className="flex flex-col gap-5">
                <div className="flex flex-col text-left">
                    <label 
                        htmlFor="inputUser" className="text-sm font-medium text-gray-700 mb-1">
                        Usuário
                    </label>
                    <input
                        type="text"
                        id="inputUser"
                        placeholder="Digite seu usuário"
                        className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder:text-black/30 text-black"
                        value={inputUser}
                        onChange={e => setInputUser(e.target.value)}
                    />
                </div>

                <div className="flex flex-col text-left">
                    <label 
                        htmlFor="inputPassword" 
                        className="text-sm font-medium text-gray-700 mb-1"
                    >
                        Senha
                    </label>
                    <input
                        type="password"
                        id="inputPassword"
                        placeholder="Digite sua senha"
                        className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder:text-black/30 text-black"
                        value={inputPassword}
                        onChange={e => setInputPassword(e.target.value)}
                    />
                </div>
            
                <button
                    type="submit"
                    className="cursor-pointer w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                    Entrar
                </button>
            </form>
        </div>

    )
}

export default LoginBox;