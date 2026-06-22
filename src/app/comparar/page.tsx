import Link from "next/link";
import { Comparator } from "./comparator";

export default function CompararPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/" className="text-xs text-neutral-500 hover:text-neutral-300">
        ← Inicio
      </Link>
      <h1 className="mt-2 text-2xl font-bold tracking-tight">Comparar elecciones</h1>
      <p className="mt-1 text-sm text-neutral-400">
        Evolución a nivel nacional 2011–2023: participación y % por agrupación.
      </p>
      <div className="mt-8">
        <Comparator />
      </div>
    </main>
  );
}
