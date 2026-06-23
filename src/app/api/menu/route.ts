import { NextRequest, NextResponse } from "next/server";
import { getElecciones, getMenuTree, getPeriodos } from "@/lib/dine/v2-client";
import { getCached, TTL } from "@/lib/cache";

// /api/menu?periodos=1            → años disponibles
// /api/menu?anio=2023&idEleccion=2 → árbol de catálogos de esa elección
// /api/menu                        → lista plana de elecciones
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  try {
    if (sp.get("periodos")) {
      const periodos = await getCached("v2:periodos", TTL.HISTORICO, getPeriodos);
      return NextResponse.json({ periodos });
    }
    const anio = sp.get("anio");
    const idEleccion = sp.get("idEleccion");
    if (anio && idEleccion) {
      const tree = await getCached(`v2:menu:${anio}:${idEleccion}`, TTL.HISTORICO, () =>
        getMenuTree(Number(anio), Number(idEleccion)),
      );
      return NextResponse.json(tree);
    }
    const elecciones = await getCached("v2:elecciones", TTL.HISTORICO, getElecciones);
    return NextResponse.json({ elecciones });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Error" }, { status: 502 });
  }
}
