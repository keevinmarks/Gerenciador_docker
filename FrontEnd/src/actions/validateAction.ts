"use server"
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
type User = {
    name:string;
    password: string;
}
const validateUser = async ({name, password}: User) => {
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
                secure: process.env.NODE_ENV === "production",
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
export default validateUser;