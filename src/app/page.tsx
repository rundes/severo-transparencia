import { AskBox } from "./ask-box";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">severo-transparencia</h1>
      <p className="mt-2 text-neutral-400">
        Datos electorales argentinos, abiertos y fáciles de explorar. Preguntá en lenguaje natural.
      </p>
      <div className="mt-10">
        <AskBox />
      </div>
      <p className="mt-12 text-xs text-neutral-600">
        Fuente: API de Publicación de Resultados Electorales (DINE — Ministerio del Interior).
      </p>
    </main>
  );
}
