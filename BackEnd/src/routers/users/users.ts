import express from "express";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import getConnection from "../../mysqlConnection/mysqlConnection.js";
import type { Connection, RowDataPacket } from "mysql2/promise";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config"
import { z } from "zod";
import multer from "multer";
import path from "path";


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("Multer tentará salvar em:", path.join(process.cwd(), 'uploads'));
        const uploadPath = path.join(process.cwd(), "uploads")
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.]/g, "-");
        const uniqueSuffix = Date.now() + "-" + sanitizedFilename;
        cb(null, uniqueSuffix);
    }
})

const upload = multer({storage: storage});


const userSchema = z.object({
    user_name: z.string().min(2, {message: "O nome deve ter pelo menos dois caracteres"}),
    position: z.string().min(2, {message: "A posiçaõ deve ter pelos menos dois caracteres"}),
    email_user: z.email({message: "Email inválido"}).nullable(),
    status_user: z.coerce.number().int().nonnegative({message: "O status do usuário deve ser um número positivo"}),
    level_user: z.coerce.number().int().nonnegative({message: "O nível do usuário não pode ser negativo"}),
    password_user: z.string().min(4, {message: "A senha deve ter pelos menos 4 caracteres"}),
    reset_password: z.coerce.number().int().nonnegative({message: "O parâmetro de reset de senha deve um ser um número positivo"})
});

const updateSchema = z.object({
    id: z.coerce.number().int().positive({message: "O id deve ser um numero inteiro positivo"}),
    user_name: z.string().min(2, {message: "O nome deve conter pelos menos dois caracteres"}),
    position: z.string().min(2, {message: "A posição deve conter pelos menos dois caracteres"}),
    email_user: z.email({message: "Email inválido"}).nullable(),
    status_user: z.coerce.number().int().nonnegative({message: "O status deve ser um número inteiro positivo"}),
    level_user: z.coerce.number().int().nonnegative({message: "O nível deve ser um interiro positivo"}),
    password_user: z.string().refine(val => val.length === 0 || val.length >= 4, {message: "A senha deve estar em branco (para não alterar) ou ter pelo menos 4 caracteres"}).optional(),
    reset_password: z.coerce.number().int().nonnegative({message: "O parâmetro de reset de senha deve um ser um número positivo"})
});

const validateSchema = z.object({
    user_name: z.string().min(1, {message: "Preencha todo os campos"}),
    password: z.string().min(1, {message: "Preencha todos os campos"})
});

