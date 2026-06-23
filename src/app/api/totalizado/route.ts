import { NextRequest, NextResponse } from "next/server";
import { getTotalizado } from "@/lib/dine/v2-client";
import type { TotalizadoParams } from "@/lib/dine/v2-types";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const anio = sp.get("anio");
  const idEleccion = sp.get("idEleccion");
  const idCargo = sp.get("idCargo");
  const idDistrito = sp.get("idDistrito");

  if (!anio || !idEleccion || !idCargo || idDistrito == null) {
    return NextResponse.json(
      { error: "Requeridos: anio, idEleccion, idCargo, idDistrito (0=nacional)" },
      { status: 400 },
    );
  }

  const params: TotalizadoParams = {
    anio,
    idEleccion: Number(idEleccion),
    idCargo: Number(idCargo),
    idDistrito: Number(idDistrito),
    idSeccionProvincial: sp.get("idSeccionProvincial") ? Number(sp.get("idSeccionProvincial")) : undefined,
    idSeccion: sp.get("idSeccion") ? Number(sp.get("idSeccion")) : undefined,
    idCircuito: sp.get("idCircuito") ?? undefined,
    idMesa: sp.get("idMesa") ?? undefined,
  };

  try {
    return NextResponse.json(await getTotalizado(params));
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Error" }, { status: 502 });
  }
}
