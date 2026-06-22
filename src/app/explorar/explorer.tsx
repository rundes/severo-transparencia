"use client";

import { useEffect, useState } from "react";
import { ANIOS_DISPONIBLES, CARGOS_NACIONALES, DISTRITOS, TIPOS_ELECCION } from "@/lib/dine/catalogs";
import type { ResultadosResponse, ValoresTotalizadosOtros } from "@/lib/dine/types";
import { colorFor, fmtNum, fmtPct } from "@/lib/format";

function otros(r: ResultadosResponse): ValoresTotalizadosOtros | null {
  const o = r.valoresTotalizadosOtros;
  return Array.isArray(o) ? o[0] ?? null : o ?? null;
}

export function Explorer() {
  const [anio, setAnio] = useState<string>("2023");
  const [tipo, setTipo] = useState<string>("2");
  const [cargo, setCargo] = useState<string>("1");
  const [distrito, setDistrito] = useState<string>("");
  const [data, setData] = useState<ResultadosResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const ctrl = new AbortController();
    async function load() {
      setLoading(true);
      setError("");
      const qs = new URLSearchParams({ anioEleccion: anio, tipoEleccion: tipo, categoriaId: cargo });
      if (distrito) qs.set("distritoId", distrito);
      try {
        const res = await fetch(`/api/resultados?${qs}`, { signal: ctrl.signal });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? `Error ${res.status}`);
        setData(json);
      } catch (e) {
        if (e instanceof Error && e.name === "AbortError") return;
        setError(e instanceof Error ? e.message : "Error");
        setData(null);
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => ctrl.abort();
  }, [anio, tipo, cargo, distrito]);

  const positivos = data ? [...data.valoresTotalizadosPositivos].sort((a, b) => b.votos - a.votos) : [];
  const o = data ? otros(data) : null;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Select label="Año" value={anio} onChange={setAnio} options={ANIOS_DISPONIBLES.map((a) => [a, a])} />
        <Select label="Elección" value={tipo} onChange={setTipo} options={TIPOS_ELECCION.map((t) => [t.id, t.nombre])} />
        <Select label="Cargo" value={cargo} onChange={setCargo} options={CARGOS_NACIONALES.map((c) => [String(c.categoriaId), c.nombre])} />
        <Select label="Distrito" value={distrito} onChange={setDistrito} options={[["", "Todo el país"], ...DISTRITOS.map((d) => [d.id, d.nombre] as [string, string])]} />
      </div>

      {distrito && (
        <p className="rounded-lg border border-amber-900/50 bg-amber-950/30 p-2 text-xs text-amber-300/90">
          ⚠ A nivel provincia, el cargo seleccionado puede corresponder a un cargo local (no al
          nacional). El mapeo cargo↔distrito exacto requiere el catálogo getMenu (token). Para datos
          presidenciales/legislativos nacionales confiables, usá «Todo el país».
        </p>
      )}

      {loading && <p className="text-sm text-neutral-500">Cargando…</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}

      {data && !loading && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Participación" value={fmtPct(data.estadoRecuento.participacionPorcentaje)} />
            <Stat label="Mesas escrutadas" value={fmtPct(data.estadoRecuento.mesasTotalizadasPorcentaje)} />
            <Stat label="Electores" value={fmtNum(data.estadoRecuento.cantidadElectores)} />
            <Stat label="Votantes" value={fmtNum(data.estadoRecuento.cantidadVotantes)} />
          </div>

          <div className="flex flex-col gap-2">
            {positivos.map((a, i) => (
              <div key={a.idAgrupacion}>
                <div className="mb-0.5 flex justify-between text-sm">
                  <span className="truncate pr-2">{a.nombreAgrupacion}</span>
                  <span className="tabular-nums text-neutral-400">
                    {fmtPct(a.votosPorcentaje)} · {fmtNum(a.votos)}
                  </span>
                </div>
                <div className="h-2.5 w-full rounded bg-neutral-800">
                  <div
                    className="h-full rounded"
                    style={{ width: `${Math.min(a.votosPorcentaje, 100)}%`, background: colorFor(i) }}
                  />
                </div>
              </div>
            ))}
          </div>

          {o && (
            <div className="flex gap-4 text-xs text-neutral-500">
              <span>Nulos: {fmtNum(o.votosNulos)}</span>
              <span>Blanco: {fmtNum(o.votosEnBlanco)}</span>
              <span>Recurridos/Impugnados: {fmtNum(o.votosRecurridosComandoImpugnados)}</span>
            </div>
          )}
          <p className="text-xs text-neutral-600">
            Totalización: {new Date(data.fechaTotalizacion).toLocaleString("es-AR")} · recuento provisorio.
          </p>
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-3">
      <div className="text-xs text-neutral-500">{label}</div>
      <div className="mt-0.5 text-lg font-semibold tabular-nums">{value}</div>
    </div>
  );
}
