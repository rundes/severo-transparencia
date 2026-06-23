"use client";

import { useEffect, useMemo, useState } from "react";
import { CARGOS_NACIONALES, TIPOS_ELECCION } from "@/lib/dine/catalogs";
import { LineChart, type Serie } from "@/components/line-chart";
import { colorFor, fmtNum, fmtPct } from "@/lib/format";
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
    { label: "Participación", color: "#38bdf8", values: puntos.map((p) => p.participacionPorcentaje) },
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
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 gap-3 sm:max-w-md">
        <Select label="Cargo" value={cargo} onChange={setCargo} options={CARGOS_NACIONALES.map((c) => [String(c.idCargo), c.nombre])} />
        <Select label="Elección" value={tipo} onChange={setTipo} options={TIPOS_ELECCION.map((t) => [t.id, t.nombre])} />
      </div>

      {loading && <p className="text-sm text-neutral-500">Cargando años…</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}
      {!loading && !error && puntos.length === 0 && (
        <p className="text-sm text-neutral-500">Sin datos para esta combinación.</p>
      )}

      {puntos.length > 0 && (
        <>
          <section>
            <h2 className="mb-2 text-sm font-semibold text-neutral-300">Participación por año</h2>
            <LineChart xLabels={xLabels} series={participacionSerie} />
          </section>

          <section>
            <h2 className="mb-2 text-sm font-semibold text-neutral-300">% por agrupación</h2>
            <LineChart xLabels={xLabels} series={agrupSeries} />
            <div className="mt-3 flex flex-wrap gap-2">
              {agrupaciones.map((nombre) => {
                const active = sel.includes(nombre);
                const i = sel.indexOf(nombre);
                return (
                  <button
                    key={nombre}
                    onClick={() => toggle(nombre)}
                    className={`rounded-full border px-2.5 py-1 text-xs ${
                      active ? "border-transparent text-black" : "border-neutral-800 text-neutral-400"
                    }`}
                    style={active ? { background: colorFor(i) } : undefined}
                  >
                    {nombre}
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <h2 className="mb-2 text-sm font-semibold text-neutral-300">Ganador por año</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="text-left text-neutral-400">
                    <th className="border border-neutral-800 px-3 py-1.5">Año</th>
                    <th className="border border-neutral-800 px-3 py-1.5">Ganador</th>
                    <th className="border border-neutral-800 px-3 py-1.5">%</th>
                    <th className="border border-neutral-800 px-3 py-1.5">Participación</th>
                    <th className="border border-neutral-800 px-3 py-1.5">Votantes</th>
                  </tr>
                </thead>
                <tbody>
                  {puntos.map((p) => (
                    <tr key={p.anio}>
                      <td className="border border-neutral-800 px-3 py-1.5 tabular-nums">{p.anio}</td>
                      <td className="border border-neutral-800 px-3 py-1.5">{p.positivos[0]?.nombre ?? "—"}</td>
                      <td className="border border-neutral-800 px-3 py-1.5 tabular-nums">
                        {p.positivos[0] ? fmtPct(p.positivos[0].pct) : "—"}
                      </td>
                      <td className="border border-neutral-800 px-3 py-1.5 tabular-nums">{fmtPct(p.participacionPorcentaje)}</td>
                      <td className="border border-neutral-800 px-3 py-1.5 tabular-nums">{fmtNum(p.cantidadVotantes)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <label className="flex flex-col gap-1 text-xs text-neutral-400">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-neutral-800 bg-neutral-900 px-2 py-1.5 text-sm text-white outline-none focus:border-neutral-600"
      >
        {options.map(([v, t]) => (
          <option key={v} value={v}>
            {t}
          </option>
        ))}
      </select>
    </label>
  );
}
