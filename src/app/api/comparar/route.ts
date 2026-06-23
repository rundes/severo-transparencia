import { NextRequest, NextResponse } from "next/server";
import { getResultados } from "@/lib/dine/client";
import { ANIOS_DISPONIBLES } from "@/lib/dine/catalogs";
import { getCached, ttlPorAnio } from "@/lib/cache";
import type { ResultadosParams, ResultadosResponse } from "@/lib/dine/types";

export interface PuntoComparacion {
  anio: string;
  participacionPorcentaje: number;
  mesasTotalizadasPorcentaje: number;
  cantidadElectores: number;
  cantidadVotantes: number;
  positivos: { nombre: string; votos: number; pct: number }[];
}

// Compara una elección a nivel NACIONAL (cargo + tipo) a través de los años.
// Scope nacional: categoriaId confiable (ver caveat en catalogs.ts).
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const tipoEleccion = (sp.get("tipoEleccion") ?? "2") as ResultadosParams["tipoEleccion"];
  const categoriaId = Number(sp.get("categoriaId") ?? "1");

  const puntos = await getCached(
    `comparar:${tipoEleccion}:${categoriaId}`,
    ttlPorAnio(ANIOS_DISPONIBLES),
    () => agregar(tipoEleccion, categoriaId),
  );

  return NextResponse.json({ puntos });
}

async function agregar(
  tipoEleccion: ResultadosParams["tipoEleccion"],
  categoriaId: number,
): Promise<PuntoComparacion[]> {
  const settled = await Promise.allSettled(
    ANIOS_DISPONIBLES.map(async (anio): Promise<PuntoComparacion> => {
      const data: ResultadosResponse = await getResultados({
        anioEleccion: anio,
        tipoRecuento: "1",
        tipoEleccion,
        categoriaId,
      });
      return {
        anio,
        participacionPorcentaje: data.estadoRecuento.participacionPorcentaje,
        mesasTotalizadasPorcentaje: data.estadoRecuento.mesasTotalizadasPorcentaje,
        cantidadElectores: data.estadoRecuento.cantidadElectores,
        cantidadVotantes: data.estadoRecuento.cantidadVotantes,
        positivos: data.valoresTotalizadosPositivos
          .map((a) => ({ nombre: a.nombreAgrupacion.trim(), votos: a.votos, pct: a.votosPorcentaje }))
          .sort((a, b) => b.votos - a.votos),
      };
    }),
  );

  // Conservar solo años con datos reales (descarta errores y años sin esa elección).
  return settled
    .filter((s): s is PromiseFulfilledResult<PuntoComparacion> => s.status === "fulfilled")
    .map((s) => s.value)
    .filter((p) => p.cantidadElectores > 0 || p.positivos.length > 0);
}
