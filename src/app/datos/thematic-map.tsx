"use client";

import { useEffect, useMemo, useState } from "react";
import { REGIMENES, LABELS, type RegimenElectoral } from "@/lib/electoral/regimenes";
import { DISTRITOS } from "@/lib/dine/catalogs";
import { colorFor } from "@/lib/format";
import { buildGeoPaths, type GeoJSON } from "@/components/geo-paths";
import { Field } from "@/components/ui";

const W = 380;
const H = 620;
const PAD = 8;

// jurisdicción (regimenes) -> idDistrito (1..24). Nación (id 0) no se mapea.
const ID_POR_NOMBRE = new Map(DISTRITOS.filter((d) => d.id > 0).map((d) => [d.nombre, d.id]));

type Variable = {
  key: string;
  label: string;
  get: (r: RegimenElectoral) => string;
  labels: Record<string, string>;
};

const VARIABLES: Variable[] = [
  { key: "instrumento", label: "Instrumento de voto", get: (r) => r.instrumento, labels: LABELS.instrumento },
  { key: "desdoblamiento", label: "Desdoblamiento", get: (r) => r.desdoblamiento.regimen, labels: LABELS.desdoblamiento },
  { key: "alianzas", label: "Sistema de alianzas", get: (r) => r.alianzas, labels: LABELS.alianzas },
  { key: "gobernador", label: "Elección de gobernador", get: (r) => r.gobernador, labels: LABELS.gobernador },
  { key: "camaras", label: "Cámaras", get: (r) => r.camaras ?? "sin_dato", labels: LABELS.camaras },
  { key: "renovacion", label: "Renovación legislativa", get: (r) => r.renovacion ?? "sin_dato", labels: LABELS.renovacion },
  { key: "votoJoven", label: "Voto joven (16-17)", get: (r) => r.votoJoven ?? "sin_dato", labels: LABELS.votoJoven },
];

export function ThematicMap() {
  const [geo, setGeo] = useState<GeoJSON | null>(null);
  const [varKey, setVarKey] = useState("instrumento");
  const [hover, setHover] = useState<{ x: number; y: number; prov: string; valor: string } | null>(null);

  useEffect(() => {
    fetch("/provincias.geojson").then((r) => r.json()).then(setGeo).catch(() => setGeo(null));
  }, []);

  const variable = VARIABLES.find((v) => v.key === varKey) ?? VARIABLES[0];

  // Categorías presentes (orden por frecuencia) -> color de la paleta editorial.
  const { leyenda, porId } = useMemo(() => {
    const cuenta = new Map<string, number>();
    const valorPorId = new Map<number, { valor: string; prov: string }>();
    for (const r of REGIMENES) {
      const id = ID_POR_NOMBRE.get(r.jurisdiccion);
      if (id == null) continue; // Nación
      const valor = variable.get(r);
      cuenta.set(valor, (cuenta.get(valor) ?? 0) + 1);
      valorPorId.set(id, { valor, prov: r.jurisdiccion });
    }
    const ordenadas = [...cuenta.entries()].sort((a, b) => b[1] - a[1]);
    const colorPorValor = new Map(ordenadas.map(([valor], i) => [valor, colorFor(i)]));
    const leyenda = ordenadas.map(([valor, n]) => ({ valor, n, color: colorPorValor.get(valor)! }));
    const porId = new Map(
      [...valorPorId.entries()].map(([id, { valor, prov }]) => [id, { color: colorPorValor.get(valor)!, valor, prov }]),
    );
    return { colorPorValor, leyenda, porId };
  }, [variable]);

  const paths = useMemo(() => (geo ? buildGeoPaths(geo, W, H, PAD) : []), [geo]);

  return (
    <div className="flex flex-col gap-5">
      <div className="sm:max-w-xs">
        <Field label="Pintar por" value={varKey} onChange={setVarKey} options={VARIABLES.map((v) => [v.key, v.label])} />
      </div>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <div className="relative shrink-0">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[380px]" role="img" aria-label={`Mapa por ${variable.label}`}>
            {paths.map((p) => {
              const d = porId.get(p.id);
              return (
                <path
                  key={p.id}
                  d={p.d}
                  fill={d?.color ?? "oklch(0.92 0.008 80)"}
                  stroke="var(--color-paper)"
                  strokeWidth={0.8}
                  className="cursor-pointer transition-opacity hover:opacity-80"
                  onMouseMove={(e) => {
                    const r = (e.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect();
                    if (d) setHover({ x: e.clientX - r.left, y: e.clientY - r.top, prov: d.prov, valor: variable.labels[d.valor] ?? d.valor });
                  }}
                  onMouseLeave={() => setHover(null)}
                />
              );
            })}
          </svg>
          {hover && (
            <div
              className="pointer-events-none absolute z-10 rounded-md border border-rule-strong bg-paper px-2.5 py-1.5 text-xs text-ink shadow-md"
              style={{ left: hover.x + 12, top: hover.y + 12 }}
            >
              <div className="font-medium">{hover.prov}</div>
              <div className="text-ink-soft">{hover.valor}</div>
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="mb-3 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-ink-faint">{variable.label}</h3>
          <ul className="divide-y divide-rule border-t border-rule">
            {leyenda.map(({ valor, n, color }) => (
              <li key={valor} className="flex items-center gap-2.5 py-2 text-sm">
                <span className="inline-block h-3 w-3 shrink-0 rounded-[2px]" style={{ background: color }} />
                <span className="min-w-0 flex-1 truncate text-ink">{variable.labels[valor] ?? valor}</span>
                <span className="tabular-nums text-ink-faint">{n}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-ink-faint">24 provincias (la Nación no se incluye en el mapa).</p>
        </div>
      </div>
    </div>
  );
}
