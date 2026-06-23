import { NextResponse } from "next/server";
import { getResultados } from "@/lib/dine/client";
import { ANIOS_DISPONIBLES, CARGOS_NACIONALES } from "@/lib/dine/catalogs";
import { getCached, ttlPorAnio } from "@/lib/cache";

export const runtime = "nodejs";
export const maxDuration = 60;

export interface Aparicion {
  anio: string;
  categoriaId: number;
  cargo: string;
  votos: number;
  pct: number;
}

export interface AgrupacionIndice {
  nombre: string; // display (más reciente)
  urlLogo: string;
  idAgrupacionTelegrama: string;
  apariciones: Aparicion[];
  totalVotos: number;
  mejorPct: number;
  aniosActiva: string[];
}

// Índice auto-generado: crawl de getResultados a nivel NACIONAL (Generales)
// por año × cargo, deduplicado por nombre normalizado. Sin seed manual.
export async function GET() {
  const agrupaciones = await getCached("agrupaciones:indice:v1", ttlPorAnio(ANIOS_DISPONIBLES), generarIndice);
  return NextResponse.json({ agrupaciones, generadoDesde: { tipoEleccion: "Generales", anios: ANIOS_DISPONIBLES } });
}

async function generarIndice(): Promise<AgrupacionIndice[]> {
  const cargos = CARGOS_NACIONALES;
  const jobs = ANIOS_DISPONIBLES.flatMap((anio) =>
    cargos.map((c) => ({ anio, categoriaId: c.idCargo, cargo: c.nombre })),
  );

  const settled = await Promise.allSettled(
    jobs.map(async (j) => {
      const data = await getResultados({
        anioEleccion: j.anio,
        tipoRecuento: "1",
        tipoEleccion: "2",
        categoriaId: j.categoriaId,
      });
      return { job: j, positivos: data.valoresTotalizadosPositivos };
    }),
  );

  const idx = new Map<string, AgrupacionIndice>();
  const aniosNum = (s: string) => Number(s);

  for (const s of settled) {
    if (s.status !== "fulfilled") continue;
    const { job, positivos } = s.value;
    for (const a of positivos) {
      const nombre = a.nombreAgrupacion.trim();
      if (!nombre) continue;
      const key = nombre.toUpperCase();
      let e = idx.get(key);
      if (!e) {
        e = { nombre, urlLogo: "", idAgrupacionTelegrama: "", apariciones: [], totalVotos: 0, mejorPct: 0, aniosActiva: [] };
        idx.set(key, e);
      }
      // Display name = el de la aparición más reciente.
      const ultimo = e.apariciones[e.apariciones.length - 1];
      if (!ultimo || aniosNum(job.anio) >= aniosNum(ultimo.anio)) e.nombre = nombre;
      if (a.urlLogo) e.urlLogo = a.urlLogo;
      if (a.idAgrupacionTelegrama) e.idAgrupacionTelegrama = a.idAgrupacionTelegrama;
      e.apariciones.push({ anio: job.anio, categoriaId: job.categoriaId, cargo: job.cargo, votos: a.votos, pct: a.votosPorcentaje });
      e.totalVotos += a.votos;
      e.mejorPct = Math.max(e.mejorPct, a.votosPorcentaje);
      if (!e.aniosActiva.includes(job.anio)) e.aniosActiva.push(job.anio);
    }
  }

  return [...idx.values()]
    .map((e) => ({ ...e, aniosActiva: e.aniosActiva.sort() }))
    .sort((a, b) => b.totalVotos - a.totalVotos);
}
