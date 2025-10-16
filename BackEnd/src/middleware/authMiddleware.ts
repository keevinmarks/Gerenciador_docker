import type { Request, Response, NextFunction } from "express";
import "dotenv/config"
import jwt from "jsonwebtoken";

declare global {
    namespace Express{
        interface Request{
            user?: {id: number; level_user:number;}
        }
    }
};

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {


    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if(!token){
        return res.status(401).json({message: "Acesso negado, nenhum token fornecido"});
    }
    const secret = process.env.JWT_SECRET;
    if(!secret){
        //Sem o secret ou está inacessível
        return res.status(500).json({message: "Erro no servidor", success: false})
    }

    try{
        const decode = jwt.verify(token, secret) as {id:number; level_user:number, iat:number, exp:number};
        req.user = {id: decode.id, level_user: decode.level_user };
        console.log(`level no middleware: ${decode.level_user}`);
        next();
    }catch(error){
        return res.status(403).json({message: "Token inválido ou expirado", success: false});
    }

}