import { bqEnabled, bqProject } from "@/lib/bigquery/client";
import { getSchema, type TableInfo } from "@/lib/bigquery/schema";
import { ANIOS_DISPONIBLES, CARGOS, DISTRITOS, TIPOS_ELECCION } from "@/lib/dine/catalogs";
import { FUENTE_NACIONAL, JUNTAS_PROVINCIALES, type FuenteElectoral } from "@/lib/dine/juntas";
import { Container, Notice, PageHeader } from "@/components/ui";

const hostOf = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

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
    <main>
      <Container className="py-10 sm:py-14">
        <PageHeader kicker="Procedencia" title="Datos">
          <p>Fuentes a las que esta aplicación tiene acceso. Solo consulta, sin descarga.</p>
        </PageHeader>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink">API electoral DINE</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Resultados oficiales totalizados, recuento provisorio. Fuente pública abierta, en vivo.
          </p>
          <div className="mt-5 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <Catalogo titulo="Años" items={[...ANIOS_DISPONIBLES, "2025"]} />
            <Catalogo titulo="Tipos de elección" items={TIPOS_ELECCION.map((t) => t.nombre)} />
            <Catalogo titulo="Cargos" items={CARGOS.map((c) => c.nombre)} />
            <Catalogo titulo={`Distritos (${DISTRITOS.length})`} items={DISTRITOS.map((d) => d.nombre)} />
          </div>
        </section>

        <section className="mt-14">
          <h2 className="font-display text-xl font-semibold text-ink">Organismos electorales oficiales</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Justicia Nacional Electoral y las 24 autoridades electorales provinciales. Fuentes externas
            de consulta; enlaces verificados a junio 2026.
          </p>
          <ul className="mt-5 border-t border-rule">
            <FuenteRow f={FUENTE_NACIONAL} />
            {JUNTAS_PROVINCIALES.map((f) => (
              <FuenteRow key={f.jurisdiccion} f={f} />
            ))}
          </ul>
        </section>

        <section className="mt-14">
          <h2 className="font-display text-xl font-semibold text-ink">
            BigQuery <span className="font-sans text-sm font-normal text-ink-faint">· {bqProject()}</span>
          </h2>
          {!bqEnabled() && <p className="mt-1 text-sm text-ink-faint">No configurado en este entorno.</p>}
          {bqError && (
            <div className="mt-2">
              <Notice>No se pudo leer el esquema: {bqError}</Notice>
            </div>
          )}

          {[...porDataset.entries()].map(([dataset, ts]) => (
            <div key={dataset} className="mt-8">
              <h3 className="text-sm font-semibold text-ink">
                {dataset} <span className="font-normal text-ink-faint">· {ts.length} tablas</span>
              </h3>
              <ul className="mt-2 border-t border-rule">
                {ts.map((t) => (
                  <li key={t.table} className="border-b border-rule">
                    <details className="group">
                      <summary className="flex cursor-pointer items-center justify-between gap-3 py-2.5 text-sm transition-colors hover:bg-paper-2">
                        <span className="font-mono text-ink">{t.table}</span>
                        <span className="shrink-0 text-xs tabular-nums text-ink-faint">
                          {t.rows != null ? `${fmt.format(t.rows)} filas · ` : ""}
                          {t.columns.length} columnas
                        </span>
                      </summary>
                      <div className="flex flex-wrap gap-1.5 pb-3">
                        {t.columns.map((c) => (
                          <span key={c.name} className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-xs text-ink-soft">
                            {c.name} <span className="text-ink-faint">{c.type.toLowerCase()}</span>
                          </span>
                        ))}
                      </div>
                    </details>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </Container>
    </main>
  );
}

function FuenteRow({ f }: { f: FuenteElectoral }) {
  return (
    <li className="border-b border-rule py-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="text-sm font-medium text-ink">{f.jurisdiccion}</span>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs">
          <a
            href={f.sitio}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-accent underline-offset-2 hover:underline"
          >
            {hostOf(f.sitio)}
          </a>
          {f.resultados && (
            <a
              href={f.resultados}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-accent underline-offset-2 hover:underline"
            >
              resultados ↗
            </a>
          )}
        </div>
      </div>
      <div className="mt-0.5 text-xs text-ink-faint">
        {f.organismo}
        {f.nota ? <span className="text-ink-faint"> · {f.nota}</span> : null}
      </div>
    </li>
  );
}

function Catalogo({ titulo, items }: { titulo: string; items: readonly string[] }) {
  return (
    <div>
      <div className="mb-2 text-[0.7rem] font-medium uppercase tracking-[0.1em] text-ink-faint">{titulo}</div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((i) => (
          <span key={i} className="rounded border border-rule bg-paper px-2 py-0.5 text-xs text-ink-soft">
            {i}
          </span>
        ))}
      </div>
    </div>
  );
}
