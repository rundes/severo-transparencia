"use client";

import { useEffect, useMemo, useState } from "react";
import type { EleccionMenu, Totalizado } from "@/lib/dine/v2-types";
import { fmtNum, fmtPct } from "@/lib/format";

interface EleccionItem {
  anio: number;
  idEleccion: number;
  nombre: string;
}
interface SeccionItem {
  idSP: number | null; // null = no enviar idSeccionProvincial
  idS: number;
  label: string;
}

export function Explorer() {
  const [elecciones, setElecciones] = useState<EleccionItem[]>([]);
  const [anio, setAnio] = useState<number | null>(null);
  const [idEleccion, setIdEleccion] = useState<number | null>(null);
  const [tree, setTree] = useState<EleccionMenu | null>(null);
  const [idCargo, setIdCargo] = useState<string>("");
  const [idDistrito, setIdDistrito] = useState<number>(0);
  const [seccionKey, setSeccionKey] = useState<string>(""); // "idSP:idS"
  const [data, setData] = useState<Totalizado | null>(null);
  const [error, setError] = useState("");
  const [loadingData, setLoadingData] = useState(false);

  // 1) Cargar lista de elecciones.
  useEffect(() => {
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

  // 2) Cargar árbol al elegir año+elección.
  useEffect(() => {
    if (anio == null || idEleccion == null) return;
    setTree(null);
    fetch(`/api/menu?anio=${anio}&idEleccion=${idEleccion}`)
      .then((r) => r.json())
      .then((t: EleccionMenu) => {
        setTree(t);
        setIdCargo(t.Cargos?.[0]?.IdCargo ?? "");
        setIdDistrito(0);
        setSeccionKey("");
      })
      .catch((e) => setError(String(e)));
  }, [anio, idEleccion]);

  const cargo = tree?.Cargos?.find((c) => c.IdCargo === idCargo);
  const distritos = cargo?.Distritos ?? [];
  const distrito = distritos.find((d) => d.IdDistrito === idDistrito);

  const secciones: SeccionItem[] = useMemo(() => {
    if (!distrito || idDistrito === 0) return [];
    const out: SeccionItem[] = [];
    for (const sp of distrito.SeccionesProvinciales) {
      for (const s of sp.Secciones) {
        if (s.IdSeccion == null || !s.Seccion) continue;
        out.push({
          idSP: sp.IDSeccionProvincial,
          idS: s.IdSeccion,
          label: (sp.SeccionProvincial ? `${sp.SeccionProvincial} · ` : "") + s.Seccion,
        });
      }
    }
    return out;
  }, [distrito, idDistrito]);

  // 3) Cargar resultados.
  useEffect(() => {
    if (anio == null || idEleccion == null || !idCargo) return;
    const ctrl = new AbortController();
    const qs = new URLSearchParams({
      anio: String(anio),
      idEleccion: String(idEleccion),
      idCargo,
      idDistrito: String(idDistrito),
    });
    if (seccionKey) {
      const [idSP, idS] = seccionKey.split(":");
      if (idSP) qs.set("idSeccionProvincial", idSP); // omitir si la sección provincial es null
      qs.set("idSeccion", idS);
    }
    setLoadingData(true);
    setError("");
    fetch(`/api/totalizado?${qs}`, { signal: ctrl.signal })
      .then(async (r) => {
        const j = await r.json();
        if (!r.ok) throw new Error(j.error ?? `Error ${r.status}`);
        setData(j);
      })
      .catch((e) => {
        if (e instanceof Error && e.name === "AbortError") return;
        setError(e instanceof Error ? e.message : "Error");
        setData(null);
      })
      .finally(() => setLoadingData(false));
    return () => ctrl.abort();
  }, [anio, idEleccion, idCargo, idDistrito, seccionKey]);

  const positivos = data ? [...data.agrupaciones].sort((a, b) => b.votos - a.votos) : [];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <Select
          label="Año"
          value={String(anio ?? "")}
          onChange={(v) => setAnio(Number(v))}
          options={aniosDisponibles.map((a) => [String(a), String(a)])}
        />
        <Select
          label="Elección"
          value={String(idEleccion ?? "")}
          onChange={(v) => setIdEleccion(Number(v))}
          options={eleccionesDelAnio.map((e) => [String(e.idEleccion), e.nombre])}
        />
        <Select
          label="Cargo"
          value={idCargo}
          onChange={setIdCargo}
          options={(tree?.Cargos ?? []).map((c) => [c.IdCargo, c.Cargo])}
          disabled={!tree}
        />
        <Select
          label="Distrito"
          value={String(idDistrito)}
          onChange={(v) => {
            setIdDistrito(Number(v));
            setSeccionKey("");
          }}
          options={distritos.map((d) => [String(d.IdDistrito), d.IdDistrito === 0 ? "Todo el país" : d.Distrito])}
          disabled={!cargo}
        />
        <Select
          label="Sección"
          value={seccionKey}
          onChange={setSeccionKey}
          options={[["", "Todo el distrito"], ...secciones.map((s) => [`${s.idSP ?? ""}:${s.idS}`, s.label] as [string, string])]}
          disabled={secciones.length === 0}
        />
      </div>

      {loadingData && <p className="text-sm text-neutral-500">Cargando…</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}

      {data && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Participación" value={fmtPct(data.ParticipacionSobreEscrutado)} />
            <Stat label="Mesas escrutadas" value={fmtNum(data.MesasEscrutadas)} />
            <Stat label="Electores" value={fmtNum(data.Electores)} />
            <Stat label="Votantes" value={fmtNum(data.Votantes)} />
          </div>

          <div className="flex flex-col gap-2">
            {positivos.map((a) => (
              <div key={a.idAgrupacion}>
                <div className="mb-0.5 flex justify-between text-sm">
                  <span className="truncate pr-2">{a.nombre.trim()}</span>
                  <span className="tabular-nums text-neutral-400">
                    {fmtPct(a.porcentaje)} · {fmtNum(a.votos)}
                  </span>
                </div>
                <div className="h-2.5 w-full rounded bg-neutral-800">
                  <div
                    className="h-full rounded"
                    style={{ width: `${Math.min(a.porcentaje, 100)}%`, background: a.color || "#38bdf8" }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-neutral-500">
            <span>Nulos: {fmtNum(data.nulos)}</span>
            <span>Blanco: {fmtNum(data.blancos)}</span>
            <span>Recurridos: {fmtNum(data.recurridos)}</span>
            <span>Impugnados: {fmtNum(data.impugnados)}</span>
          </div>
          <p className="text-xs text-neutral-600">
            {data.Cargo} · {data.Distrito} · {data.Elecciones} {data.Año} · recuento {data.Recuento.toLowerCase()}.
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
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
  disabled?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs text-neutral-400">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="rounded-lg border border-neutral-800 bg-neutral-900 px-2 py-1.5 text-sm text-white outline-none focus:border-neutral-600 disabled:opacity-40"
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
