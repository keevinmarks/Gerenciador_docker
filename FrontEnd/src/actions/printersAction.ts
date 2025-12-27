"use server";

import { Printer } from "@/types/types";

const API_URL = "http://api:3001/printers";

/* =======================
   INSERT
======================= */
export const insertPrinter = async (
  printer: Omit<Printer, "id_printer">
): Promise<{ success: boolean }> => {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(printer),
    });

    if (!res.ok) {
      throw new Error("Erro ao inserir impressora");
    }

    return await res.json();
  } catch (error) {
    console.error("insertPrinter:", error);
    return { success: false };
  }
};

/* =======================
   GET
======================= */
export const getPrinters = async (): Promise<Printer[]> => {
  try {
    const res = await fetch(API_URL, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Erro ao buscar impressoras");
    }

    const json = await res.json();

    return Array.isArray(json.data) ? json.data : [];
  } catch (error) {
    console.error("getPrinters:", error);
    return [];
  }
};

/* =======================
   UPDATE
======================= */
export const updatePrinter = async (
  printer: Printer
): Promise<{ success: boolean }> => {
  try {
    const res = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(printer),
    });

    if (!res.ok) {
      throw new Error("Erro ao atualizar impressora");
    }

    return await res.json();
  } catch (error) {
    console.error("updatePrinter:", error);
    return { success: false };
  }
};

/* =======================
   DELETE
======================= */
export const deletePrinter = async (
  id: number
): Promise<{ success: boolean }> => {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Erro ao deletar impressora");
    }

    return await res.json();
  } catch (error) {
    console.error("deletePrinter:", error);
    return { success: false };
  }
};
