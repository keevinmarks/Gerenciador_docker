import { Printer } from "@/types/types";

const resolveApiBase = () => {
  // If browser, prefer same host and port 3001 (works when frontend served from host)
  if (typeof window !== "undefined") {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    return `${protocol}//${hostname}:3001`;
  }

  // Else (build/server) use env vars or localhost
  if (typeof process !== "undefined" && process.env) {
    return process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001";
  }

  return "http://localhost:3001";
};

const API_URL = `${resolveApiBase()}/printers`;

/* =======================
   INSERT
======================= */
export const insertPrinter = async (
  printer: Omit<Printer, "id_printer">
): Promise<{ success: boolean; message?: string }> => {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(printer),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = (json && (json.message || json.error)) || "Erro ao inserir impressora";
      throw new Error(msg);
    }

    return json;
  } catch (error) {
    console.error("insertPrinter:", error);
    return { success: false, message: (error as Error).message };
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
): Promise<{ success: boolean; message?: string }> => {
  try {
    const res = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(printer),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = (json && (json.message || json.error)) || "Erro ao atualizar impressora";
      return { success: false, message: msg };
    }

    return json;
  } catch (error) {
    console.error("updatePrinter:", error);
    return { success: false, message: (error as Error).message };
  }
};

/* =======================
   DELETE
======================= */
export const deletePrinter = async (
  id: number
): Promise<{ success: boolean; message?: string }> => {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = (json && (json.message || json.error)) || "Erro ao deletar impressora";
      return { success: false, message: msg };
    }

    return json;
  } catch (error) {
    console.error("deletePrinter:", error);
    return { success: false, message: (error as Error).message };
  }
};
