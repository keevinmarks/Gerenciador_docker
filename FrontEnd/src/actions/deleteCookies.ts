"use server"
import { redirect } from "next/navigation";
import { cookies } from "next/headers"
import { isRedirectError } from "next/dist/client/components/redirect-error";

export const deleteCookies = async () => {

    try{
        const cookieStore = await cookies();
        cookieStore.delete("authToken");
        redirect("/");
    }catch(error){
        if(isRedirectError(error)){
            throw error;
        }
        console.log("Erro ao deletar cookie");
        redirect("/");
    }
};