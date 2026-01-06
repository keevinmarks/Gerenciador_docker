export type ComputerHist = {
  id?: number | null;
  tipo?: string;
  nome?: string;
  mac?: string;
  tombo?: string | number;
  Problema?: string;
  status?: string;
  motivo?: string;
  actorId?: string | number | null;
  actorName?: string | null;
  action?: string | null;
  when: string; // ISO timestamp
};

export type PrinterHist = ComputerHist;

export type UserHist = {
  id?: string | number | null;
  nome?: string;
  email?: string;
  nivel?: string;
  status?: string;
  motivo?: string;
  when: string;
};

// actor who performed the action and action type
export type UserHistWithActor = UserHist & {
  actorId?: string | number | null;
  actorName?: string | null;
  action?: string | null; // e.g., 'Excluído', 'Editado', 'Ativado'
};

const KEY_COMPUTERS = "history_computers_v1";
const KEY_PRINTERS = "history_printers_v1";

const safeParse = <T>(v: string | null): T[] => {
  if (!v) return [] as T[];
  try {
    const parsed = JSON.parse(v);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [] as T[];
  }
};

const API_HISTORY = "/api/history";
type HistoryApiRecord = {
  source: string;
  entry: Record<string, unknown>;
  when: string;
};

type HistoryPostPayload = {
  source: string;
  entry: Record<string, unknown>;
};

async function fetchHistoryFromApi(): Promise<HistoryApiRecord[]> {
  try {
    const res = await fetch(API_HISTORY, { cache: "no-store" });
    if (!res.ok) throw new Error("api history fetch failed");
    const json = await res.json();
    return Array.isArray(json) ? (json as HistoryApiRecord[]) : (json.data ?? []);
  } catch (err) {
    console.warn("fetchHistoryFromApi error:", err);
    return [];
  }
}

async function postHistoryToApi(payload: HistoryPostPayload): Promise<boolean> {
  try {
    const res = await fetch(API_HISTORY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch (err) {
    console.warn("postHistoryToApi error:", err);
    return false;
  }
}

export const addComputerHistory = async (entry: Omit<ComputerHist, "when">) => {
  if (typeof window === "undefined") return;
  const payload = { source: "Computador", entry: { ...entry } };
  const ok = await postHistoryToApi(payload);
  if (!ok) {
    // fallback localStorage
    const raw = localStorage.getItem(KEY_COMPUTERS);
    const arr = safeParse<ComputerHist>(raw);
    arr.unshift({ ...entry, when: new Date().toISOString() });
    localStorage.setItem(KEY_COMPUTERS, JSON.stringify(arr.slice(0, 500)));
  }
};

export const getComputerHistory = async (): Promise<ComputerHist[]> => {
  if (typeof window === "undefined") return [];
  const api = await fetchHistoryFromApi();
  if (api && api.length > 0) {
    return api.filter((x) => x.source === "Computador").map((i) => ({ ...(i.entry || i), when: i.when }));
  }
  return safeParse<ComputerHist>(localStorage.getItem(KEY_COMPUTERS));
};

export const addPrinterHistory = async (entry: Omit<PrinterHist, "when">) => {
  if (typeof window === "undefined") return;
  const payload = { source: "Impressora", entry: { ...entry } };
  const ok = await postHistoryToApi(payload);
  if (!ok) {
    const raw = localStorage.getItem(KEY_PRINTERS);
    const arr = safeParse<PrinterHist>(raw);
    arr.unshift({ ...entry, when: new Date().toISOString() });
    localStorage.setItem(KEY_PRINTERS, JSON.stringify(arr.slice(0, 500)));
  }
};

export const getPrinterHistory = async (): Promise<PrinterHist[]> => {
  if (typeof window === "undefined") return [];
  const api = await fetchHistoryFromApi();
  if (api && api.length > 0) {
    return api.filter((x) => x.source === "Impressora").map((i) => ({ ...(i.entry || i), when: i.when }));
  }
  return safeParse<PrinterHist>(localStorage.getItem(KEY_PRINTERS));
};

const KEY_USERS = "history_users_v1";

export const addUserHistory = async (entry: Omit<UserHistWithActor, "when">) => {
  if (typeof window === "undefined") return;
  const payload = { source: "Usuário", entry: { ...entry } };
  const ok = await postHistoryToApi(payload);
  if (!ok) {
    const raw = localStorage.getItem(KEY_USERS);
    const arr = safeParse<UserHistWithActor>(raw);
    arr.unshift({ ...entry, when: new Date().toISOString() });
    localStorage.setItem(KEY_USERS, JSON.stringify(arr.slice(0, 500)));
  }
};

export const getUserHistory = async (): Promise<UserHistWithActor[]> => {
  if (typeof window === "undefined") return [];
  const api = await fetchHistoryFromApi();
  if (api && api.length > 0) {
    return api.filter((x) => x.source === "Usuário").map((i) => ({ ...(i.entry || i), when: i.when }));
  }
  return safeParse<UserHistWithActor>(localStorage.getItem(KEY_USERS));
};

export const clearHistory = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY_COMPUTERS);
  localStorage.removeItem(KEY_PRINTERS);
};
