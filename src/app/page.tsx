import Link from "next/link";
import { AskBox } from "./ask-box";
import { Container, PageHeader } from "@/components/ui";

const SECCIONES = [
  { href: "/explorar", title: "Explorar", desc: "Resultados por año, cargo, distrito y sección." },
  { href: "/comparar", title: "Comparar", desc: "Evolución nacional de participación y fuerzas entre elecciones." },
  { href: "/mapa", title: "Mapa", desc: "Agrupación ganadora por provincia." },
  { href: "/agrupaciones", title: "Agrupaciones", desc: "Índice histórico de fuerzas políticas." },
  { href: "/datos", title: "Datos", desc: "Fuentes que esta aplicación puede consultar." },
];

export default function Home() {
  return (
    <main>
      <Container className="py-10 sm:py-14">
        <PageHeader kicker="Datos electorales argentinos" title="Quién ganó, por cuánto y dónde, sin vueltas.">
          <p className="max-w-xl">
            Resultados oficiales de la DINE, abiertos y legibles. Preguntá en lenguaje natural o explorá los números
            por tu cuenta.
          </p>
        </PageHeader>

        <section aria-label="Consulta en lenguaje natural" className="max-w-2xl">
          <AskBox />
        </section>

        <section className="mt-16">
          <h2 className="mb-1 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-ink-faint">
            Explorar por tu cuenta
          </h2>
          <ul className="border-t border-rule">
            {SECCIONES.map((s) => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  className="group flex items-baseline justify-between gap-4 border-b border-rule py-4 transition-colors hover:bg-paper-2"
                >
                  <div className="min-w-0">
                    <span className="font-display text-lg font-medium text-ink">{s.title}</span>
                    <span className="ml-3 text-sm text-ink-soft">{s.desc}</span>
                  </div>
                  <span className="shrink-0 text-ink-faint transition-transform group-hover:translate-x-0.5 group-hover:text-accent">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </main>
  );
}
