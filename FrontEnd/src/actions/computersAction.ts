"use server";

import { Computer } from "@/types/types";

export const insertComputer = async (computer:Computer) => {

    try{
        const res = await fetch("http://api:3001/computers", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(computer)
        });

        const json = await res.json();
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

        // if(!res.ok){
        //     const errorData = await res.json();
        //     console.log(res.status);
        //     throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
        // }
        
        const computers = await res.json();
        console.log(computers);
        return computers.data;
    }catch(error){
        console.log("Erro ao consultar computadores: " + error);
        return {message: "Erro ao consultar os computadores", success: false}
    }
}