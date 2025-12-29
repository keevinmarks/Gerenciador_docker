import { Computer } from "@/types/types";

const resolveApiBase = () => {
    if (typeof window !== "undefined") {
        const protocol = window.location.protocol;
        const hostname = window.location.hostname;
        return `${protocol}//${hostname}:3001`;
    }
    if (typeof process !== "undefined" && process.env) {
        return process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001";
    }
    return "http://localhost:3001";
};

const API_BASE = resolveApiBase();

export const insertComputer = async (computer: Computer) => {
    try {
        const res = await fetch(`${API_BASE}/computers`, {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(computer),
        });
        return await res.json().catch(() => ({ success: res.ok }));
    } catch (error) {
        console.error("Erro ao tentar inserir computador:", error);
        return { message: "Erro ao tentar inserir computador", success: false };
    }
};

export const getComputers = async (): Promise<Computer[]> => {
    try {
        const res = await fetch(`${API_BASE}/computers`, { cache: "no-store" });
        if (!res.ok) return [];
        const json = await res.json();
        return Array.isArray(json.data) ? json.data : [];
    } catch (error) {
        console.error("Erro ao consultar computadores:", error);
        return [];
    }
};

export const updateComputers = async (computer: Computer) => {
    try {
        const resp = await fetch(`${API_BASE}/computers`, {
            method: "PUT",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(computer),
        });
        return await resp.json().catch(() => ({ success: resp.ok }));
    } catch (error) {
        console.error("Erro ao atualizar o computador:", error);
        return { message: "Erro ao atualizar o computador", success: false };
    }
};

export const deleteComputer = async (computer_id: number) => {
    try {
        const resp = await fetch(`${API_BASE}/computers/${computer_id}`, {
            method: "DELETE",
            headers: { "Content-type": "application/json" },
        });
        return await resp.json().catch(() => ({ success: resp.ok }));
    } catch (error) {
        console.error("Erro ao deletar o computador:", error);
        return { message: "Erro ao deletar o computador", success: false };
    }
};