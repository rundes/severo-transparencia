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

// ¿La DINE entregó un color usable? Descarta vacío y el gris placeholder "#888".
export function dineColorValido(color: string | null | undefined): boolean {
  return !!color && color.trim() !== "" && color.toLowerCase() !== "#888";
}

// Color determinístico por nombre de agrupación, para cuando la DINE no provee
// color oficial. La misma agrupación recibe siempre el mismo color de la paleta.
export function colorForAgrupacion(nombre: string): string {
  let h = 0;
  for (let i = 0; i < nombre.length; i++) h = (h * 31 + nombre.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

// Acento de la app (debe coincidir con --color-accent de globals.css).
export const ACCENT = "oklch(0.50 0.095 196)";
