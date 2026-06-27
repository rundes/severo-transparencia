const nf = new Intl.NumberFormat("es-AR");
const pf = new Intl.NumberFormat("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const fmtNum = (n: number) => nf.format(n);
export const fmtPct = (n: number) => `${pf.format(n)}%`;

// Paleta categórica editorial (tonos de imprenta apagados, no neón) para series
// y chips donde no hay color oficial de la DINE. Ver DESIGN.md.
const PALETTE = [
  "oklch(0.50 0.095 196)", // teal/petróleo
  "oklch(0.58 0.13 60)",   // ocre
  "oklch(0.55 0.14 35)",   // terracota
  "oklch(0.55 0.09 135)",  // oliva
  "oklch(0.47 0.10 330)",  // ciruela
  "oklch(0.50 0.08 255)",  // azul pizarra
  "oklch(0.66 0.12 90)",   // mostaza
  "oklch(0.52 0.15 45)",   // óxido
];
export const colorFor = (i: number) => PALETTE[i % PALETTE.length];

// Acento de la app (debe coincidir con --color-accent de globals.css).
export const ACCENT = "oklch(0.50 0.095 196)";