const deleteSchema = z.object({
    id_user: z.coerce.number().int().positive({message: "O id deve ser um número interio positivo"})
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
        const [rows] = await connection.execute<RowDataPacket[0]>("SELECT id, password_user, reset_password, level_user FROM users WHERE user_name = ?", [user_name]);

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
        console.log(payload);
        const secret = process.env.JWT_SECRET;
        //console.log(secret);
        if(!secret){
            return res.status(500).json({message: "Erro no servidor", success: false});
        }

        const token = jwt.sign(payload, secret, {expiresIn: "3h"});
        console.log(token);
        
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

// Rota para obter dados do usuário autenticado
usersRouter.get("/me", async (req, res) => {
    try{
        const connection: Connection | null = await getConnection();
        if(!connection){ return res.status(500).json({message: "Erro na conexão", success: false}) }

        const userId = req.user?.id;
        if(!userId) return res.status(401).json({message: "Usuário não autenticado", success: false});

        const [rows] = await connection.execute<RowDataPacket[]>("SELECT id, user_name, email_user, position, level_user, path_img FROM users WHERE id = ?", [userId]);
        if(!rows || rows.length === 0) return res.status(404).json({message: "Usuário não encontrado", success: false});

        return res.status(200).json({message: "Usuário autenticado", success: true, data: rows[0]});
    }catch(error){
        console.log("Erro em /users/me: ", error);
        return res.status(500).json({message: "Erro interno", success: false});
    }
});

//Rota para pegar os usuários
usersRouter.get("/", async (req, res) => {
    try{
        const connection: Connection | null = await getConnection();
        if(!connection){return res.json({message: "Erro na conexão"})};

        const [rows] = await connection.execute<any[]>("SELECT id, user_name, position, level_user, password_user, email_user, status_user, registration_date, updated_at, reset_password, path_img FROM users");

        //console.log(rows);
        res.status(200).json({message: "Listagem de usuário com sucesso", success: true, data: rows});
    }catch(error){
        console.log("Erro na conexão mysql: " + error)
        res.json({message: "Erro na requisição"});
    }
});

//Rota para cadastro de usuário:
usersRouter.post("/",upload.single("avatar"), async (req, res) => {
    
    if(req.user?.level_user as number >= 2){
        try{

            console.log("Dados recebidos: ",req.body);
            console.log("Arquivo recebido: ",req.file);

            const connection: Connection | null = await getConnection();
            if(!connection){return res.json({message: "Erro na conexão", success: false})};

            const validate_data = userSchema.safeParse(req.body);

            if(!validate_data.success){
                console.log("Veio até aqui");
                return res.status(400).json({message: "Dados invalidos", success: false});
            }

            const {user_name, position, email_user, level_user, status_user, password_user, reset_password} = validate_data.data;

            const passwordEncrypted = await bcrypt.hash(password_user as string, 10);

            let fields = ["user_name", "position", "email_user", "level_user", "status_user", "password_user", "reset_password"];
            let values: (string | number | null)[] = [user_name, position, email_user, level_user, status_user, passwordEncrypted, reset_password];
            let placeholders = "?, ?, ?, ?, ?, ?, ?";
            
            if(req.file){
                fields.push("path_img");
                values.push(`uploads/${req.file.filename}`);
                placeholders += ", ?";
            }
            //await connection.execute<any[0]>(`INSERT INTO users (user_name, position, email_user, level_user, status_user, password_user, reset_password) values (?, ?, ?, ?, ?, ?, ?)`, [user_name, position, email_user, level_user, status_user, passwordEncrypted, reset_password]);
            const sql = `insert into users (${fields.join(", ")}) values (${placeholders})`;
            await connection.execute<any[0]>(sql, values);
            res.status(200).json({message: "Usuário cadastrado", success: true});
            
        }catch(error){
            console.log(`Error na inserção de usuário ${error}`);
            res.status(500).json({message: "Usuário não cadastrado", success: false});
        }
    }else{
        return res.status(401).json({message: "Você não tem permissão para isso", success: false});
    }

});

//Rota para atualizar usuário:
usersRouter.put("/",upload.single("avatar"), async (req, res) => {
    console.log("Chegou na atualização de usuário");
    if(req.user?.level_user as number >= 2){
        try{
            const connection: Connection | null = await getConnection();
            if(!connection){ return res.status(400).json({message: "Erro com a conexão do banco", success: false})};
            console.log(req.body);

            // ASSUMINDO que seu 'updateSchema' agora permite 'password_user' ser opcional (ex: .optional())
            const validate_data = updateSchema.safeParse(req.body);

            if(!validate_data.success){ return res.json({message: "Dados inválidos", success: false, errors: validate_data.error.flatten()})}; // Adicionei errors para debug
            
            // 'password_user' pode vir como undefined/null ou "" se for opcional
            const {id, user_name, position, email_user, status_user, level_user, password_user, reset_password} = validate_data.data;
            
            // --- INÍCIO DA MODIFICAÇÃO ---

            // 1. Defina a query e os parâmetros base (sem a senha)
            let sqlQuery = "UPDATE users SET user_name = ?, position = ?, email_user = ?, status_user = ?, level_user = ?, reset_password = ?";
            let sqlParams: any[] = [user_name, position, email_user, status_user, level_user, reset_password];

            // 2. Verifique se a senha foi enviada e não está vazia
            if (password_user && password_user.trim() !== "") {
                // Se foi, criptografe e adicione à query e aos parâmetros
                const passwordEncrypted = await bcrypt.hash(password_user, 10);
                
                sqlQuery += ", password_user = ?"; // Adiciona o campo na query
                sqlParams.push(passwordEncrypted); // Adiciona o valor nos parâmetros
            }

            // 2.b Se um arquivo foi enviado, atualize também path_img
            if (req.file) {
                const imgPath = `uploads/${req.file.filename}`;
                sqlQuery += ", path_img = ?";
                sqlParams.push(imgPath);
            }

            // 3. Adicione o WHERE no final (sempre necessário)
            sqlQuery += " WHERE id = ?";
            sqlParams.push(id);

            // 4. Execute a query montada dinamicamente
            await connection.execute<any[]>(sqlQuery, sqlParams);

            // --- FIM DA MODIFICAÇÃO ---

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
usersRouter.delete("/:id_user", async (req, res) => {

    if(req.user?.level_user as number >= 2){
        try{
            const connection: Connection | null = await getConnection();
            if(!connection){ return res.status(500).json({message: "Erro ao se conectar ao banco", success: false})};

            const validate_data = deleteSchema.safeParse({
                id_user: Number(req.params.id_user)
            });

            if(!validate_data.success){return res.status(400).json({message: "Dados inválidos"})};

            const {id_user} = validate_data.data;

            await connection.execute<any[]>("DELETE FROM users WHERE id = ?", [id_user]);
            
            res.status(200).json({message: "Usuário deletado com sucesso", success: true});
        }catch(error){
            console.log("Erro ao tentar deletar um usuário");
            res.status(400).json({message: "Erro ao tentar deletar usuário", success: false});
        }
    }else{
        return res.status(403).json({message: "Você não tem permissão para isso", success: false});
    }
});