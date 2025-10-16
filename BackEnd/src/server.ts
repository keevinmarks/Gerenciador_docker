import express from "express";
import helmet from "helmet";
import { router } from "./routers/index.js";


//Criando a conexão com servidor:
const server = express();

//Helmet para possibilitar o uso de cabveçalhos:
server.use(helmet());

//Abilitando o server para responder em json:
server.use(express.json());

//Habilitando para receber corpos em qualquer método de requisição
server.use(express.urlencoded({extended: true}));

server.use("/", router);

//Definindo a porta que o servidor irá escutar:
server.listen(3001, () => {
    console.log("Servidor rodando");
});