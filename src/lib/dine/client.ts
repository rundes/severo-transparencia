import "server-only";
import type { ResultadosParams, ResultadosResponse } from "./types";

const BASE = process.env.DINE_API_BASE ?? "https://resultados.mininterior.gob.ar/api";
const ROUTING_COOKIE = process.env.DINE_ROUTING_COOKIE ?? "be_resultados=dine-elecciones-02";
const BEARER = process.env.DINE_BEARER_TOKEN ?? "";

// Cache en memoria por proceso. Los resultados ya totalizados son estables.
const CACHE_TTL_MS = 5 * 60 * 1000;
const cache = new Map<string, { at: number; data: ResultadosResponse }>();

function buildUrl(params: ResultadosParams): string {
  const qs = new URLSearchParams();
  qs.set("anioEleccion", params.anioEleccion);
  qs.set("tipoRecuento", params.tipoRecuento);
  qs.set("tipoEleccion", params.tipoEleccion);
  qs.set("categoriaId", String(params.categoriaId));
  for (const k of ["distritoId", "seccionProvincialId", "seccionId", "circuitoId", "mesaId"] as const) {
    const v = params[k];
    if (v != null && v !== "") qs.set(k, v);
  }
  return `${BASE}/resultados/getResultados?${qs.toString()}`;
}

/** Consulta getResultados (endpoint abierto). Cachea por combinación de params. */
export async function getResultados(params: ResultadosParams): Promise<ResultadosResponse> {
  const url = buildUrl(params);
  const hit = cache.get(url);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.data;

  const headers: Record<string, string> = { Accept: "application/json" };
  if (ROUTING_COOKIE) headers["Cookie"] = ROUTING_COOKIE;
  if (BEARER) headers["Authorization"] = `Bearer ${BEARER}`;

  const res = await fetch(url, { headers, next: { revalidate: 300 } });
  if (!res.ok) {
    throw new Error(`DINE getResultados ${res.status}: ${await res.text().catch(() => "")}`.slice(0, 300));
  }
  const data = (await res.json()) as ResultadosResponse;
  cache.set(url, { at: Date.now(), data });
  return data;
}
