import Link from "next/link";
import { MapaClient } from "./mapa-client";

export default function MapaPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/" className="text-xs text-neutral-500 hover:text-neutral-300">
        ← Inicio
      </Link>
      <h1 className="mt-2 text-2xl font-bold tracking-tight">Mapa por provincia</h1>
      <p className="mt-1 text-sm text-neutral-400">
        Agrupación ganadora por distrito. Pasá el mouse para ver detalle.
      </p>
      <div className="mt-8">
        <MapaClient />
      </div>
    </main>
  );
}
