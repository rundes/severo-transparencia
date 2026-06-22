"use client";

import { useEffect, useMemo, useState } from "react";
import { AgrupacionLogo } from "@/components/agrupacion-logo";
import { fmtNum, fmtPct } from "@/lib/format";
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

  if (loading) return <p className="text-sm text-neutral-500">Generando índice desde el API…</p>;
  if (error) return <p className="text-sm text-red-400">{error}</p>;

  return (
    <div className="flex flex-col gap-4">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={`Buscar entre ${data.length} agrupaciones…`}
        className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-neutral-600"
      />
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {filtradas.map((a) => {
          const open = abierta === a.nombre;
          return (
            <div key={a.nombre} className="rounded-lg border border-neutral-800 bg-neutral-900/50">
              <button
                onClick={() => setAbierta(open ? null : a.nombre)}
                className="flex w-full items-center gap-3 p-3 text-left"
              >
                <AgrupacionLogo nombre={a.nombre} urlLogo={a.urlLogo} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{a.nombre}</div>
                  <div className="text-xs text-neutral-500">
                    Mejor: {fmtPct(a.mejorPct)} · {a.aniosActiva.length} elección(es) · {a.aniosActiva.join(", ")}
                  </div>
                </div>
                <span className="text-neutral-600">{open ? "−" : "+"}</span>
              </button>
              {open && (
                <div className="border-t border-neutral-800 px-3 py-2">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-left text-neutral-500">
                        <th className="py-1">Año</th>
                        <th className="py-1">Cargo</th>
                        <th className="py-1 text-right">Votos</th>
                        <th className="py-1 text-right">%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {a.apariciones
                        .slice()
                        .sort((x, y) => y.anio.localeCompare(x.anio) || x.categoriaId - y.categoriaId)
                        .map((ap, i) => (
                          <tr key={i} className="border-t border-neutral-800/50">
                            <td className="py-1 tabular-nums">{ap.anio}</td>
                            <td className="py-1">{ap.cargo}</td>
                            <td className="py-1 text-right tabular-nums">{fmtNum(ap.votos)}</td>
                            <td className="py-1 text-right tabular-nums">{fmtPct(ap.pct)}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {filtradas.length === 0 && <p className="text-sm text-neutral-500">Sin coincidencias.</p>}
    </div>
  );
}
