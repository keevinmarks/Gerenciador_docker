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

export const addComputerHistory = (entry: Omit<ComputerHist, "when">) => {
  if (typeof window === "undefined") return;
  const raw = localStorage.getItem(KEY_COMPUTERS);
  const arr = safeParse<ComputerHist>(raw);
  arr.unshift({ ...entry, when: new Date().toISOString() });
  localStorage.setItem(KEY_COMPUTERS, JSON.stringify(arr.slice(0, 500)));
};

export const getComputerHistory = (): ComputerHist[] => {
  if (typeof window === "undefined") return [];
  return safeParse<ComputerHist>(localStorage.getItem(KEY_COMPUTERS));
};

export const addPrinterHistory = (entry: Omit<PrinterHist, "when">) => {
  if (typeof window === "undefined") return;
  const raw = localStorage.getItem(KEY_PRINTERS);
  const arr = safeParse<PrinterHist>(raw);
  arr.unshift({ ...entry, when: new Date().toISOString() });
  localStorage.setItem(KEY_PRINTERS, JSON.stringify(arr.slice(0, 500)));
};

export const getPrinterHistory = (): PrinterHist[] => {
  if (typeof window === "undefined") return [];
  return safeParse<PrinterHist>(localStorage.getItem(KEY_PRINTERS));
};

const KEY_USERS = "history_users_v1";

export const addUserHistory = (entry: Omit<UserHistWithActor, "when">) => {
  if (typeof window === "undefined") return;
  const raw = localStorage.getItem(KEY_USERS);
  const arr = safeParse<UserHistWithActor>(raw);
  arr.unshift({ ...entry, when: new Date().toISOString() });
  localStorage.setItem(KEY_USERS, JSON.stringify(arr.slice(0, 500)));
};

export const getUserHistory = (): UserHistWithActor[] => {
  if (typeof window === "undefined") return [];
  return safeParse<UserHistWithActor>(localStorage.getItem(KEY_USERS));
};

export const clearHistory = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY_COMPUTERS);
  localStorage.removeItem(KEY_PRINTERS);
};
