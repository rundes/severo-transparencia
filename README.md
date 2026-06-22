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

## Próximos pasos

- Visualizaciones: tablas, gráficos de barras por agrupación, mapa por distrito (Leaflet)
- Catálogos desde `getMenu` con token (secciones/circuitos/mesas reales)
- Informes exportables (PDF) y comparaciones entre elecciones
- Streaming de la respuesta IA
