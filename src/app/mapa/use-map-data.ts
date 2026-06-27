"use client";

import { useEffect, useState } from "react";
import type { DistritoGanador } from "../api/mapa/route";

export interface MapData {
  distritos: DistritoGanador[];
  loading: boolean;
  error: string;
}

/**
 * Trae el ganador por provincia para una elección/cargo desde `/api/mapa`.
 * Con `idEleccion == null` (o `anio == null`) no fetchea y devuelve vacío —
 * así el segundo mapa se "apaga" sin desmontar el hook.
 */
export function useMapData(anio: number | null, idEleccion: number | null, idCargo: string): MapData {
  const [distritos, setDistritos] = useState<DistritoGanador[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (anio == null || idEleccion == null) {
      setDistritos([]);
      setError("");
      setLoading(false);
      return;
    }
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

  return { distritos, loading, error };
}
