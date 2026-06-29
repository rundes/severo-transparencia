import { NextRequest, NextResponse } from "next/server";
import { getTotalizado } from "@/lib/dine/v2-client";
import { getCached, ttlPorAnio } from "@/lib/cache";
import { colorForAgrupacion, dineColorValido } from "@/lib/format";

export const runtime = "nodejs";
export const maxDuration = 60;

export interface DistritoGanador {
  idDistrito: number;
  distrito: string;
  ganador: string;
  color: string;
  pct: number;
  participacion: number;
}

// Ganador por provincia (idDistrito 1..24) para un cargo. Default presidente.
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const anio = sp.get("anio") ?? "2023";
  const idEleccion = Number(sp.get("idEleccion") ?? "2");
  const idCargo = Number(sp.get("idCargo") ?? "1");

  try {
    const data = await getCached(`mapa:v2:${anio}:${idEleccion}:${idCargo}`, ttlPorAnio([anio]), async () => {
      const settled = await Promise.allSettled(
        Array.from({ length: 24 }, (_, i) => i + 1).map(async (idDistrito): Promise<DistritoGanador | null> => {
          const t = await getTotalizado({ anio, idEleccion, idCargo, idDistrito });
          const top = [...t.agrupaciones].sort((a, b) => b.votos - a.votos)[0];
          if (!top) return null;
          const ganador = top.nombre.trim();
          return {
            idDistrito,
            distrito: t.Distrito,
            ganador,
            // Color oficial DINE si lo trae; si no, fallback determinístico por nombre.
            color: dineColorValido(top.color) ? top.color : colorForAgrupacion(ganador),
            pct: top.porcentaje,
            participacion: t.ParticipacionSobreEscrutado,
          };
        }),
      );
      return settled
        .filter((s): s is PromiseFulfilledResult<DistritoGanador | null> => s.status === "fulfilled")
        .map((s) => s.value)
        .filter((v): v is DistritoGanador => v != null);
    });

    return NextResponse.json({ distritos: data });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Error" }, { status: 502 });
  }
}
