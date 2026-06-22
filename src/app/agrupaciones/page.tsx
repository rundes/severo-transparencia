import Link from "next/link";
import { AgrupacionesIndex } from "./index-client";

export default function AgrupacionesPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/" className="text-xs text-neutral-500 hover:text-neutral-300">
        ← Inicio
      </Link>
      <h1 className="mt-2 text-2xl font-bold tracking-tight">Agrupaciones</h1>
      <p className="mt-1 text-sm text-neutral-400">
        Índice generado automáticamente desde los resultados nacionales (Generales 2011–2023).
        Logo real cuando el API lo provee; si no, avatar generado por nombre.
      </p>
      <div className="mt-8">
        <AgrupacionesIndex />
      </div>
    </main>
  );
}
