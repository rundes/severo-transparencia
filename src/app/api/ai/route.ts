import { NextRequest, NextResponse } from "next/server";
import { consultarNL } from "@/lib/ai/anthropic";

export async function POST(req: NextRequest) {
  let body: { pregunta?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body JSON inválido" }, { status: 400 });
  }
  const pregunta = body.pregunta?.trim();
  if (!pregunta) return NextResponse.json({ error: "Falta 'pregunta'" }, { status: 400 });

  try {
    const respuesta = await consultarNL(pregunta);
    return NextResponse.json({ respuesta });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Error desconocido" }, { status: 500 });
  }
}
