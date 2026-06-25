import type Anthropic from "@anthropic-ai/sdk";
import { getTotalizado } from "@/lib/dine/v2-client";
import { ANIOS_DISPONIBLES, CARGOS, DISTRITOS, TIPOS_ELECCION } from "@/lib/dine/catalogs";
import type { TotalizadoParams } from "@/lib/dine/v2-types";
import { bqEnabled } from "@/lib/bigquery/client";
import { getSchema, schemaToText } from "@/lib/bigquery/schema";
import { runQuery } from "@/lib/bigquery/query";

const dineTools: Anthropic.Tool[] = [
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

const bqTools: Anthropic.Tool[] = [
  {
    name: "bigquery_schema",
    description:
      "Devuelve el esquema (datasets, tablas y columnas) del proyecto BigQuery electoral. " +
      "Llamala PRIMERO, antes de escribir SQL, para conocer tablas y columnas disponibles.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "bigquery_query",
    description:
      "Ejecuta una consulta SQL de SOLO LECTURA (SELECT/WITH) sobre el proyecto BigQuery electoral " +
      "y devuelve las filas. Usá nombres totalmente calificados `proyecto.dataset.tabla`. " +
      "Mirá primero el esquema con bigquery_schema. Se fuerza LIMIT y un tope de bytes.",
    input_schema: {
      type: "object",
      properties: { sql: { type: "string", description: "Consulta GoogleSQL (BigQuery), solo SELECT/WITH" } },
      required: ["sql"],
    },
  },
];

/** Tools disponibles. Incluye BigQuery solo si está configurado. */
export function getTools(): Anthropic.Tool[] {
  return bqEnabled() ? [...dineTools, ...bqTools] : dineTools;
}

export async function runTool(name: string, input: Record<string, unknown>): Promise<unknown> {
  if (name === "bigquery_schema") {
    return schemaToText(await getSchema());
  }
  if (name === "bigquery_query") {
    const { rows, bytesProcesados, sql } = await runQuery(String(input.sql));
    return { sql, filas: rows.length, bytesProcesados, rows };
  }
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
