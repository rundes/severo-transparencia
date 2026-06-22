import Link from "next/link";
import { AskBox } from "./ask-box";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">severo-transparencia</h1>
      <p className="mt-2 text-neutral-400">
        Datos electorales argentinos, abiertos y fáciles de explorar. Preguntá en lenguaje natural.
      </p>
      <div className="mt-4 flex gap-2">
        <Link
          href="/explorar"
          className="inline-block rounded-lg border border-neutral-800 px-3 py-1.5 text-sm text-neutral-300 hover:border-neutral-600"
        >
          Explorar resultados →
        </Link>
        <Link
          href="/comparar"
          className="inline-block rounded-lg border border-neutral-800 px-3 py-1.5 text-sm text-neutral-300 hover:border-neutral-600"
        >
          Comparar elecciones →
        </Link>
        <Link
          href="/agrupaciones"
          className="inline-block rounded-lg border border-neutral-800 px-3 py-1.5 text-sm text-neutral-300 hover:border-neutral-600"
        >
          Agrupaciones →
        </Link>
      </div>
      <div className="mt-10">
        <AskBox />
      </div>
      <p className="mt-12 text-xs text-neutral-600">
        Fuente: API de Publicación de Resultados Electorales (DINE — Ministerio del Interior).
      </p>
    </main>
  );
}
