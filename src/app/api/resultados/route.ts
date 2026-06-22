import { NextRequest, NextResponse } from "next/server";
import { getResultados } from "@/lib/dine/client";
import type { ResultadosParams } from "@/lib/dine/types";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const anioEleccion = sp.get("anioEleccion");
  const tipoEleccion = sp.get("tipoEleccion");
  const categoriaId = sp.get("categoriaId");

  if (!anioEleccion || !tipoEleccion || !categoriaId) {
    return NextResponse.json(
      { error: "Parámetros requeridos: anioEleccion, tipoEleccion, categoriaId" },
      { status: 400 },
    );
  }

  const params: ResultadosParams = {
    anioEleccion,
    tipoRecuento: "1",
    tipoEleccion: tipoEleccion as ResultadosParams["tipoEleccion"],
    categoriaId: Number(categoriaId),
    distritoId: sp.get("distritoId") ?? undefined,
    seccionProvincialId: sp.get("seccionProvincialId") ?? undefined,
    seccionId: sp.get("seccionId") ?? undefined,
    circuitoId: sp.get("circuitoId") ?? undefined,
    mesaId: sp.get("mesaId") ?? undefined,
  };

  try {
    const data = await getResultados(params);
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Error desconocido" }, { status: 502 });
  }
}
