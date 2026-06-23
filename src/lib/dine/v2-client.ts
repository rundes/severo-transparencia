import "server-only";
import type { EleccionMenu, Totalizado, TotalizadoParams } from "./v2-types";

const BASE = process.env.DINE_API_BASE ?? "https://resultados.mininterior.gob.ar/api";
const ROUTING_COOKIE = process.env.DINE_ROUTING_COOKIE ?? "be_resultados=dine-elecciones-02";

const ANIO_ACTUAL = new Date().getFullYear();
const REVALIDATE_HISTORICO = 60 * 60 * 24 * 30; // 30 días
const REVALIDATE_VIVO = 60;

function headers(): Record<string, string> {
  const h: Record<string, string> = { Accept: "application/json" };
  if (ROUTING_COOKIE) h["Cookie"] = ROUTING_COOKIE;
  return h;
}

function revalidateFor(anio: number | string): number {
  return Number(anio) >= ANIO_ACTUAL ? REVALIDATE_VIVO : REVALIDATE_HISTORICO;
}

// El param `año` lleva ñ: hay que enviarlo URL-encodeado como a%C3%B1o.
function qs(params: Record<string, string | number | undefined>): string {
  const parts: string[] = [];
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === "") continue;
    const key = k === "anio" ? "a%C3%B1o" : encodeURIComponent(k);
    parts.push(`${key}=${encodeURIComponent(String(v))}`);
  }
  return parts.join("&");
}

async function getJson<T>(path: string, revalidate: number): Promise<T> {
  const res = await fetch(`${BASE}/${path}`, { headers: headers(), next: { revalidate } });
  if (!res.ok) {
    throw new Error(`DINE ${path} ${res.status}: ${await res.text().catch(() => "")}`.slice(0, 300));
  }
  return (await res.json()) as T;
}

/** Años disponibles, descendente. */
export function getPeriodos(): Promise<number[]> {
  return getJson<number[]>("menu/periodos", REVALIDATE_HISTORICO);
}

/** Lista plana de todas las elecciones (sin árbol). */
export function getElecciones(): Promise<EleccionMenu[]> {
  return getJson<EleccionMenu[]>("menu", REVALIDATE_HISTORICO);
}

/** Árbol de catálogos (Cargos→Distritos→Secciones) para una elección. */
export async function getMenuTree(anio: number, idEleccion: number): Promise<EleccionMenu> {
  const data = await getJson<EleccionMenu | EleccionMenu[]>(
    `menu?${qs({ anio, idEleccion })}`,
    revalidateFor(anio),
  );
  return Array.isArray(data) ? data[0] : data;
}

/** Resultados totalizados para un ámbito (idDistrito=0 = nacional). */
export function getTotalizado(p: TotalizadoParams): Promise<Totalizado> {
  const query = qs({
    anio: p.anio,
    idEleccion: p.idEleccion,
    idCargo: p.idCargo,
    idDistrito: p.idDistrito,
    idSeccionProvincial: p.idSeccionProvincial,
    idSeccion: p.idSeccion,
    idCircuito: p.idCircuito,
    idMesa: p.idMesa,
  });
  return getJson<Totalizado>(`resultado/totalizado?${query}`, revalidateFor(p.anio));
}
