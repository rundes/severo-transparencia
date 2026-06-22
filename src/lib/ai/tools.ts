import type Anthropic from "@anthropic-ai/sdk";
import { getResultados } from "@/lib/dine/client";
import { ANIOS_DISPONIBLES, CARGOS_NACIONALES, DISTRITOS, TIPOS_ELECCION } from "@/lib/dine/catalogs";
import type { ResultadosParams } from "@/lib/dine/types";

// Herramientas que Claude puede invocar para consultar el API electoral.
export const tools: Anthropic.Tool[] = [
  {
    name: "consultar_resultados",
    description:
      "Devuelve resultados electorales totalizados de Argentina (recuento provisorio DINE). " +
      `Años: ${ANIOS_DISPONIBLES.join(", ")}. ` +
      `Tipos: ${TIPOS_ELECCION.map((t) => `${t.id}=${t.nombre}`).join(", ")}. ` +
      `Cargos NACIONALES (sin distritoId): ${CARGOS_NACIONALES.map((c) => `${c.categoriaId}=${c.nombre}`).join(", ")}. ` +
      "IMPORTANTE: categoriaId solo es confiable a nivel nacional (sin distritoId). " +
      "Al pasar distritoId, el mismo categoriaId puede apuntar a un CARGO LOCAL de esa " +
      "provincia, no al cargo nacional. Si te piden un dato por provincia y no estás seguro " +
      "del categoriaId correcto para ese distrito, aclará la limitación en vez de inventar. " +
      `Distritos (ID_INDRA): ${DISTRITOS.map((d) => `${d.id}=${d.nombre}`).join(", ")}.`,
    input_schema: {
      type: "object",
      properties: {
        anioEleccion: { type: "string", description: "Año, ej '2023'" },
        tipoEleccion: { type: "string", enum: ["1", "2", "3"], description: "1=PASO, 2=Generales, 3=Balotaje" },
        categoriaId: { type: "integer", description: "Cargo: 1=Presidente, 2=Senadores Nac, 3=Diputados Nac" },
        distritoId: { type: "string", description: "Opcional. ID de provincia." },
        seccionProvincialId: { type: "string" },
        seccionId: { type: "string" },
        circuitoId: { type: "string", description: "6 dígitos, ej '000039'" },
        mesaId: { type: "string" },
      },
      required: ["anioEleccion", "tipoEleccion", "categoriaId"],
    },
  },
];

export async function runTool(name: string, input: Record<string, unknown>): Promise<unknown> {
  if (name === "consultar_resultados") {
    const params: ResultadosParams = {
      anioEleccion: String(input.anioEleccion),
      tipoRecuento: "1",
      tipoEleccion: String(input.tipoEleccion) as ResultadosParams["tipoEleccion"],
      categoriaId: Number(input.categoriaId),
      distritoId: input.distritoId as string | undefined,
      seccionProvincialId: input.seccionProvincialId as string | undefined,
      seccionId: input.seccionId as string | undefined,
      circuitoId: input.circuitoId as string | undefined,
      mesaId: input.mesaId as string | undefined,
    };
    return await getResultados(params);
  }
  throw new Error(`Herramienta desconocida: ${name}`);
}
