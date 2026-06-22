const nf = new Intl.NumberFormat("es-AR");
const pf = new Intl.NumberFormat("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const fmtNum = (n: number) => nf.format(n);
export const fmtPct = (n: number) => `${pf.format(n)}%`;

// Paleta estable para barras de agrupaciones.
const PALETTE = [
  "#38bdf8", "#f472b6", "#a3e635", "#fbbf24", "#c084fc",
  "#fb7185", "#34d399", "#60a5fa", "#f59e0b", "#e879f9",
];
export const colorFor = (i: number) => PALETTE[i % PALETTE.length];
