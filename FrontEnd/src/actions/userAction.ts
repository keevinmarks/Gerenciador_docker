"use server"
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { cookies } from "next/headers";
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

export const insertUsers = async (formData: FormData) => { // MODIFICADO
    try{
        const cookieStore = await cookies();
        const token = cookieStore.get("authToken")?.value;

        // MODIFICADO: 'Content-Type' foi removido
        // Usamos 'HeadersInit' para uma melhor tipagem
        const headers: HeadersInit = {
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
            body: formData // MODIFICADO: Enviando o formData
        })

        const respJson = await resp.json();
        return respJson; // Adicionei um retorno
    }catch(error){
        console.log(`Erro ao inserir usuário: ${error}`);
        return {message: `Erro ao inserir usuário: ${error}`, success: false}
    }
}

export const updateUsers = async (formData: FormData) => { // MODIFICADO
    try{
        const cookieStore = await cookies();
        const token = cookieStore.get("authToken")?.value;

        // MODIFICADO: 'Content-Type' foi removido
        const headers: HeadersInit = {
            "Authorization": ""
        };

        if(token){
            headers["Authorization"] = `Bearer ${token}`;
        }else{
            console.log("O token de autorização não existe");
        }

        const resp = await fetch("http://api:3001/users", {
            method: "PUT",
            headers,
            body: formData // MODIFICADO: Enviando o formData
        })

        const respJson = await resp.json();
        return respJson; // Adicionei um retorno
    }catch(error){
        console.log("Erro ao atualizar usuário: " + error);
        return {message: "Erro ao atualizar usuário", success: false}
    }
}

export const deleteUser = async (id: number) => {
    try{
        const cookieStore = await cookies();
        const token = cookieStore.get("authToken")?.value;


        const headers: HeadersInit = {
            "Authorization": ""
        } 

        if(token){
            headers["Authorization"] = `Bearer ${token}`;
        }else{
            console.log("O token de autorização não existe");
        }

        const resp = await fetch(`http://api:3001/${id}`, {
            method: "PUT",
            headers // MODIFICADO: Enviando o formData
        })

        const respJson = await resp.json();
        return respJson;

    }catch(error){
        console.log("Erro ao deletar usuário" + error);
        return {message: "Erro ao atualizar usuário", success: false}
    }
}
