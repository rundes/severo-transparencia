"use client";

export interface Serie {
  label: string;
  color: string;
  // y = valor (o null si no hay dato ese año). Mismo largo que xLabels.
  values: (number | null)[];
}

export function LineChart({
  xLabels,
  series,
  yMax = 100,
  unit = "%",
  height = 220,
}: {
  xLabels: string[];
  series: Serie[];
  yMax?: number;
  unit?: string;
  height?: number;
}) {
  const W = 640;
  const H = height;
  const padL = 40;
  const padB = 24;
  const padT = 10;
  const padR = 10;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const n = xLabels.length;

  const x = (i: number) => padL + (n <= 1 ? innerW / 2 : (i / (n - 1)) * innerW);
  const y = (v: number) => padT + innerH - (Math.min(v, yMax) / yMax) * innerH;

  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(f * yMax));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img">
      {ticks.map((t) => (
        <g key={t}>
          <line x1={padL} x2={W - padR} y1={y(t)} y2={y(t)} stroke="#262626" strokeWidth={1} />
          <text x={padL - 6} y={y(t) + 3} textAnchor="end" fontSize={10} fill="#737373">
            {t}
          </text>
        </g>
      ))}
      {xLabels.map((lbl, i) => (
        <text key={lbl} x={x(i)} y={H - 8} textAnchor="middle" fontSize={10} fill="#737373">
          {lbl}
        </text>
      ))}
      {series.map((s) => {
        const pts = s.values
          .map((v, i) => (v == null ? null : ([x(i), y(v)] as [number, number])))
          .filter((p): p is [number, number] => p != null);
        const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
        return (
          <g key={s.label}>
            {d && <path d={d} fill="none" stroke={s.color} strokeWidth={2} />}
            {s.values.map((v, i) =>
              v == null ? null : (
                <circle key={i} cx={x(i)} cy={y(v)} r={3} fill={s.color}>
                  <title>{`${s.label} · ${xLabels[i]}: ${v.toFixed(2)}${unit}`}</title>
                </circle>
              ),
            )}
          </g>
        );
      })}
    </svg>
  );
}
