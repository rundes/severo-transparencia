import type Anthropic from "@anthropic-ai/sdk";
import { getTotalizado } from "@/lib/dine/v2-client";
import { ANIOS_DISPONIBLES, CARGOS, DISTRITOS, TIPOS_ELECCION } from "@/lib/dine/catalogs";
import type { TotalizadoParams } from "@/lib/dine/v2-types";

export const tools: Anthropic.Tool[] = [
  {
    name: "consultar_resultados",
    description:
      "Devuelve resultados electorales totalizados de Argentina (recuento provisorio, DINE). " +
      "Funciona a cualquier nivel: nacional (idDistrito=0) o por provincia/sección. " +
      `Años: ${ANIOS_DISPONIBLES.join(", ")} (también 2025 si existe). ` +
      `idEleccion: ${TIPOS_ELECCION.map((t) => `${t.id}=${t.nombre}`).join(", ")}. ` +
      `idCargo: ${CARGOS.map((c) => `${c.idCargo}=${c.nombre}`).join(", ")}. ` +
      `idDistrito: ${DISTRITOS.map((d) => `${d.id}=${d.nombre}`).join(", ")}. ` +
      "Cargos 4-10 (gobernador, intendente, etc.) requieren un idDistrito provincial (no 0). " +
      "Devuelve total, agrupaciones (con votos, %, color), participación, electores, votantes y blancos/nulos.",
    input_schema: {
      type: "object",
      properties: {
        anio: { type: "string", description: "Año, ej '2023'" },
        idEleccion: { type: "integer", enum: [1, 2, 3], description: "1=PASO, 2=Generales, 3=Balotaje" },
        idCargo: { type: "integer", description: "1=Presidente, 2=Sen Nac, 3=Dip Nac, 4=Gobernador, 7=Intendente…" },
        idDistrito: { type: "integer", description: "0=nacional, 1=CABA, 2=Buenos Aires, … 24=Tierra del Fuego" },
        idSeccionProvincial: { type: "integer", description: "Opcional, para drill dentro de un distrito" },
        idSeccion: { type: "integer", description: "Opcional, sección/departamento/municipio" },
      },
      required: ["anio", "idEleccion", "idCargo", "idDistrito"],
    },
  },
];

export async function runTool(name: string, input: Record<string, unknown>): Promise<unknown> {
  if (name === "consultar_resultados") {
    const params: TotalizadoParams = {
      anio: String(input.anio),
      idEleccion: Number(input.idEleccion),
      idCargo: Number(input.idCargo),
      idDistrito: Number(input.idDistrito ?? 0),
      idSeccionProvincial: input.idSeccionProvincial != null ? Number(input.idSeccionProvincial) : undefined,
      idSeccion: input.idSeccion != null ? Number(input.idSeccion) : undefined,
    };
    const t = await getTotalizado(params);
    // Compactar: sin listas (mucho ruido para el modelo).
    return {
      total: t.total,
      distrito: t.Distrito,
      cargo: t.Cargo,
      eleccion: `${t.Elecciones} ${t.Año}`,
      participacion: t.ParticipacionSobreEscrutado,
      electores: t.Electores,
      votantes: t.Votantes,
      mesasEscrutadas: t.MesasEscrutadas,
      blancos: t.blancos,
      nulos: t.nulos,
      agrupaciones: t.agrupaciones.map((a) => ({ nombre: a.nombre.trim(), votos: a.votos, porcentaje: a.porcentaje })),
    };
  }
  throw new Error(`Herramienta desconocida: ${name}`);
}
