import Link from "next/link";
import { Explorer } from "./explorer";

export default function ExplorarPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/" className="text-xs text-neutral-500 hover:text-neutral-300">
        ← Inicio
      </Link>
      <h1 className="mt-2 text-2xl font-bold tracking-tight">Explorar resultados</h1>
      <p className="mt-1 text-sm text-neutral-400">
        Seleccioná año, elección, cargo y distrito. Datos en vivo del API DINE.
      </p>
      <div className="mt-8">
        <Explorer />
      </div>
    </main>
  );
}
