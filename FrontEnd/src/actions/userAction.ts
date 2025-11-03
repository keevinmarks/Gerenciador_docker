"use server"
import { User } from "@/types/types";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
type UserValidate = {
    name:string;
    password: string;
}
export const validateUser = async ({name, password}: UserValidate) => {
    try{
        const res = await fetch("http://api:3001/users/validate", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({user_name:name, password: password})
        });
        const jsonResp = await res.json();
        if(jsonResp.success && jsonResp.token){
            const cookieStore = await cookies();
            cookieStore.set("authToken", jsonResp.token, {
                httpOnly: true,
                secure: false,//process.env.NODE_ENV === "production",
                path: "/",
                maxAge: 60 * 60 * 3
            });
            redirect("/system/home");
        }else{
            return {message: jsonResp.message, success: false}
        }
    }catch(error){
        if(isRedirectError(error)){
            throw error;
        }
        console.log("Erro de contato com a API" + error);
        return {message: "Erro de conexão com a API" + error, success: false }
    }
}

export const getUsers = async () => {
    try{

        const cookieStore = await cookies();

        const token = cookieStore.get("authToken")?.value;

        const headers = {
            "Content-type": "application/json",
            "Authorization": ""
        };

        if(token){
            headers["Authorization"] = `Bearer ${token}`;
        }else{
            console.log("Nenhum token de autorização encontrado");
        }

        const resp = await fetch("http://api:3001/users", {
            method: "GET",
            headers: headers,
            cache: "no-store"
        })

        const jsonResp = await resp.json();
        return jsonResp.data;
    }catch(error){
        console.log("Erro ao buscar usuários: " + error);
        return {message: "Erro ao buscar usuários: " + error, success: false }
    }
}

export const insertUsers = async (user:User) => {
    try{

        const cookieStore = await cookies();

        const token = cookieStore.get("authToken")?.value;

        const headers = {
            "Content-Type":"application/json",
            "Authorization": ""
        };

        if(token){
            headers["Authorization"] = `Bearer ${token}`;
        }else{
            console.log("O token de autorização não existe");
        }

        const resp = await fetch("http://api:3001/users", {
            method: "POST",
            headers,
            body: JSON.stringify(user)
        })
    }catch(error){
        console.log(`Erro ao inserir usuário: ${error}`);
        return {message: `Erro ao inserir usuário: ${error}`, success: false}
    }
}
