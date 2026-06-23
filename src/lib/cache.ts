import "server-only";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

// Caché persistente de 2 capas: memoria (rápida, por proceso) + filesystem (sobrevive
// reinicios). Para datos electorales históricos (inmutables) usar TTL largo.
//
// Dir: CACHE_DIR env o <tmpdir>/severo-transparencia-cache. En Vercel el fs es
// efímero por instancia; igual ayuda en invocaciones tibias. La capa durable
// cross-instancia para getResultados es el Data Cache de Next (ver client.ts).

const DIR = process.env.CACHE_DIR ?? join(tmpdir(), "severo-transparencia-cache");

const ANIO_ACTUAL = new Date().getFullYear();
export const TTL = {
  /** Resultados de años pasados: totalizados y definitivos → muy largo. */
  HISTORICO: 365 * 24 * 60 * 60 * 1000,
  /** Datos del año en curso (posible noche electoral) → corto. */
  VIVO: 60 * 1000,
};

/** TTL según si el año ya pasó (inmutable) o es el actual (puede cambiar). */
export function ttlPorAnio(anios: readonly string[]): number {
  return anios.some((a) => Number(a) >= ANIO_ACTUAL) ? TTL.VIVO : TTL.HISTORICO;
}

interface Entry<T> {
  at: number;
  data: T;
}

const mem = new Map<string, Entry<unknown>>();

function fileFor(key: string): string {
  return join(DIR, createHash("sha256").update(key).digest("hex") + ".json");
}

async function readFs<T>(key: string): Promise<Entry<T> | null> {
  try {
    return JSON.parse(await readFile(fileFor(key), "utf8")) as Entry<T>;
  } catch {
    return null;
  }
}

async function writeFs<T>(key: string, entry: Entry<T>): Promise<void> {
  try {
    await mkdir(DIR, { recursive: true });
    await writeFile(fileFor(key), JSON.stringify(entry), "utf8");
  } catch {
    // Caché best-effort: si el fs es read-only, seguimos sin persistir.
  }
}

/** Devuelve el valor cacheado si está fresco; si no, ejecuta `producer`, cachea y devuelve. */
export async function getCached<T>(key: string, ttlMs: number, producer: () => Promise<T>): Promise<T> {
  const now = Date.now();

  const m = mem.get(key) as Entry<T> | undefined;
  if (m && now - m.at < ttlMs) return m.data;

  const f = await readFs<T>(key);
  if (f && now - f.at < ttlMs) {
    mem.set(key, f);
    return f.data;
  }

  const data = await producer();
  const entry: Entry<T> = { at: now, data };
  mem.set(key, entry);
  await writeFs(key, entry);
  return data;
}
