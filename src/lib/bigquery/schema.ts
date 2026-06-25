import "server-only";
import { bq, bqProject } from "./client";
import { getCached, TTL } from "@/lib/cache";

export interface ColumnInfo {
  name: string;
  type: string;
}
export interface TableInfo {
  dataset: string;
  table: string;
  columns: ColumnInfo[];
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
      for (const [table, columns] of byTable) tables.push({ dataset: datasetId, table, columns });
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
