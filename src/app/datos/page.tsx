import Link from "next/link";
import { bqEnabled, bqProject } from "@/lib/bigquery/client";
import { getSchema, type TableInfo } from "@/lib/bigquery/schema";
import { ANIOS_DISPONIBLES, CARGOS, DISTRITOS, TIPOS_ELECCION } from "@/lib/dine/catalogs";

export const dynamic = "force-dynamic";

const fmt = new Intl.NumberFormat("es-AR");

export default async function DatosPage() {
  let tablas: TableInfo[] = [];
  let bqError = "";
  if (bqEnabled()) {
    try {
      tablas = await getSchema();
    } catch (e) {
      bqError = e instanceof Error ? e.message : "Error";
    }
  }

  // Agrupar tablas por dataset.
  const porDataset = new Map<string, TableInfo[]>();
  for (const t of tablas) {
    const arr = porDataset.get(t.dataset) ?? [];
    arr.push(t);
    porDataset.set(t.dataset, arr);
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/" className="text-xs text-neutral-500 hover:text-neutral-300">
        ← Inicio
      </Link>
      <h1 className="mt-2 text-2xl font-bold tracking-tight">Datos</h1>
      <p className="mt-1 text-sm text-neutral-400">
        Fuentes a las que tiene acceso esta aplicación. Solo consulta — sin descarga.
      </p>

      {/* Fuente DINE */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold">API electoral DINE (en vivo)</h2>
        <p className="mt-1 text-sm text-neutral-400">
          Resultados oficiales totalizados (recuento provisorio). Fuente pública abierta.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Card titulo="Años" items={[...ANIOS_DISPONIBLES, "2025"]} />
          <Card titulo="Tipos de elección" items={TIPOS_ELECCION.map((t) => t.nombre)} />
          <Card titulo="Cargos" items={CARGOS.map((c) => c.nombre)} />
          <Card titulo={`Distritos (${DISTRITOS.length})`} items={DISTRITOS.map((d) => d.nombre)} />
        </div>
      </section>

      {/* BigQuery */}
      <section className="mt-12">
        <h2 className="text-lg font-semibold">BigQuery · {bqProject()}</h2>
        {!bqEnabled() && (
          <p className="mt-1 text-sm text-neutral-500">No configurado en este entorno.</p>
        )}
        {bqError && <p className="mt-1 text-sm text-red-400">No se pudo leer el esquema: {bqError}</p>}

        {[...porDataset.entries()].map(([dataset, ts]) => (
          <div key={dataset} className="mt-6">
            <h3 className="text-sm font-semibold text-neutral-300">
              {dataset} <span className="text-neutral-600">· {ts.length} tablas</span>
            </h3>
            <div className="mt-2 flex flex-col gap-2">
              {ts.map((t) => (
                <details key={t.table} className="rounded-lg border border-neutral-800 bg-neutral-900/50">
                  <summary className="flex cursor-pointer items-center justify-between px-3 py-2 text-sm">
                    <span className="font-mono">{t.table}</span>
                    <span className="text-xs text-neutral-500">
                      {t.rows != null ? `${fmt.format(t.rows)} filas · ` : ""}
                      {t.columns.length} columnas
                    </span>
                  </summary>
                  <div className="flex flex-wrap gap-1.5 border-t border-neutral-800 px-3 py-2">
                    {t.columns.map((c) => (
                      <span key={c.name} className="rounded bg-neutral-800 px-1.5 py-0.5 text-xs">
                        {c.name} <span className="text-neutral-500">{c.type.toLowerCase()}</span>
                      </span>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

function Card({ titulo, items }: { titulo: string; items: readonly string[] }) {
  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-3">
      <div className="text-xs font-medium text-neutral-300">{titulo}</div>
      <div className="mt-1.5 flex flex-wrap gap-1">
        {items.map((i) => (
          <span key={i} className="rounded bg-neutral-800 px-1.5 py-0.5 text-xs text-neutral-400">
            {i}
          </span>
        ))}
      </div>
    </div>
  );
}
