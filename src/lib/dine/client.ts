import "server-only";
import type { ResultadosParams, ResultadosResponse } from "./types";

const BASE = process.env.DINE_API_BASE ?? "https://resultados.mininterior.gob.ar/api";
const ROUTING_COOKIE = process.env.DINE_ROUTING_COOKIE ?? "be_resultados=dine-elecciones-02";
const BEARER = process.env.DINE_BEARER_TOKEN ?? "";

const ANIO_ACTUAL = new Date().getFullYear();
// Persistencia: Data Cache de Next vía fetch `revalidate`. Histórico (años pasados,
// totalizados) cachea ~1 año; año en curso (posible noche electoral) revalida en 60s.
const REVALIDATE_HISTORICO = 60 * 60 * 24 * 30; // 30 días (tope práctico del Data Cache)
const REVALIDATE_VIVO = 60;

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

/** Consulta getResultados (endpoint abierto). Persiste vía Data Cache de Next. */
export async function getResultados(params: ResultadosParams): Promise<ResultadosResponse> {
  const url = buildUrl(params);
  const revalidate = Number(params.anioEleccion) >= ANIO_ACTUAL ? REVALIDATE_VIVO : REVALIDATE_HISTORICO;

  const headers: Record<string, string> = { Accept: "application/json" };
  if (ROUTING_COOKIE) headers["Cookie"] = ROUTING_COOKIE;
  if (BEARER) headers["Authorization"] = `Bearer ${BEARER}`;

  const res = await fetch(url, { headers, next: { revalidate } });
  if (!res.ok) {
    throw new Error(`DINE getResultados ${res.status}: ${await res.text().catch(() => "")}`.slice(0, 300));
  }
  return (await res.json()) as ResultadosResponse;
}
