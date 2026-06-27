export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-rule print:hidden">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-5 py-8 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          Fuente: API de Publicación de Resultados Electorales — DINE, Ministerio del Interior. Recuento provisorio.
        </p>
        <p className="text-ink-faint/80">Proyecto abierto · datos sin afiliación partidaria.</p>
      </div>
    </footer>
  );
}
