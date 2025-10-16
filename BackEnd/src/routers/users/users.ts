import express from "express";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import getConnection from "../../mysqlConnection/mysqlConnection.js";
import type { Connection } from "mysql2/promise";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config"
import { z } from "zod";



const userSchema = z.object({
    user_name: z.string().min(2, {message: "O nome deve ter pelo menos dois caracteres"}),
    position: z.string().min(2, {message: "A posiçaõ deve ter pelos menos dois caracteres"}),
    level_user: z.number().int().positive({message: "O nível do usuário não pode ser negativo"}),
    password: z.string().min(4, {message: "A senha deve ter pelos menos 4 caracteres"}),
    reset_password: z.number().int().nonnegative({message: "O parâmetro de reset de senha deve um ser um número positivo"})
});

const updateSchema = z.object({
    id: z.number().int().positive({message: "O id deve ser um numero inteiro positivo"}),
    user_name: z.string().min(2, {message: "O nome deve conter pelos menos dois caracteres"}),
    position: z.string().min(2, {message: "A posição deve conter pelos menos dois caracteres"}),
    level_user: z.number().int().positive({message: "O nível deve ser um interiro positivo"}),
    password: z.string().min(4, {message: "A senha deve conter pelos menos 4 caracteres"}),
    reset_password: z.number().int().positive({message: "O parâmetro de reset de senha deve um ser um número positivo"})
})

const validateSchema = z.object({
    user_name: z.string().min(1, {message: "Preencha todo os campos"}),
    password: z.string().min(1, {message: "Preencha todos os campos"})
});

const deleteSchema = z.object({
    id: z.number().int().positive({message: "O id deve ser um número interio positivo"})
});

export const usersRouter = express.Router();

usersRouter.post("/validate", async (req, res) => {
    try{
        const connection: Connection | null = await getConnection();
        if(!connection){return res.json({message: "Erro na conexão"})};

        const validate_data = validateSchema.safeParse(req.body);

        if(!validate_data.success){
            return res.status(400).json({message: "Preencha todos os campos", success: false});
        }

        const {user_name, password} = validate_data.data;
        const [rows] = await connection.execute<any[]>("SELECT id, password_user, reset_password, level_user FROM users WHERE user_name = ?", [user_name]);

        if(rows.length === 0){
            return res.json({message: "Usuário ou senha incorretos", success: false});
        }
        
        const {id, password_user, reset_password, level_user} = rows[0];

        const passwordEncrypted = password_user;
        const isCorrect = await bcrypt.compare(password, passwordEncrypted);
        
        if(!isCorrect){
            return res.json({message: "Usuário ou senha incorretos", success: false});
        }

        //Criação de token:
        const payload = {
            id,
            user_name,
            level_user
        }
        
        const secret = process.env.JWT_SECRET;
        if(!secret){
            return res.status(500).json({message: "Erro no servidor", success: false});
        }

        const token = jwt.sign(payload, secret, {expiresIn: "3h"});
        
        //Dando as respostas:
        if(reset_password){
            return res.json({message: "Resete de senha necessário", success: true, reset: true, token: token});
        }
        res.json({message: "Login bem-sucedido", success: true, token: token});
    }catch(error){
        console.log(`Erro: ${error}`);
        return res.json({message: "Erro inesperado", success: false})
    }
});

usersRouter.use(authMiddleware);

usersRouter.get("/", async (req, res) => {
    try{
        const connection: Connection | null = await getConnection();
        if(!connection){return res.json({message: "Erro na conexão"})};

        const [rows] = await connection.execute<any[]>("SELECT id, user_name, position, registration_date, updated_at FROM users");

        console.log(rows);
        res.status(200).json({message: "Usuários aqui", success: true});
    }catch(error){
        console.log("Erro na conexão mysql: " + error)
        res.json({message: "Erro na requisição"});
    }
});

//Rota para cadastro de usuário:
usersRouter.post("/", async (req, res) => {
    
    if(req.user?.level_user as number >= 2){
        try{
            const connection: Connection | null = await getConnection();
            if(!connection){return res.json({message: "Erro na conexão", success: false})};

            const validate_data = userSchema.safeParse(req.body);

            if(!validate_data.success){
                return res.status(400).json({message: "Dados invalidos", success: false});
            }

            const {user_name, position, level_user, password, reset_password} = validate_data.data;

            const passwordEncrypted = await bcrypt.hash(password as string, 10);

            await connection.execute<any[0]>(`INSERT INTO users (user_name, position, level_user, password_user, reset_password) values (?, ?, ?, ?, ?)`, [user_name, position, level_user, passwordEncrypted, reset_password]);

            res.status(200).json({message: "Usuário cadastrado", success: true});
        }catch(error){
            console.log(`Error na inserção de usuário`);
            res.status(500).json({message: "Usuário não cadastrado", success: false});
        }
    }else{
        return res.status(401).json({message: "Você não tem permissão para isso", success: false});
    }

});

//Rota para atualizar usuário:
usersRouter.put("/update", async (req, res) => {
    if(req.user?.level_user as number >= 2){

        try{
            const connection: Connection | null = await getConnection();
            if(!connection){ return res.status(400).json({message: "Erro com a conexão do banco", success: false})};

            const validate_data = updateSchema.safeParse(req.body);

            if(!validate_data.success){ return res.json({message: "Dados inválidos", success: false})};
            const {id, user_name, position, level_user, password, reset_password} = validate_data.data;
            
            const passwordEncrypted = await bcrypt.hash(password, 10);

            await connection.execute<any[]>("UPDATE users SET user_name = ?, position = ?, level_user = ?, password_user = ?, reset_password = ? WHERE id = ?", [user_name, position, level_user, passwordEncrypted, reset_password, id]);

            res.status(200).json({message: "Usuário atualizado com sucesso", success: true});

        }catch(error){
            console.log("Ocorreu algum erro ao atualizar o usuário" + error);
            res.json({message: "Erro ao tentar atualizar o usuário", success: false});
        }
    }else{
        return res.status(403).json({message: "Você não tem permissão para isso", success: false});
    }
});


//Rota para deletar usuário:
usersRouter.delete("/delete", async (req, res) => {

    if(req.user?.level_user as number >= 2){
        try{
            const connection: Connection | null = await getConnection();
            if(!connection){ return res.status(500).json({message: "Erro ao se conectar ao banco", success: false})};

            const validate_data = deleteSchema.safeParse(req.body);

            if(!validate_data.success){return res.status(400).json({message: "Dados inválidos"})};

            const {id} = validate_data.data;

            await connection.execute<any[]>("DELETE FROM users WHERE id = ?", [id]);
            
            res.status(200).json({message: "Usuário deletado com sucesso", success: true});
        }catch(error){
            console.log("Erro ao tentar deletar um usuário");
            res.status(400).json({message: "Erro ao tentar deletar usuário", success: false});
        }
    }else{
        return res.status(403).json({message: "Você não tem permissão para isso", success: false});
    }
});