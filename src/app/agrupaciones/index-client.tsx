"use client";

import { useEffect, useMemo, useState } from "react";
import { AgrupacionLogo } from "@/components/agrupacion-logo";
import { fmtNum, fmtPct } from "@/lib/format";
import { Notice } from "@/components/ui";
import type { AgrupacionIndice } from "../api/agrupaciones/route";

export function AgrupacionesIndex() {
  const [data, setData] = useState<AgrupacionIndice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [abierta, setAbierta] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/agrupaciones");
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? `Error ${res.status}`);
        setData(json.agrupaciones);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtradas = useMemo(() => {
    const t = q.trim().toLowerCase();
    return t ? data.filter((a) => a.nombre.toLowerCase().includes(t)) : data;
  }, [data, q]);

  if (loading) return <Notice kind="muted">Generando índice desde el API…</Notice>;
  if (error) return <Notice>{error}</Notice>;

  return (
    <div className="flex flex-col gap-5">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={`Buscar entre ${data.length} agrupaciones…`}
        className="w-full rounded-md border border-rule-strong bg-paper px-3 py-2 text-sm text-ink placeholder:text-ink-faint transition-colors hover:border-ink-faint focus:border-accent focus:outline-none"
      />
      <ul className="border-t border-rule">
        {filtradas.map((a) => {
          const open = abierta === a.nombre;
          return (
            <li key={a.nombre} className="border-b border-rule">
              <button
                onClick={() => setAbierta(open ? null : a.nombre)}
                aria-expanded={open}
                className="flex w-full items-center gap-3 py-3 text-left transition-colors hover:bg-paper-2"
              >
                <AgrupacionLogo nombre={a.nombre} urlLogo={a.urlLogo} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-ink">{a.nombre}</div>
                  <div className="text-xs text-ink-faint">
                    Mejor: <span className="tabular-nums">{fmtPct(a.mejorPct)}</span> · {a.aniosActiva.length} elección(es) · {a.aniosActiva.join(", ")}
                  </div>
                </div>
                <span className="shrink-0 text-base text-ink-faint">{open ? "−" : "+"}</span>
              </button>
              {open && (
                <div className="animate-rise pb-3 pl-[3.25rem]">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-rule text-left text-[0.65rem] uppercase tracking-[0.08em] text-ink-faint">
                        <th className="py-1.5 pr-3 font-medium">Año</th>
                        <th className="py-1.5 pr-3 font-medium">Cargo</th>
                        <th className="py-1.5 pr-3 text-right font-medium">Votos</th>
                        <th className="py-1.5 text-right font-medium">%</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-rule">
                      {a.apariciones
                        .slice()
                        .sort((x, y) => y.anio.localeCompare(x.anio) || x.categoriaId - y.categoriaId)
                        .map((ap, i) => (
                          <tr key={i}>
                            <td className="py-1.5 pr-3 tabular-nums text-ink-soft">{ap.anio}</td>
                            <td className="py-1.5 pr-3 text-ink-soft">{ap.cargo}</td>
                            <td className="py-1.5 pr-3 text-right tabular-nums text-ink-soft">{fmtNum(ap.votos)}</td>
                            <td className="py-1.5 text-right font-medium tabular-nums text-ink">{fmtPct(ap.pct)}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {filtradas.length === 0 && <Notice kind="muted">Sin coincidencias.</Notice>}
    </div>
  );
}
