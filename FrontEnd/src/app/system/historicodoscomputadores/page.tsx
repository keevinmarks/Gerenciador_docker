"use client";

import { useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";

type UnifiedHist = {
  id?: string | number | null;
  source: "Computador" | "Impressora" | "Usuário";
  nome: string;
  tipo?: string | null;
  mac?: string | null;
  tombo?: string | number | null;
  problema?: string | null;
  status?: string | null;
  motivo?: string | null;
  action?: string | null;
  actorName?: string | null;
  when: string;
  image?: string | null;
};

/* ======================
   VARIANTS
====================== */

const page: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 18 },
  },
};

const stagger: Variants = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.18 } },
};

// modal variants removed (history page is read-only)

/* ======================
   COMPONENT
====================== */

const ComputerList = () => {
  const [merged, setMerged] = useState<UnifiedHist[]>([]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const res = await fetch('/api/history');
        const arr = (await res.json().catch(() => [])) as unknown[];

        const mapped: UnifiedHist[] = (arr || []).map((it: unknown) => {
          const item = it as Record<string, unknown>;
          const source = typeof item.source === 'string' ? (item.source as UnifiedHist['source']) : 'Computador';
          const when = typeof item.when === 'string' ? item.when : new Date().toISOString();
          const entry = (item.entry as Record<string, unknown>) ?? {};

          const id = typeof entry.id === 'string' || typeof entry.id === 'number' ? entry.id : null;
          const nome = typeof entry.nome === 'string' ? entry.nome : typeof entry.name === 'string' ? entry.name : '-';
          const tipo = typeof entry.tipo === 'string' ? entry.tipo : typeof entry.type === 'string' ? entry.type : null;
          const mac = typeof entry.mac === 'string' ? entry.mac : null;
          const tombo = typeof entry.tombo === 'string' || typeof entry.tombo === 'number' ? entry.tombo : null;
          const problema = typeof entry.Problema === 'string' ? entry.Problema : typeof entry.problema === 'string' ? entry.problema : null;
          const status = typeof entry.status === 'string' ? entry.status : null;
          const motivo = typeof entry.motivo === 'string' ? entry.motivo : null;
          const action = typeof entry.action === 'string' ? entry.action : (typeof entry.motivo === 'string' ? entry.motivo : null);
          const actorName = typeof entry.actorName === 'string' ? entry.actorName : null;
          const image = typeof entry.image === 'string' ? entry.image : typeof entry.gif === 'string' ? entry.gif : null;

          return {
            id,
            source,
            nome,
            tipo,
            mac,
            tombo,
            problema,
            status,
            motivo,
            action,
            actorName,
            image,
            when,
          } as UnifiedHist;
        });

        const combined = mapped.sort((a, b) => new Date(b.when).getTime() - new Date(a.when).getTime());
        if (mounted) setMerged(combined);
      } catch (err) {
        console.error('Failed to load history', err);
        if (mounted) setMerged([]);
      }
    };

    void load();

    return () => {
      mounted = false;
    };
  }, []);

  // read-only history page — images not used here

  const formatDate = (v?: string) => (v ? new Date(v).toLocaleString() : "-");

  const counts = {
    computadores: merged.filter((m) => m.source === "Computador").length,
    impressoras: merged.filter((m) => m.source === "Impressora").length,
    usuarios: merged.filter((m) => m.source === "Usuário").length,
  };

  type Tab = "Todos" | UnifiedHist["source"];
  const [selected, setSelected] = useState<Tab>("Todos");

  const visible = selected === "Todos" ? merged : merged.filter((m) => m.source === (selected as UnifiedHist["source"]));

  const tabCount = (t: Tab) => {
    if (t === "Todos") return merged.length;
    if (t === "Computador") return counts.computadores;
    if (t === "Impressora") return counts.impressoras;
    return counts.usuarios;
  };

  const sourceBadge = (s: UnifiedHist["source"]) => {
    if (s === "Computador") return "bg-indigo-100 text-indigo-800";
    if (s === "Impressora") return "bg-green-100 text-green-800";
    return "bg-yellow-100 text-yellow-800";
  };

  const actionBadge = (a?: string | null) => {
    if (!a) return "bg-gray-100 text-gray-800";
    const key = String(a).toLowerCase();
    if (key.includes("excl")) return "bg-red-100 text-red-800";
    if (key.includes("ativ") || key.includes("ativo")) return "bg-emerald-100 text-emerald-800";
    if (key.includes("edit")) return "bg-amber-100 text-amber-800";
    return "bg-blue-100 text-blue-800";
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 text-black"
      variants={page}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="flex items-center justify-between mb-4" variants={fadeUp}>
        <div>
          <h1 className="text-3xl font-bold">Histórico de Tudo</h1>
          <p className="text-sm text-gray-600">Registro imutável de ações no sistema.</p>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-2">
            {(["Todos", "Computador", "Impressora", "Usuário"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setSelected(t)}
                className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${selected === t ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
              >
                <span>{t}</span>
                <span className="text-xs opacity-80">({tabCount(t)})</span>
              </button>
            ))}
          </div>

          <div className="flex gap-3">
          <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 text-sm">
            <div className="text-xs text-gray-500">Total</div>
            <div className="font-semibold text-gray-800">{visible.length}</div>
          </div>
          <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 text-sm">
            <div className="text-xs text-gray-500">Computadores</div>
            <div className="font-semibold text-indigo-700">{counts.computadores}</div>
          </div>
          <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 text-sm">
            <div className="text-xs text-gray-500">Impressoras</div>
            <div className="font-semibold text-green-700">{counts.impressoras}</div>
          </div>
          <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 text-sm">
            <div className="text-xs text-gray-500">Usuários</div>
            <div className="font-semibold text-yellow-700">{counts.usuarios}</div>
          </div>
        </div>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="bg-white rounded-2xl shadow-xl p-4 border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-sm text-left text-gray-600 border-b">
                <th className="py-3 px-4">Data</th>
                <th className="py-3 px-4">Origem</th>
                <th className="py-3 px-4">Ação</th>
                <th className="py-3 px-4">Nome / Item</th>
                <th className="py-3 px-4">Detalhes</th>
                <th className="py-3 px-4">Responsável</th>
                <th className="py-3 px-4">Motivo</th>
              </tr>
            </thead>

            <motion.tbody className="text-sm" variants={stagger} initial="hidden" animate="visible">
              {visible.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 px-4 text-center text-gray-500">Nenhum registro no histórico</td>
                </tr>
              )}

              {visible.map((r, i) => (
                <motion.tr key={`${String(r.id)}-${i}`} variants={item} className="hover:bg-gray-50 even:bg-gray-50">
                  <td className="py-3 px-4 align-top w-36">{formatDate(r.when)}</td>
                  <td className="py-3 px-4 align-top">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${sourceBadge(r.source)}`}>{r.source}</span>
                  </td>
                  <td className="py-3 px-4 align-top">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${actionBadge(r.action)}`}>{r.action ?? "-"}</span>
                  </td>
                  <td className="py-3 px-4 align-top font-medium">{r.nome}</td>
                  <td className="py-3 px-4 align-top">
                    <div className="text-gray-600 text-xs space-y-1">
                      {r.tipo ? <div>Tipo: {r.tipo}</div> : null}
                      {r.mac ? <div>MAC: {r.mac}</div> : null}
                      {r.tombo ? <div>Tombo: {r.tombo}</div> : null}
                      {r.status ? <div>Status: {r.status}</div> : null}
                      {r.image ? (
                        <div className="mt-2">
                          <img src={r.image} alt="preview" className="max-h-24 rounded-md border" />
                        </div>
                      ) : null}
                    </div>
                  </td>
                  <td className="py-3 px-4 align-top">{r.actorName ?? "-"}</td>
                  <td className="py-3 px-4 align-top">{r.motivo ?? "-"}</td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ComputerList;
