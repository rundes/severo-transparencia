"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Inicio" },
  { href: "/explorar", label: "Explorar" },
  { href: "/comparar", label: "Comparar" },
  { href: "/mapa", label: "Mapa" },
  { href: "/agrupaciones", label: "Agrupaciones" },
  { href: "/datos", label: "Datos" },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function SiteHeader() {
  const pathname = usePathname() ?? "/";

  return (
    <header className="bg-paper">
      <div className="mx-auto flex w-full max-w-6xl items-baseline justify-between gap-4 px-5 pb-3 pt-5 sm:px-6">
        <Link href="/" className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          severo<span className="text-accent">·</span>transparencia
        </Link>
        <span className="hidden whitespace-nowrap text-[0.65rem] uppercase tracking-[0.18em] text-ink-faint sm:block">
          Resultados oficiales · DINE
        </span>
      </div>

      {/* Double rule — newspaper convention */}
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-6">
        <div className="border-t-2 border-ink" />
        <div className="mt-[3px] border-t border-rule" />
      </div>

      <nav className="mx-auto w-full max-w-6xl px-5 sm:px-6">
        <ul className="-mb-px flex gap-5 overflow-x-auto py-2 text-sm">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href} className="shrink-0">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={
                    "border-b-2 pb-1 transition-colors " +
                    (active
                      ? "border-accent font-medium text-ink"
                      : "border-transparent text-ink-soft hover:text-ink")
                  }
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-6">
        <div className="border-t border-rule" />
      </div>
    </header>
  );
}
