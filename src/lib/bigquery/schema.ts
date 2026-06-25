import "server-only";
import { bq, bqProject } from "./client";
import { getCached, TTL } from "@/lib/cache";

// Tablas ocultas (no se listan ni quedan accesibles a la IA). Configurable con
// BQ_EXCLUDE_TABLES (lista separada por comas). Default: malvinas2026.
const EXCLUDED = new Set(
  (process.env.BQ_EXCLUDE_TABLES ?? "malvinas2026")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean),
);

export function excludedTables(): string[] {
  return [...EXCLUDED];
}

export interface ColumnInfo {
  name: string;
  type: string;
}
export interface TableInfo {
  dataset: string;
  table: string;
  columns: ColumnInfo[];
  rows?: number;
}

// Introspecta todas las tablas/columnas del proyecto vía INFORMATION_SCHEMA.
// Schema-agnóstico: no hardcodea nombres. Cacheado (cambia poco).
export async function getSchema(): Promise<TableInfo[]> {
  return getCached("bq:schema:v1", TTL.HISTORICO, async () => {
    const project = bqProject();
    const [datasets] = await bq().getDatasets();
    const tables: TableInfo[] = [];

    for (const ds of datasets) {
      const datasetId = ds.id!;
      const [rows] = await bq().query({
        query: `
          SELECT table_name, column_name, data_type
          FROM \`${project}.${datasetId}.INFORMATION_SCHEMA.COLUMNS\`
          ORDER BY table_name, ordinal_position
        `,
      });
      const byTable = new Map<string, ColumnInfo[]>();
      for (const r of rows as { table_name: string; column_name: string; data_type: string }[]) {
        const cols = byTable.get(r.table_name) ?? [];
        cols.push({ name: r.column_name, type: r.data_type });
        byTable.set(r.table_name, cols);
      }

      // Conteo de filas por tabla (best-effort).
      const rowCount = new Map<string, number>();
      try {
        const [stor] = await bq().query({
          query: `SELECT table_name, SUM(total_rows) AS n
                  FROM \`${project}.${datasetId}.INFORMATION_SCHEMA.TABLE_STORAGE\`
                  GROUP BY table_name`,
        });
        for (const r of stor as { table_name: string; n: number }[]) rowCount.set(r.table_name, Number(r.n));
      } catch {
        // algunas regiones/permisos no exponen TABLE_STORAGE
      }

      for (const [table, columns] of byTable) {
        if (EXCLUDED.has(table.toLowerCase())) continue;
        tables.push({ dataset: datasetId, table, columns, rows: rowCount.get(table) });
      }
    }
    return tables;
  });
}

/** Texto compacto del schema para prompts (dataset.tabla(col tipo, …)). */
export function schemaToText(tables: TableInfo[]): string {
  return tables
    .map((t) => `${t.dataset}.${t.table}(${t.columns.map((c) => `${c.name} ${c.type}`).join(", ")})`)
    .join("\n");
}
