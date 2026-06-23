# Deploy — Vercel

App Next.js 15 con server-side (proxy DINE + IA streaming). Sin base de datos.

## Pasos

1. **Importar el repo** en Vercel (New Project → `rundes/severo-transparencia`).
   Framework se autodetecta (Next.js). Build/install por defecto.

2. **Variables de entorno** (Project Settings → Environment Variables):

   | Var | Requerida | Valor |
   |-----|-----------|-------|
   | `ANTHROPIC_API_KEY` | Sí (para IA) | tu key de Anthropic |
   | `ANTHROPIC_MODEL` | No | `claude-opus-4-8` (default) |
   | `DINE_API_BASE` | No | default ya configurado |
   | `DINE_ROUTING_COOKIE` | No | default ya configurado |
   | `CACHE_DIR` | No | **dejar vacío** en Vercel (usa `/tmp`) |

   El resto de features (explorar, comparar, agrupaciones) funcionan sin ninguna var.

3. **Plan**: los informes IA pueden tardar >60s. La ruta `/api/ai` declara
   `maxDuration = 300`, que requiere **plan Pro**. En Hobby, el tope es 60s
   (el streaming mitiga: la respuesta llega de a poco igual).

4. **Deploy**: push a `main` → deploy automático.

## Región

`vercel.json` fija `gru1` (São Paulo), la más cercana a Argentina → menor latencia
al API DINE y a los usuarios.

## Caché en Vercel

- **getResultados / totalizado / menu**: Next.js Data Cache (fetch `revalidate`),
  durable y compartido por Vercel. Histórico ~30 días, año en curso 60s.
- **Agregaciones** (comparar / agrupaciones): caché propia en `/tmp`, efímera y
  por-instancia en serverless. Para caché durable compartida, conectar Vercel KV o
  Upstash Redis y reemplazar el backend fs en `src/lib/cache.ts` (opcional).

## Límites del API DINE

`getResultados`, `menu` y `resultado/totalizado` son abiertos (sin token). No hay
rate-limit documentado; la caché reduce los hits. Si el upstream falla, las rutas
devuelven 502 con el detalle.
