import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { getTools, runTool } from "./tools";

const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-opus-4-8";

let _client: Anthropic | null = null;
function client(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) throw new Error("Falta ANTHROPIC_API_KEY");
  if (!_client) _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return _client;
}

export type Modo = "pregunta" | "informe";

const SYSTEM_BASE = `Sos un analista de datos electorales argentinos. Respondés consultando el API
oficial DINE mediante la herramienta 'consultar_resultados'.
Reglas:
- Siempre obtené los datos con la herramienta antes de afirmar números; nunca inventes cifras.
- Citá año, tipo de elección, cargo y ámbito de cada dato.
- Usá Markdown: tablas para resultados, negritas para ganadores.
- Si falta un parámetro (año, cargo, distrito), usá el más razonable y aclaralo.
- Si están disponibles las herramientas 'bigquery_schema'/'bigquery_query', usalas para
  datos electorales adicionales: pedí el esquema primero y escribí SQL de solo lectura.`;

const SYSTEM_INFORME = `${SYSTEM_BASE}

MODO INFORME: producí un informe analítico completo. Consultá múltiples ámbitos si hace falta
(nacional + distritos relevantes, o comparación entre elecciones). Estructura obligatoria:
1. **Resumen ejecutivo** (3-5 líneas).
2. **Resultados** — tabla(s) Markdown con votos y porcentajes, ordenadas por votos.
3. **Participación** — electores, votantes, % y mesas escrutadas.
4. **Análisis** — brechas, comparaciones, contexto.
5. **Observaciones metodológicas** — recuento provisorio, fecha de totalización.`;

const MODELS = {
  pregunta: { system: SYSTEM_BASE, maxTokens: 4096 },
  informe: { system: SYSTEM_INFORME, maxTokens: 8192 },
} as const;

/**
 * Corre el loop agéntico (resuelve tool-calls) y emite el texto del modelo en streaming.
 * Yields fragmentos de texto a medida que llegan.
 */
export async function* streamNL(pregunta: string, modo: Modo = "pregunta", maxTurns = 8): AsyncGenerator<string> {
  const cfg = MODELS[modo];
  const tools = getTools();
  const messages: Anthropic.MessageParam[] = [{ role: "user", content: pregunta }];

  for (let turn = 0; turn < maxTurns; turn++) {
    const stream = client().messages.stream({
      model: MODEL,
      max_tokens: cfg.maxTokens,
      system: cfg.system,
      tools,
      messages,
    });

    for await (const ev of stream) {
      if (ev.type === "content_block_delta" && ev.delta.type === "text_delta") {
        yield ev.delta.text;
      }
    }

    const final = await stream.finalMessage();
    if (final.stop_reason !== "tool_use") return;

    messages.push({ role: "assistant", content: final.content });
    const toolResults: Anthropic.ToolResultBlockParam[] = [];
    for (const block of final.content) {
      if (block.type !== "tool_use") continue;
      try {
        const out = await runTool(block.name, block.input as Record<string, unknown>);
        toolResults.push({ type: "tool_result", tool_use_id: block.id, content: JSON.stringify(out) });
      } catch (e) {
        toolResults.push({
          type: "tool_result",
          tool_use_id: block.id,
          content: `Error: ${e instanceof Error ? e.message : String(e)}`,
          is_error: true,
        });
      }
    }
    messages.push({ role: "user", content: toolResults });
  }
}
