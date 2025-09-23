import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";


//Função auxiliar para pegar o segredo
const getSecret = () => {
    const secret = process.env.JWT_SECRET;

    if(!secret){
        throw new Error("A variável JWT_SECRET não foi definida ou não está disponível")
    }

    //Retornando o segredo no formato de Uint8Array
    return new TextEncoder().encode(secret)
}

//Função principal de middleware para validação de token
export const middleware = async (request: NextRequest) => {
    console.log("Passou pelo middleware");
    //Pegando o token do cookie
    const token = request.cookies.get("authToken")?.value;

    //Verificando se o token existe
    if(!token){
        //Passando uma ulr absoluta e não relativa
        return NextResponse.redirect(new URL("/", request.url));
    }

    try{
        //Verificando a validade do token:
        await jwtVerify(token, getSecret());

        //Permite acesso a página:
        return NextResponse.next();
    }catch(error){
        //Deleta o cookie inválido e redireciona para a página de login:
        const cookieStore = await cookies()
        cookieStore.delete("authToken");
        return NextResponse.redirect(new URL("/", request.url));
    }
}

export const config = {
    matcher: [
        "/system/:path*"
    ]
}