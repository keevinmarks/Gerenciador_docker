import type { Connection } from "mysql2/promise";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"];

for(const varName of requiredEnvVars){
    if(!process.env[varName]){
        throw new Error(`Erro: A variável de ambiente ${varName} não está definida`);
    }
}

const getConnection =  async (): Promise<Connection | null> => {
    try{
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST!,
            user: process.env.DB_USER!,
            password: process.env.DB_PASSWORD!,
            database: process.env.DB_NAME!
        });
        return connection;
    }catch(error){
        console.log(`Erro na conexão mysql: ${error}`)
        return null;
    }
}

export default getConnection;
