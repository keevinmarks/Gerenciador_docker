import express from "express";
import type { Connection, RowDataPacket } from "mysql2/promise";
import {success, z} from "zod";
import getConnection from "../../mysqlConnection/mysqlConnection.js";
import { connect } from "http2";

const computerSchema = z.object({
    id_computer: z.number().int().positive().optional(),
    name_computer: z.string().min(2, {message: "O nome do computador deve ter pelos menos dois caracteres"}),
    type_computer: z.string().min(2, {message: "O tipo do computador deve ter pelo menos dois caracteres"}),
    mac_computer: z.string().min(12, {message: "O mac do computador deve ter pelo menos 12 caracteres"}),
    asset_number: z.number().int().positive({message: "O patrimônio deve ser um número inteiro positivo"}),
    status_computer: z.number().int().nonnegative({message: "O valor de status não pode ser negativo"}),
    exit_date: z.string().min(10, {message: "A data de saída deve conter pelo menos 10 caracteres"}).optional(),
    reason: z.string().min(2, {message: "O motivo deve ter pelo menos 2 caracteres"}),
    return_date: z.string().min(10, {message: "A data de retorno deve conter pelo menos 10 caracteres"}).optional()
});

const idSchema = z.object({
    id_computer: z.number().int().positive()
});

export const computersRouter = express.Router();

//Rota de cadastro de computadores:
computersRouter.post("/", async (req, res) => {

    const validate_computer = computerSchema.safeParse(req.body);
    if(!validate_computer.success){
        return res.status(400).json({message: "Dados inválidos", success: false});
    }

    const {name_computer, type_computer, mac_computer, asset_number, status_computer, exit_date, reason, return_date} = validate_computer.data;
    let connection: Connection | null = null;

    try{
        connection = await getConnection();
        if(!connection){
            return res.status(500).json({message: "Erro de conexão com banco de dados", success: false})
        }

        await connection.execute<any[0]>("INSERT INTO computers (name_computer, type_computer, mac_computer, asset_number,status_computer, exit_date, reason, return_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [name_computer, type_computer, mac_computer, asset_number, status_computer, exit_date, reason, return_date]);

        res.status(200).json({message: "Computador cadastrado com sucesso", success: true});

    }catch(error){
        console.log("Erro na inserção de computador");
        res.status(500).json({message: "Computador não cadastrado" + error, success: false});
    }finally{
        if(connection){
            connection.end();
            console.log("Conexão com o banco de dados fechada");
        }
    }
});


//Rota para atualizar um computador:
computersRouter.put("/", async (req, res) => {

    const validate_computers = computerSchema.safeParse(req.body);
    if(!validate_computers.success){
        return res.status(400).json({message: "Dados inválidos"})
    }

    const {id_computer, name_computer, type_computer, mac_computer, asset_number, status_computer, exit_date, reason, return_date} = validate_computers.data;
    let connection: Connection | null = null;

    try{
        connection = await getConnection();
        if(!connection){
            return res.status(500).json({message: "Erro de conexão com banco de dados"});
        }

        await connection.execute<any[0]>("UPDATE computers SET name_computer = ?, mac_computer = ?, type_computer = ?, asset_number = ?, status_computer = ?, exit_date = ?, reason = ?, return_date = ? WHERE id_computer = ?", [name_computer, mac_computer, type_computer, asset_number, status_computer, exit_date, reason, return_date, id_computer]);

        res.status(200).json({message: "Computador atualizado com sucesso", success: true});
    }catch(error){
        console.log("Erro na atualização do computador");
        res.status(500).json({message: "Computador não atualizado " + error, success: false});
    }finally{
        if(connection){
            connection.end();
            console.log("Conexão com o banco de dados fechada");
        }
    }
});

//Rota para pegar os computadores:
computersRouter.get("/", async (req, res) => {
    let connection: Connection | null = null;
    try{
        connection = await getConnection();
        if(!connection){
            return res.status(500).json({message: "Erro de conexão com o banco de dados", success: false});
        }

        const [rows] = await connection.execute<RowDataPacket[0]>("SELECT * FROM computers");

        return res.status(200).json({success: true, data: rows});
    }catch(error){
        console.log("Não foi possível consultar os computadores");
        return res.status(500).json({message: "Não foi possível consultar os computadores " + error, success: false});
    }finally{
        if(connection){
            connection.end();
            console.log("Conexão com o banco de dados fechada");
        }
    }
});

//Rota para deletar um computador:
computersRouter.delete("/:id_computer", async(req, res) => {
    const validateId = idSchema.safeParse({
        id_computer: Number(req.params.id_computer)
    });
    if(!validateId.success){
        return res.status(400).json({message: "Dados inválidos", success: false});
    }

    const {id_computer} = validateId.data;
    let connection: Connection | null = null;
    try{
        connection = await getConnection();
        if(!connection){
            return res.status(500).json({message: "Erro de conexão com o banco de dados", success: false});
        }

        await connection.execute<any[0]>("DELETE FROM computers WHERE id_computer = ?", [id_computer]);

        return res.status(200).json({message: "Computador deletado com sucesso", success: true});
    }catch(error){
        console.log(`Erro ao deletar usuário: ${error}`);
        return res.status(500).json({message: `Erro ao deletar computador: ${error}`, success: false});
    }finally{
        if(connection){
            connection.end();
            console.log("Conexão com o banco de dados fechada");
        }
    }
});
