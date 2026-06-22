import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { runTool, tools } from "./tools";

const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-opus-4-8";

let _client: Anthropic | null = null;
function client(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) throw new Error("Falta ANTHROPIC_API_KEY");
  if (!_client) _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return _client;
}

const SYSTEM = `Sos un analista de datos electorales argentinos. Respondés preguntas en lenguaje
natural consultando el API oficial DINE mediante la herramienta 'consultar_resultados'.
Reglas:
- Siempre obtené los datos con la herramienta antes de afirmar números; nunca inventes cifras.
- Citá año, tipo de elección, cargo y ámbito de cada dato.
- Para informes, estructurá: resumen, tabla de resultados, participación, y observaciones.
- Si falta un parámetro (año, cargo, distrito), pedilo o usá el más razonable y aclaralo.`;

/** Loop agéntico: corre la consulta NL resolviendo tool-calls hasta la respuesta final. */
export async function consultarNL(pregunta: string, maxTurns = 6): Promise<string> {
  const messages: Anthropic.MessageParam[] = [{ role: "user", content: pregunta }];

  for (let turn = 0; turn < maxTurns; turn++) {
    const resp = await client().messages.create({
      model: MODEL,
      max_tokens: 4096,
      system: SYSTEM,
      tools,
      messages,
    });

    if (resp.stop_reason !== "tool_use") {
      return resp.content.filter((b) => b.type === "text").map((b) => (b as Anthropic.TextBlock).text).join("\n");
    }

    messages.push({ role: "assistant", content: resp.content });
    const toolResults: Anthropic.ToolResultBlockParam[] = [];
    for (const block of resp.content) {
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
  return "No se pudo completar la consulta dentro del límite de pasos.";
}
