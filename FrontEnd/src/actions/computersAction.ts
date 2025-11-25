"use server";

import { Computer } from "@/types/types";

export const insertComputer = async (computer:Computer) => {
    console.log(`Computador indo para adição: ${computer.name_computer}`)
    try{
        const res = await fetch("http://api:3001/computers", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(computer)
        });

        const json = await res.json();
        //console.log(json);
    }catch(error){
        console.log("Erro ao tentar inserir computador: " + error);
        return {message: "Erro ao tentar inserir computador " + error, success: false}
    }
}

export const getComputers = async () => {
    try{
        
        const res = await fetch("http://api:3001/computers", {
            method: "GET",
            headers: {
                "Content-type": "application/json"
            },
            cache: "no-store"
        });   
        const computers = await res.json();
        return computers.data;
    }catch(error){
        console.log("Erro ao consultar computadores: " + error);
        return {message: "Erro ao consultar os computadores", success: false}
    }
}

export const updateComputers = async (computer:Computer) => {
    console.log(`Computador indo para edição: ${JSON.stringify(computer)}`);
    try{
        const resp = await fetch("http://api:3001/computers",{
            method: "PUT",
            headers: {
                "Content-type":"application/json"
            },
            body: JSON.stringify(computer)
        })
        const json = await resp.json();
        //console.log(json);
        return json;
    }catch(error){
        console.log(`Erro ao atualizar o computador ${error}`);
        return {message: "Erro ao atualizar o computador", success: false}
    }
}

export const deleteComputer = async (computer_id:number) => {
    try{
        const resp = await fetch(`http://api:3001/computers/${computer_id}`,{
            method: "DELETE",
            headers: {
                "Content-type":"application/json"
            }
        })
        const json = await resp.json();
        return json;
    }catch(error){
        console.log(`Erro ao deletar o computador: ${error}`);
        return {message: "Erro ao deletar o computador", success: false}
    }
}