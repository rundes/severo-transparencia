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

### Endpoints reales (abiertos, sin token)

El endpoint legacy `resultados/getResultados` (el documentado) está **roto a nivel distrito**.
El SPA oficial usa estos, todos **abiertos** (no hace falta token; el JWT del front es
autogenerado y opcional). Son la base de la capa v2 (`src/lib/dine/v2-*.ts`):

- `GET /api/menu/periodos` → años disponibles
- `GET /api/menu?año=Y&idEleccion=E` → árbol `Cargos→Distritos→SeccionesProvinciales→Secciones`
  (el param `año` lleva ñ → se envía `a%C3%B1o`)
- `GET /api/resultado/totalizado?año&idEleccion&idCargo&idDistrito[&idSeccionProvincial&idSeccion…]`
  → totalizado con `agrupaciones` (votos, %, **color real**), participación, electores, listas.
  `idDistrito=0` = nacional. Omitir `idSeccionProvincial` cuando es `null` en el árbol.

`idCargo`: 1=Presidente, 2=Sen Nac, 3=Dip Nac, 4=Gobernador, 5=Sen Prov, 6=Dip Prov,
7=Intendente, 8/9=Parlasur, 10=Concejal. `idDistrito`: 0=Argentina, 1=CABA, 2=Buenos Aires … 24=TdF.

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
