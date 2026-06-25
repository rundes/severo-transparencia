import "server-only";
import { bq, bqProject } from "./client";

const MAX_BYTES_BILLED = 2 * 1024 * 1024 * 1024; // 2 GB tope por consulta
const DEFAULT_LIMIT = 1000;

export class SqlNoPermitido extends Error {}

// Solo lectura: una sentencia SELECT/WITH, sin DML/DDL.
export function validarSelect(sql: string): string {
  const limpio = sql.trim().replace(/;\s*$/, "");
  if (/;/.test(limpio)) throw new SqlNoPermitido("Una sola sentencia, sin ';'");
  if (!/^(select|with)\b/i.test(limpio)) throw new SqlNoPermitido("Solo se permiten consultas SELECT/WITH");
  if (/\b(insert|update|delete|merge|drop|create|alter|truncate|grant|revoke|call)\b/i.test(limpio))
    throw new SqlNoPermitido("Sentencia no permitida (solo lectura)");
  // Forzar LIMIT si no hay.
  if (!/\blimit\s+\d+/i.test(limpio)) return `${limpio}\nLIMIT ${DEFAULT_LIMIT}`;
  return limpio;
}

export interface QueryResult {
  rows: Record<string, unknown>[];
  bytesProcesados: number;
  sql: string;
}

export async function runQuery(sql: string): Promise<QueryResult> {
  const seguro = validarSelect(sql);
  const [job] = await bq().createQueryJob({
    query: seguro,
    defaultDataset: undefined,
    maximumBytesBilled: String(MAX_BYTES_BILLED),
    useLegacySql: false,
    location: process.env.GCP_BQ_LOCATION || undefined,
    jobTimeoutMs: 30000,
  });
  const [rows] = await job.getQueryResults({ maxResults: DEFAULT_LIMIT });
  const meta = job.metadata?.statistics?.query;
  return {
    rows: rows as Record<string, unknown>[],
    bytesProcesados: Number(meta?.totalBytesProcessed ?? 0),
    sql: seguro,
  };
}

export function project(): string {
  return bqProject();
}
