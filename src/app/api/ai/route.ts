import { NextRequest } from "next/server";
import { streamNL, type Modo } from "@/lib/ai/anthropic";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  let body: { pregunta?: string; modo?: Modo };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Body JSON inválido" }, { status: 400 });
  }
  const pregunta = body.pregunta?.trim();
  const modo: Modo = body.modo === "informe" ? "informe" : "pregunta";
  if (!pregunta) return Response.json({ error: "Falta 'pregunta'" }, { status: 400 });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj: unknown) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));
      try {
        for await (const chunk of streamNL(pregunta, modo)) {
          send({ type: "text", text: chunk });
        }
        send({ type: "done" });
      } catch (e) {
        send({ type: "error", error: e instanceof Error ? e.message : "Error desconocido" });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
