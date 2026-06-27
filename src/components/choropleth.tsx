"use client";

import { useMemo, useState } from "react";
import type { DistritoGanador } from "../app/api/mapa/route";

interface Feature {
  properties: { PROVINCIA: string; ID_INDRA: string };
  geometry: { type: "Polygon" | "MultiPolygon"; coordinates: number[][][] | number[][][][] };
}
interface GeoJSON {
  features: Feature[];
}

const W = 460;
const H = 760;
const PAD = 8;

// Anillos [lng,lat][] por feature, normalizados (Polygon y MultiPolygon).
function ringsOf(f: Feature): number[][][] {
  if (f.geometry.type === "Polygon") return f.geometry.coordinates as number[][][];
  return (f.geometry.coordinates as number[][][][]).flat();
}

export function Choropleth({ geo, distritos }: { geo: GeoJSON; distritos: DistritoGanador[] }) {
  const [hover, setHover] = useState<{ x: number; y: number; d: DistritoGanador; prov: string } | null>(null);

  const byId = useMemo(() => new Map(distritos.map((d) => [d.idDistrito, d])), [distritos]);

  // Proyección equirectangular sobre el bounding box de todas las geometrías.
  const { project, paths } = useMemo(() => {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const f of geo.features)
      for (const ring of ringsOf(f))
        for (const [x, y] of ring) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
    const sx = (W - 2 * PAD) / (maxX - minX);
    const sy = (H - 2 * PAD) / (maxY - minY);
    const s = Math.min(sx, sy);
    const ox = PAD + (W - 2 * PAD - s * (maxX - minX)) / 2;
    const oy = PAD + (H - 2 * PAD - s * (maxY - minY)) / 2;
    const project = (x: number, y: number): [number, number] => [ox + (x - minX) * s, oy + (maxY - y) * s];

    const paths = geo.features.map((f) => {
      const d = ringsOf(f)
        .map((ring) => ring.map(([x, y], i) => `${i === 0 ? "M" : "L"}${project(x, y).map((n) => n.toFixed(1)).join(",")}`).join(" ") + "Z")
        .join(" ");
      return { id: Number(f.properties.ID_INDRA), prov: f.properties.PROVINCIA, d };
    });
    return { project, paths };
  }, [geo]);

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[460px]" role="img" aria-label="Mapa de resultados por provincia">
        {paths.map((p) => {
          const d = byId.get(p.id);
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
                if (d) setHover({ x: e.clientX - r.left, y: e.clientY - r.top, d, prov: p.prov });
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
          <div className="font-medium">{hover.d.distrito}</div>
          <div className="mt-0.5 flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: hover.d.color }} />
            <span className="text-ink-soft">{hover.d.ganador} · <span className="tabular-nums">{Number(hover.d.pct).toFixed(2)}%</span></span>
          </div>
          <div className="text-ink-faint">Participación {Number(hover.d.participacion).toFixed(2)}%</div>
        </div>
      )}
    </div>
  );
}
