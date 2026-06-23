# severo-transparencia

App abierta para **visualizar resultados electorales argentinos** de forma fácil y
**preguntarle a los datos en lenguaje natural** (IA), con generación de informes más
ricos que los estandarizados.

Fuente: API oficial DINE (Ministerio del Interior) — *Publicación de Resultados Electorales*.

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind v4
- Proxy server-side al API electoral (oculta config, cachea)
- IA: Claude API (`@anthropic-ai/sdk`) con tool-use sobre el cliente tipado del API

## API electoral DINE

- Base: `https://resultados.mininterior.gob.ar/api`
- **`GET /resultados/getResultados` es ABIERTO** (sin token). Params:
  `anioEleccion`, `tipoRecuento` (1=provisorio), `tipoEleccion` (1=PASO, 2=Generales, 3=Balotaje),
  `categoriaId` (cargo) + opcionales `distritoId`, `seccionProvincialId`, `seccionId`,
  `circuitoId` (6 díg), `mesaId`.
- `getMenu` (árbol de catálogos) requiere **Bearer token** → por ahora catálogos seedeados
  en `src/lib/dine/catalogs.ts`. Cargá `DINE_BEARER_TOKEN` para desbloquearlo.

### ⚠ `categoriaId` no es global (verificado)

A nivel **nacional** (sin `distritoId`): `1`=Presidente, `2`=Senadores Nac, `3`=Diputados Nac.
Al pasar `distritoId`, el mismo `categoriaId` apunta a **cargos locales** de esa provincia
(ej. distrito `02` con `categoriaId=1` → ~455k electores, no los ~13M de Buenos Aires
presidencial). El mapeo cargo↔distrito correcto vive en `getMenu` (token). Por eso el cruce
cargo×provincia y el mapa por distrito quedan **diferidos hasta tener token**.

Mapeo de distritos (`ID_INDRA`, zero-padded `01`–`24`) es autoritativo, extraído del GeoJSON
oficial del frontend DINE.

## Setup

```bash
npm install
cp .env.example .env.local   # completar ANTHROPIC_API_KEY
npm run dev                  # http://localhost:3000
```

## Estructura

```
src/
  app/
    page.tsx            landing + caja de preguntas
    ask-box.tsx         cliente de la consulta NL
    api/
      resultados/route.ts   proxy getResultados
      ai/route.ts           consulta NL (Claude + tools)
  lib/
    dine/
      client.ts         cliente getResultados (cache + cookie/token)
      types.ts          tipos de respuesta
      catalogs.ts       seed: tipos, cargos, distritos, años
    ai/
      anthropic.ts      loop agéntico (tool-use)
      tools.ts          herramientas sobre el API DINE
```

## Caché

- **getResultados** (individual): Data Cache de Next vía `fetch revalidate`. Histórico
  (años pasados, totalizados) ~30 días; año en curso 60s. Durable en Vercel y `next start`.
- **Agregaciones** (`/api/comparar`, `/api/agrupaciones`): caché persistente propia de 2
  capas (memoria + filesystem, `src/lib/cache.ts`) — evita recomputar el fan-out de 21–63
  consultas. Sobrevive reinicios. Dir configurable con `CACHE_DIR`.

## Próximos pasos

- Token `getMenu` → drill por sección/circuito/mesa + mapeo cargo↔distrito correcto
- Mapa Leaflet (choropleth) — requiere el mapeo cargo↔distrito (token)
- Comparaciones entre elecciones; derivar índice de agrupaciones
