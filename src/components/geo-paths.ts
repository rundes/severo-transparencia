// Proyección equirectangular sobre el bounding box del GeoJSON de provincias,
// compartida por el mapa de resultados (Choropleth) y el mapa temático.

export interface GeoFeature {
  properties: { PROVINCIA: string; ID_INDRA: string };
  geometry: { type: "Polygon" | "MultiPolygon"; coordinates: number[][][] | number[][][][] };
}
export interface GeoJSON {
  features: GeoFeature[];
}
export interface GeoPath {
  id: number;
  prov: string;
  d: string;
}

// Anillos [lng,lat][] por feature, normalizados (Polygon y MultiPolygon).
function ringsOf(f: GeoFeature): number[][][] {
  if (f.geometry.type === "Polygon") return f.geometry.coordinates as number[][][];
  return (f.geometry.coordinates as number[][][][]).flat();
}

/** Construye los paths SVG de cada provincia, encuadrados en un viewBox W×H. */
export function buildGeoPaths(geo: GeoJSON, W: number, H: number, PAD: number): GeoPath[] {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const f of geo.features)
    for (const ring of ringsOf(f))
      for (const [x, y] of ring) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
  const s = Math.min((W - 2 * PAD) / (maxX - minX), (H - 2 * PAD) / (maxY - minY));
  const ox = PAD + (W - 2 * PAD - s * (maxX - minX)) / 2;
  const oy = PAD + (H - 2 * PAD - s * (maxY - minY)) / 2;
  const project = (x: number, y: number): [number, number] => [ox + (x - minX) * s, oy + (maxY - y) * s];

  return geo.features.map((f) => {
    const d = ringsOf(f)
      .map((ring) => ring.map(([x, y], i) => `${i === 0 ? "M" : "L"}${project(x, y).map((n) => n.toFixed(1)).join(",")}`).join(" ") + "Z")
      .join(" ");
    return { id: Number(f.properties.ID_INDRA), prov: f.properties.PROVINCIA, d };
  });
}
