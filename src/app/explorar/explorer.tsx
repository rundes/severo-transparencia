"use client";

import { useEffect, useMemo, useState } from "react";
import type { EleccionMenu, Totalizado } from "@/lib/dine/v2-types";
import { ACCENT, fmtNum } from "@/lib/format";
import { Field, Notice, ResultBar, StatStrip } from "@/components/ui";

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

  // Normalizar distrito: algunos cargos no tienen agregado nacional (idDistrito=0),
  // p. ej. Senador Nacional. Si el distrito actual no existe para el cargo elegido,
  // caer al nacional si está disponible, si no al primer distrito de la lista.
  useEffect(() => {
    if (!distritos.length) return;
    if (distritos.some((d) => d.IdDistrito === idDistrito)) return;
    const pref = distritos.find((d) => d.IdDistrito === 0) ?? distritos[0];
    setIdDistrito(pref.IdDistrito);
    setSeccionKey("");
  }, [distritos, idDistrito]);

  // 3) Cargar resultados.
  useEffect(() => {
    if (anio == null || idEleccion == null || !idCargo) return;
    // Esperar a que el distrito quede normalizado para el cargo (evita el 408 inicial).
    if (distritos.length && !distritos.some((d) => d.IdDistrito === idDistrito)) return;
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
  const maxPct = positivos.length ? positivos[0].porcentaje : 100;

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <Field
          label="Año"
          value={String(anio ?? "")}
          onChange={(v) => setAnio(Number(v))}
          options={aniosDisponibles.map((a) => [String(a), String(a)])}
        />
        <Field
          label="Elección"
          value={String(idEleccion ?? "")}
          onChange={(v) => setIdEleccion(Number(v))}
          options={eleccionesDelAnio.map((e) => [String(e.idEleccion), e.nombre])}
        />
        <Field
          label="Cargo"
          value={idCargo}
          onChange={setIdCargo}
          options={(tree?.Cargos ?? []).map((c) => [c.IdCargo, c.Cargo])}
          disabled={!tree}
        />
        <Field
          label="Distrito"
          value={String(idDistrito)}
          onChange={(v) => {
            setIdDistrito(Number(v));
            setSeccionKey("");
          }}
          options={distritos.map((d) => [String(d.IdDistrito), d.IdDistrito === 0 ? "Todo el país" : d.Distrito])}
          disabled={!cargo}
        />
        <Field
          label="Sección"
          value={seccionKey}
          onChange={setSeccionKey}
          options={[["", "Todo el distrito"], ...secciones.map((s) => [`${s.idSP ?? ""}:${s.idS}`, s.label] as [string, string])]}
          disabled={secciones.length === 0}
        />
      </div>

      {loadingData && <Notice kind="muted">Cargando resultados…</Notice>}
      {error && <Notice>{error}</Notice>}

      {data && (
        <div className="flex flex-col gap-8">
          <StatStrip
            items={[
              { label: "Participación", value: `${data.ParticipacionSobreEscrutado.toFixed(2)}%` },
              { label: "Mesas escrutadas", value: fmtNum(data.MesasEscrutadas) },
              { label: "Electores", value: fmtNum(data.Electores) },
              { label: "Votantes", value: fmtNum(data.Votantes) },
            ]}
          />

          <div className="divide-y divide-rule border-t border-rule">
            {positivos.map((a, i) => (
              <ResultBar
                key={a.idAgrupacion}
                rank={i + 1}
                label={a.nombre.trim()}
                pct={a.porcentaje}
                value={fmtNum(a.votos)}
                color={a.color || ACCENT}
                max={maxPct}
              />
            ))}
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-1 border-t border-rule pt-4 text-xs text-ink-faint">
            <span>Nulos: <span className="tabular-nums text-ink-soft">{fmtNum(data.nulos)}</span></span>
            <span>Blanco: <span className="tabular-nums text-ink-soft">{fmtNum(data.blancos)}</span></span>
            <span>Recurridos: <span className="tabular-nums text-ink-soft">{fmtNum(data.recurridos)}</span></span>
            <span>Impugnados: <span className="tabular-nums text-ink-soft">{fmtNum(data.impugnados)}</span></span>
          </div>
          <p className="text-xs text-ink-faint">
            {data.Cargo} · {data.Distrito} · {data.Elecciones} {data.Año} · recuento {data.Recuento.toLowerCase()}.
          </p>
        </div>
      )}
    </div>
  );
}
