import type { DistritoGanador } from "../api/mapa/route";

export interface Flip {
  id: number;
  prov: string;
  from: DistritoGanador;
  to: DistritoGanador;
}

/**
 * Provincias donde cambió la agrupación ganadora entre la elección A y la B.
 * Match por idDistrito; una provincia ausente en cualquiera de los lados se
 * excluye. El cambio se decide por nombre de ganador (un rename de coalición
 * cuenta como cambio).
 */
export function computeFlips(a: DistritoGanador[], b: DistritoGanador[]): Flip[] {
  const byId = new Map(b.map((d) => [d.idDistrito, d]));
  const flips: Flip[] = [];
  for (const from of a) {
    const to = byId.get(from.idDistrito);
    if (to && from.ganador !== to.ganador) {
      flips.push({ id: from.idDistrito, prov: from.distrito, from, to });
    }
  }
  return flips.sort((x, y) => x.prov.localeCompare(y.prov, "es"));
}
