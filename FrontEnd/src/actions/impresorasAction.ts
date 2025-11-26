import { Impressora } from "@/types/types";

const BASE_URL = "http://api:3001/impressora";

export const getImpressoras = async (): Promise<Impressora[]> => {
  const res = await fetch(BASE_URL, { method: "GET", cache: "no-store" });
  if (!res.ok) throw new Error("Erro ao buscar impressoras");
  return res.json();
};

export const insertImpressora = async (data: Impressora): Promise<Impressora> => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao inserir impressora");
  return res.json();
};

export const updateImpressora = async (
  id: number,
  data: Partial<Impressora>
): Promise<Impressora> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao atualizar impressora");
  return res.json();
};

export const deleteImpressora = async (id: number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Erro ao deletar impressora");
};
