"use client";

import { useEffect, useMemo, useState } from "react";
import { Choropleth } from "@/components/choropleth";
import { CARGOS_NACIONALES } from "@/lib/dine/catalogs";
import { Field, Notice } from "@/components/ui";
import type { EleccionMenu } from "@/lib/dine/v2-types";
import type { DistritoGanador } from "../api/mapa/route";

interface EleccionItem {
  anio: number;
  idEleccion: number;
  nombre: string;
}

export function MapaClient() {
  const [geo, setGeo] = useState<unknown>(null);
  const [elecciones, setElecciones] = useState<EleccionItem[]>([]);
  const [anio, setAnio] = useState<number | null>(null);
  const [idEleccion, setIdEleccion] = useState<number | null>(null);
  const [idCargo, setIdCargo] = useState("1");
  const [distritos, setDistritos] = useState<DistritoGanador[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/provincias.geojson").then((r) => r.json()).then(setGeo).catch((e) => setError(String(e)));
    fetch("/api/menu")
      .then((r) => r.json())
      .then((j: { elecciones: EleccionMenu[] }) => {
        const items = j.elecciones
          .map((e) => ({ anio: e.Año, idEleccion: e.IdEleccion, nombre: e.Elecciones }))
          .sort((a, b) => b.anio - a.anio || a.idEleccion - b.idEleccion);
        setElecciones(items);
        if (items.length) {
          setAnio(items[0].anio);
          setIdEleccion(items[0].idEleccion);
        }
      })
      .catch((e) => setError(String(e)));
  }, []);

  const aniosDisponibles = useMemo(() => [...new Set(elecciones.map((e) => e.anio))], [elecciones]);
  const eleccionesDelAnio = useMemo(() => elecciones.filter((e) => e.anio === anio), [elecciones, anio]);

  useEffect(() => {
    if (anio == null || idEleccion == null) return;
    const ctrl = new AbortController();
    setLoading(true);
    setError("");
    fetch(`/api/mapa?anio=${anio}&idEleccion=${idEleccion}&idCargo=${idCargo}`, { signal: ctrl.signal })
      .then(async (r) => {
        const j = await r.json();
        if (!r.ok) throw new Error(j.error ?? `Error ${r.status}`);
        setDistritos(j.distritos);
      })
      .catch((e) => {
        if (e instanceof Error && e.name === "AbortError") return;
        setError(e instanceof Error ? e.message : "Error");
        setDistritos([]);
      })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, [anio, idEleccion, idCargo]);

  // Leyenda: agrupaciones ganadoras únicas + cuántas provincias ganaron.
  const leyenda = useMemo(() => {
    const m = new Map<string, { color: string; n: number }>();
    for (const d of distritos) {
      const e = m.get(d.ganador) ?? { color: d.color, n: 0 };
      e.n++;
      m.set(d.ganador, e);
    }
    return [...m.entries()].sort((a, b) => b[1].n - a[1].n);
  }, [distritos]);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-3 sm:max-w-lg">
        <Field label="Año" value={String(anio ?? "")} onChange={(v) => setAnio(Number(v))} options={aniosDisponibles.map((a) => [String(a), String(a)])} />
        <Field label="Elección" value={String(idEleccion ?? "")} onChange={(v) => setIdEleccion(Number(v))} options={eleccionesDelAnio.map((e) => [String(e.idEleccion), e.nombre])} />
        <Field label="Cargo" value={idCargo} onChange={setIdCargo} options={CARGOS_NACIONALES.map((c) => [String(c.idCargo), c.nombre])} />
      </div>

      {error && <Notice>{error}</Notice>}
      {loading && <Notice kind="muted">Cargando mapa…</Notice>}

      <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
        <div className="shrink-0">{geo ? <Choropleth geo={geo as never} distritos={distritos} /> : null}</div>
        <div className="min-w-0 flex-1">
          <h2 className="mb-3 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-ink-faint">Ganador por provincia</h2>
          <ul className="divide-y divide-rule border-t border-rule">
            {leyenda.map(([nombre, { color, n }]) => (
              <li key={nombre} className="flex items-center gap-2.5 py-2 text-sm">
                <span className="inline-block h-3 w-3 shrink-0 rounded-[2px]" style={{ background: color }} />
                <span className="min-w-0 flex-1 truncate text-ink">{nombre}</span>
                <span className="tabular-nums text-ink-faint">{n}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
