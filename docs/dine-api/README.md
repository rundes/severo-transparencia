# API electoral DINE — documentación oficial (vendored)

Fuente: Ministerio del Interior, *Sistema de Publicación de Resultados Electorales*.
Docs: https://resultados.mininterior.gob.ar/desarrollo · Soporte: soportedine@mininterior.gob.ar

- `openapi.yaml` — OpenAPI 3.0.3 oficial (v1.0.1). Único endpoint: `GET /resultados/getResultados`.
- `insomnia-collection.yaml` — colección Insomnia oficial con ejemplos.

## Resumen

- Server: `https://resultados.mininterior.gob.ar/api`
- Seguridad: `bearer_auth` (JWT) declarada — *"puede requerirse"*. En la práctica
  `getResultados` responde **sin token**. El árbol de catálogos (`getMenu`, usado por el
  frontend) NO está en el spec público y sí requiere token.
- Parámetros: solo `categoriaId` es **required**; el resto opcionales. Para un ámbito
  sub-nacional, enviar los IDs de los padres (ej: sección ⇒ también `distritoId`).
- `tipoRecuento=1` (provisorio), `tipoEleccion` 1=PASO/2=Generales/3=Balotaje.

### ⚠ categoriaId no es global

Verificado contra el API: a nivel nacional `categoriaId` 1/2/3 = Presidente/Senadores/Diputados,
pero con `distritoId` el mismo id mapea a cargos locales de la provincia. El mapeo correcto
cargo↔distrito requiere `getMenu` (token). Ver `src/lib/dine/catalogs.ts`.

El código (`src/lib/dine/types.ts`, `client.ts`) está sincronizado con este spec.
