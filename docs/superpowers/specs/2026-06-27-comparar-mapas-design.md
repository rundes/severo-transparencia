# Comparar mapas entre elecciones — diseño

Fecha: 2026-06-27

## Objetivo

Permitir comparar dos elecciones en el mapa por provincia: ver los dos mapas
lado a lado y resaltar las provincias donde cambió la agrupación ganadora
("flip"). Vive como un toggle dentro de `/mapa`; sin ruta nueva.

## Alcance

- Toggle **"Comparar"** en `/mapa`. Off = comportamiento actual intacto.
- On = dos mapas (A y B) lado a lado, cada uno con su año + elección; cargo
  compartido. Provincias que cambiaron de ganador: contorno de acento en ambos
  mapas + lista "Cambios de ganador (N)" debajo.
- Reusa `/api/mapa` dos veces (un fetch por lado). Sin endpoint nuevo.

Fuera de alcance: drill a sección/circuito, comparación de delta de %,
exportación.

## Arquitectura

### Hook `useMapData` — `src/app/mapa/use-map-data.ts`

Extrae el `fetch` actual de `mapa-client.tsx`:

```ts
function useMapData(anio: number | null, idEleccion: number | null, idCargo: string):
  { distritos: DistritoGanador[]; loading: boolean; error: string }
```

- Encapsula `AbortController`, fetch a `/api/mapa?anio&idEleccion&idCargo`,
  parseo de error.
- Si `idEleccion == null` o `anio == null` → no fetchea, devuelve estado vacío.
  Así el lado B se "apaga" pasando `idEleccion=null` cuando `compare` está off.

### Estado en `mapa-client.tsx`

Nuevo:
- `compare: boolean`
- `anioB: number | null`, `idEleccionB: number | null`

A = `anio` / `idEleccion` actuales. Cargo (`idCargo`) compartido.
Dos llamadas: `useMapData(anio, idEleccion, idCargo)` y
`useMapData(anioB, compare ? idEleccionB : null, idCargo)`.

Default de B al activar `compare`: la elección más reciente distinta de A
(o, si no hay, la misma — el usuario ajusta).

### Cálculo de flip (cliente, puro)

Función pura testeable en el mismo archivo o `use-map-data.ts`:

```ts
interface Flip { id: number; prov: string; from: DistritoGanador; to: DistritoGanador }
function computeFlips(a: DistritoGanador[], b: DistritoGanador[]): Flip[]
```

- Match de provincia por `idDistrito`. Provincia ausente en un lado → excluida.
- Flip cuando `a.ganador !== b.ganador` (match por nombre de ganador).
- `highlight = new Set(flips.map(f => f.id))`.

### `Choropleth` — `src/components/choropleth.tsx`

Prop opcional `highlight?: Set<number>`:
- Provincias en `highlight`: `stroke="var(--color-accent)"`, `strokeWidth≈2.2`,
  y se renderizan al final del map (contorno por encima de vecinas).
- Sin `highlight`: render idéntico al actual (backward-compatible).

## Layout

- Chip toggle "Comparar" junto a los selectores.
- **Off**: selectores `[Año][Elección][Cargo]` + un mapa + leyenda actual.
- **On**: `[Cargo]` compartido arriba; dos columnas de selectores
  `A: [Año][Elección]` / `B: [Año][Elección]`. Debajo, dos `Choropleth` en
  `sm:flex-row` (apilados en mobile), cada uno con caption "Año · elección".
  Ancho completo debajo: lista "Cambios de ganador (N)".

## Lista de cambios

Header `Cambios de ganador (N)`. Filas `divide-y divide-rule`, orden alfabético
por provincia:
```
Buenos Aires   ● Unión por la Patria  →  ● La Libertad Avanza
```
Dos swatches con color DINE real de cada lado + flecha.

## Edge cases

- A = B (misma elección) → 0 flips; Notice "Elegí dos elecciones distintas".
- Cargo inexistente en una elección → ese lado vuelve vacío; el otro sigue.
- Loading por lado (cada mapa su "Cargando…"); flip solo con ambos listos.
- Rename de coalición cuenta como flip → nota al pie.
- `prefers-reduced-motion`: contorno sin animación.

## Archivos

| Archivo | Cambio |
|---|---|
| `src/app/mapa/use-map-data.ts` | nuevo: hook + `computeFlips` |
| `src/app/mapa/mapa-client.tsx` | toggle, selector B, layout 2-up, flip, lista |
| `src/components/choropleth.tsx` | prop `highlight?` + stroke de acento |

Sin endpoint nuevo, sin tocar caché, sin dependencias.
