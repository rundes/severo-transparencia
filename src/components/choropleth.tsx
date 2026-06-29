"use client";

import { useMemo, useState } from "react";
import type { DistritoGanador } from "../app/api/mapa/route";
import { buildGeoPaths, type GeoJSON } from "./geo-paths";

const W = 460;
const H = 760;
const PAD = 8;

export function Choropleth({
  geo,
  distritos,
  highlight,
}: {
  geo: GeoJSON;
  distritos: DistritoGanador[];
  /** idDistritos a resaltar con contorno de acento (provincias que cambiaron). */
  highlight?: Set<number>;
}) {
  const [hover, setHover] = useState<{ x: number; y: number; d: DistritoGanador; prov: string } | null>(null);

  const byId = useMemo(() => new Map(distritos.map((d) => [d.idDistrito, d])), [distritos]);

  const paths = useMemo(() => buildGeoPaths(geo, W, H, PAD), [geo]);

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[460px]" role="img" aria-label="Mapa de resultados por provincia">
        {/* Resaltadas al final para que el contorno quede por encima de las vecinas. */}
        {[...paths]
          .sort((a, b) => Number(highlight?.has(a.id) ?? false) - Number(highlight?.has(b.id) ?? false))
          .map((p) => {
          const d = byId.get(p.id);
          const isHi = highlight?.has(p.id) ?? false;
          return (
            <path
              key={p.id}
              d={p.d}
              fill={d?.color ?? "oklch(0.92 0.008 80)"}
              stroke={isHi ? "var(--color-accent)" : "var(--color-paper)"}
              strokeWidth={isHi ? 2.2 : 0.8}
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
