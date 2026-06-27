"use client";

import { useEffect, useMemo, useState } from "react";
import { Choropleth } from "@/components/choropleth";
import { CARGOS_NACIONALES } from "@/lib/dine/catalogs";
import { Field, Notice } from "@/components/ui";
import type { EleccionMenu } from "@/lib/dine/v2-types";
import { useMapData } from "./use-map-data";
import { computeFlips } from "./flips";

interface EleccionItem {
  anio: number;
  idEleccion: number;
  nombre: string;
}

export function MapaClient() {
  const [geo, setGeo] = useState<unknown>(null);
  const [elecciones, setElecciones] = useState<EleccionItem[]>([]);
  const [idCargo, setIdCargo] = useState("1");

  // Lado A (siempre) y lado B (solo en modo comparar).
  const [anio, setAnio] = useState<number | null>(null);
  const [idEleccion, setIdEleccion] = useState<number | null>(null);
  const [compare, setCompare] = useState(false);
  const [anioB, setAnioB] = useState<number | null>(null);
  const [idEleccionB, setIdEleccionB] = useState<number | null>(null);

  const [menuError, setMenuError] = useState("");

  useEffect(() => {
    fetch("/provincias.geojson").then((r) => r.json()).then(setGeo).catch((e) => setMenuError(String(e)));
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
      .catch((e) => setMenuError(String(e)));
  }, []);

  const a = useMapData(anio, idEleccion, idCargo);
  const b = useMapData(anioB, compare ? idEleccionB : null, idCargo);

  const aniosDisponibles = useMemo(() => [...new Set(elecciones.map((e) => e.anio))], [elecciones]);
  const eleccionesDelAnioA = useMemo(() => elecciones.filter((e) => e.anio === anio), [elecciones, anio]);
  const eleccionesDelAnioB = useMemo(() => elecciones.filter((e) => e.anio === anioB), [elecciones, anioB]);

  const nombreEleccion = (an: number | null, id: number | null) =>
    elecciones.find((e) => e.anio === an && e.idEleccion === id)?.nombre ?? "";

  function toggleCompare() {
    setCompare((c) => {
      const next = !c;
      if (next && idEleccionB == null && elecciones.length) {
        const other =
          elecciones.find((e) => !(e.anio === anio && e.idEleccion === idEleccion)) ?? elecciones[0];
        setAnioB(other.anio);
        setIdEleccionB(other.idEleccion);
      }
      return next;
    });
  }

  // Leyenda del modo simple: agrupaciones ganadoras y cuántas provincias ganaron.
  const leyenda = useMemo(() => {
    const m = new Map<string, { color: string; n: number }>();
    for (const d of a.distritos) {
      const e = m.get(d.ganador) ?? { color: d.color, n: 0 };
      e.n++;
      m.set(d.ganador, e);
    }
    return [...m.entries()].sort((x, y) => y[1].n - x[1].n);
  }, [a.distritos]);

  const flips = useMemo(
    () => (compare ? computeFlips(a.distritos, b.distritos) : []),
    [compare, a.distritos, b.distritos],
  );
  const highlight = useMemo(() => new Set(flips.map((f) => f.id)), [flips]);
  const mismaEleccion = compare && anio === anioB && idEleccion === idEleccionB;

  return (
    <div className="flex flex-col gap-6">
      {/* Controles */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="w-40">
            <Field label="Cargo" value={idCargo} onChange={setIdCargo} options={CARGOS_NACIONALES.map((c) => [String(c.idCargo), c.nombre])} />
          </div>
          <button
            onClick={toggleCompare}
            aria-pressed={compare}
            className={`mb-0.5 rounded-full border px-3 py-1.5 text-xs transition-colors ${
              compare ? "border-transparent bg-accent text-paper" : "border-rule-strong text-ink-soft hover:text-ink"
            }`}
          >
            Comparar
          </button>
        </div>

        {!compare ? (
          <div className="grid grid-cols-2 gap-3 sm:max-w-sm">
            <Field label="Año" value={String(anio ?? "")} onChange={(v) => setAnio(Number(v))} options={aniosDisponibles.map((y) => [String(y), String(y)])} />
            <Field label="Elección" value={String(idEleccion ?? "")} onChange={(v) => setIdEleccion(Number(v))} options={eleccionesDelAnioA.map((e) => [String(e.idEleccion), e.nombre])} />
          </div>
        ) : (
          <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2 sm:max-w-2xl">
            <Lado titulo="Elección A">
              <Field label="Año" value={String(anio ?? "")} onChange={(v) => setAnio(Number(v))} options={aniosDisponibles.map((y) => [String(y), String(y)])} />
              <Field label="Elección" value={String(idEleccion ?? "")} onChange={(v) => setIdEleccion(Number(v))} options={eleccionesDelAnioA.map((e) => [String(e.idEleccion), e.nombre])} />
            </Lado>
            <Lado titulo="Elección B">
              <Field label="Año" value={String(anioB ?? "")} onChange={(v) => setAnioB(Number(v))} options={aniosDisponibles.map((y) => [String(y), String(y)])} />
              <Field label="Elección" value={String(idEleccionB ?? "")} onChange={(v) => setIdEleccionB(Number(v))} options={eleccionesDelAnioB.map((e) => [String(e.idEleccion), e.nombre])} />
            </Lado>
          </div>
        )}
      </div>

      {menuError && <Notice>{menuError}</Notice>}

      {!compare ? (
        <SingleMap geo={geo} data={a} leyenda={leyenda} />
      ) : (
        <CompareMaps
          geo={geo}
          a={a}
          b={b}
          highlight={highlight}
          captionA={`${anio ?? ""} · ${nombreEleccion(anio, idEleccion)}`}
          captionB={`${anioB ?? ""} · ${nombreEleccion(anioB, idEleccionB)}`}
          flips={flips}
          mismaEleccion={mismaEleccion}
        />
      )}
    </div>
  );
}

function Lado({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-1 text-[0.7rem] font-medium uppercase tracking-[0.12em] text-ink-faint">{titulo}</legend>
      <div className="grid grid-cols-2 gap-3">{children}</div>
    </fieldset>
  );
}

function SingleMap({
  geo,
  data,
  leyenda,
}: {
  geo: unknown;
  data: ReturnType<typeof useMapData>;
  leyenda: [string, { color: string; n: number }][];
}) {
  return (
    <>
      {data.error && <Notice>{data.error}</Notice>}
      {data.loading && <Notice kind="muted">Cargando mapa…</Notice>}
      <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
        <div className="shrink-0">{geo ? <Choropleth geo={geo as never} distritos={data.distritos} /> : null}</div>
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
    </>
  );
}

function CompareMaps({
  geo,
  a,
  b,
  highlight,
  captionA,
  captionB,
  flips,
  mismaEleccion,
}: {
  geo: unknown;
  a: ReturnType<typeof useMapData>;
  b: ReturnType<typeof useMapData>;
  highlight: Set<number>;
  captionA: string;
  captionB: string;
  flips: ReturnType<typeof computeFlips>;
  mismaEleccion: boolean;
}) {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-8 sm:grid-cols-2">
        <MapaLado geo={geo} data={a} highlight={highlight} caption={captionA} />
        <MapaLado geo={geo} data={b} highlight={highlight} caption={captionB} />
      </div>

      {mismaEleccion ? (
        <Notice kind="muted">Elegí dos elecciones distintas para comparar.</Notice>
      ) : (
        <section>
          <h2 className="mb-3 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-ink-faint">
            Cambios de ganador ({flips.length})
          </h2>
          {flips.length === 0 ? (
            <p className="text-sm text-ink-faint">Ninguna provincia cambió de agrupación ganadora.</p>
          ) : (
            <ul className="divide-y divide-rule border-t border-rule">
              {flips.map((f) => (
                <li key={f.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5 text-sm">
                  <span className="w-36 shrink-0 text-ink">{f.prov}</span>
                  <span className="flex min-w-0 flex-1 items-center gap-2">
                    <Swatch color={f.from.color} />
                    <span className="min-w-0 truncate text-ink-soft">{f.from.ganador}</span>
                    <span className="shrink-0 text-ink-faint">→</span>
                    <Swatch color={f.to.color} />
                    <span className="min-w-0 truncate text-ink-soft">{f.to.ganador}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-xs text-ink-faint">
            Un cambio de nombre de coalición se cuenta como cambio de ganador.
          </p>
        </section>
      )}
    </div>
  );
}

function MapaLado({
  geo,
  data,
  highlight,
  caption,
}: {
  geo: unknown;
  data: ReturnType<typeof useMapData>;
  highlight: Set<number>;
  caption: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-[0.7rem] font-medium uppercase tracking-[0.12em] text-ink-faint">{caption}</div>
      {data.error && <Notice>{data.error}</Notice>}
      {data.loading && <Notice kind="muted">Cargando…</Notice>}
      <div>{geo ? <Choropleth geo={geo as never} distritos={data.distritos} highlight={highlight} /> : null}</div>
    </div>
  );
}

function Swatch({ color }: { color: string }) {
  return <span className="inline-block h-3 w-3 shrink-0 rounded-[2px]" style={{ background: color }} />;
}
