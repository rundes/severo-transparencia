"use client";

import { useEffect, useMemo, useState } from "react";
import { CARGOS_NACIONALES, TIPOS_ELECCION } from "@/lib/dine/catalogs";
import { LineChart, type Serie } from "@/components/line-chart";
import { ACCENT, colorFor, fmtNum, fmtPct } from "@/lib/format";
import { Field, Notice } from "@/components/ui";
import type { PuntoComparacion } from "../api/comparar/route";

export function Comparator() {
  const [tipo, setTipo] = useState("2");
  const [cargo, setCargo] = useState("1");
  const [puntos, setPuntos] = useState<PuntoComparacion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sel, setSel] = useState<string[]>([]);

  useEffect(() => {
    const ctrl = new AbortController();
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/comparar?tipoEleccion=${tipo}&categoriaId=${cargo}`, { signal: ctrl.signal });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? `Error ${res.status}`);
        setPuntos(json.puntos);
      } catch (e) {
        if (e instanceof Error && e.name === "AbortError") return;
        setError(e instanceof Error ? e.message : "Error");
        setPuntos([]);
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => ctrl.abort();
  }, [tipo, cargo]);

  const xLabels = puntos.map((p) => p.anio);

  // Unión de agrupaciones (ordenadas por mejor % alcanzado), para el selector.
  const agrupaciones = useMemo(() => {
    const best = new Map<string, number>();
    for (const p of puntos) for (const a of p.positivos) best.set(a.nombre, Math.max(best.get(a.nombre) ?? 0, a.pct));
    return [...best.entries()].sort((a, b) => b[1] - a[1]).map(([nombre]) => nombre);
  }, [puntos]);

  // Default: trackear las 3 agrupaciones top del año más reciente.
  useEffect(() => {
    if (puntos.length && sel.length === 0) {
      const last = puntos[puntos.length - 1];
      setSel(last.positivos.slice(0, 3).map((a) => a.nombre));
    }
  }, [puntos]); // eslint-disable-line react-hooks/exhaustive-deps

  const participacionSerie: Serie[] = [
    { label: "Participación", color: ACCENT, values: puntos.map((p) => p.participacionPorcentaje) },
  ];

  const agrupSeries: Serie[] = sel.map((nombre, i) => ({
    label: nombre,
    color: colorFor(i),
    values: puntos.map((p) => p.positivos.find((a) => a.nombre === nombre)?.pct ?? null),
  }));

  function toggle(nombre: string) {
    setSel((s) => (s.includes(nombre) ? s.filter((x) => x !== nombre) : [...s, nombre]));
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-2 gap-3 sm:max-w-md">
        <Field label="Cargo" value={cargo} onChange={setCargo} options={CARGOS_NACIONALES.map((c) => [String(c.idCargo), c.nombre])} />
        <Field label="Elección" value={tipo} onChange={setTipo} options={TIPOS_ELECCION.map((t) => [t.id, t.nombre])} />
      </div>

      {loading && <Notice kind="muted">Cargando años…</Notice>}
      {error && <Notice>{error}</Notice>}
      {!loading && !error && puntos.length === 0 && <Notice kind="muted">Sin datos para esta combinación.</Notice>}

      {puntos.length > 0 && (
        <>
          <ChartSection title="Participación por año">
            <LineChart xLabels={xLabels} series={participacionSerie} />
          </ChartSection>

          <ChartSection title="% por agrupación">
            <LineChart xLabels={xLabels} series={agrupSeries} />
            <div className="mt-4 flex flex-wrap gap-2">
              {agrupaciones.map((nombre) => {
                const active = sel.includes(nombre);
                const i = sel.indexOf(nombre);
                return (
                  <button
                    key={nombre}
                    onClick={() => toggle(nombre)}
                    aria-pressed={active}
                    className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
                      active ? "border-transparent text-paper" : "border-rule-strong text-ink-soft hover:text-ink"
                    }`}
                    style={active ? { background: colorFor(i) } : undefined}
                  >
                    {nombre}
                  </button>
                );
              })}
            </div>
          </ChartSection>

          <ChartSection title="Ganador por año">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-rule-strong text-left text-[0.7rem] uppercase tracking-[0.08em] text-ink-faint">
                    <th className="py-2 pr-4 font-medium">Año</th>
                    <th className="py-2 pr-4 font-medium">Ganador</th>
                    <th className="py-2 pr-4 text-right font-medium">%</th>
                    <th className="py-2 pr-4 text-right font-medium">Participación</th>
                    <th className="py-2 text-right font-medium">Votantes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rule">
                  {puntos.map((p) => (
                    <tr key={p.anio} className="hover:bg-paper-2">
                      <td className="py-2 pr-4 tabular-nums text-ink-soft">{p.anio}</td>
                      <td className="py-2 pr-4 text-ink">{p.positivos[0]?.nombre ?? "—"}</td>
                      <td className="py-2 pr-4 text-right font-medium tabular-nums">{p.positivos[0] ? fmtPct(p.positivos[0].pct) : "—"}</td>
                      <td className="py-2 pr-4 text-right tabular-nums text-ink-soft">{fmtPct(p.participacionPorcentaje)}</td>
                      <td className="py-2 text-right tabular-nums text-ink-soft">{fmtNum(p.cantidadVotantes)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartSection>
        </>
      )}
    </div>
  );
}

function ChartSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-ink-faint">{title}</h2>
      {children}
    </section>
  );
}
