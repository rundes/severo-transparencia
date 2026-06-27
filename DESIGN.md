# Design

## Theme

Claro. Escena física: un periodista escanea, de día en un monitor de redacción, quién ganó y por cuánto; a la noche, un ciudadano abre el mismo dato en el teléfono. Ambos quieren que se lea como una página de datos de diario confiable, no como una app oscura de tablero. El papel cálido fuerza la decisión: registro de prensa / data-journalism sobre papel, no dark mode.

## Color

Estrategia: **Restrained** (piso del registro product). Neutros tintados hacia el cálido del papel + un acento único no-partidario usado ≤10% (acciones primarias, selección actual, foco, marca). Las barras de resultados NO usan el acento: llevan el color oficial que la DINE asigna a cada agrupación.

Tokens (OKLCH, definidos en `globals.css` como `@theme`):

- `--color-paper` `oklch(0.985 0.006 85)` — papel crema cálido (fondo)
- `--color-paper-2` `oklch(0.965 0.009 83)` — superficie levemente hundida (zonas, inputs)
- `--color-ink` `oklch(0.23 0.013 55)` — casi-negro cálido (texto principal)
- `--color-ink-soft` `oklch(0.46 0.012 58)` — texto secundario
- `--color-ink-faint` `oklch(0.60 0.010 60)` — labels, metadatos
- `--color-rule` `oklch(0.88 0.008 75)` — hairlines / bordes
- `--color-rule-strong` `oklch(0.78 0.010 70)` — reglas de énfasis
- `--color-accent` `oklch(0.50 0.095 196)` — petróleo/teal profundo: tensión fría sobre papel cálido, no coincide con ningún color partidario argentino (celeste/rojo/amarillo/violeta)
- `--color-accent-soft` `oklch(0.95 0.022 196)` — tinte de acento para fondos de estado
- `--color-danger` `oklch(0.52 0.16 27)` — errores

Paleta categórica editorial (para series de líneas/chips donde no hay color DINE): teal, ocre, terracota, oliva, ciruela, azul pizarra, mostaza, óxido. Tonos de imprenta apagados, nunca neón. Definida en `src/lib/format.ts`.

## Typography

Dos familias, cargadas con `next/font/google`:

- **Display — Fraunces** (serif variable, alto contraste editorial). Solo en cromo de marca: wordmark del masthead, títulos de página (`h1`), encabezados de informe. Nunca en labels, botones ni datos (regla del registro product).
- **UI / texto / datos — Inter** (sans variable). Todo lo funcional: nav, controles, tablas, cifras (`tabular-nums`), cuerpo. Inter aporta neutralidad legible y credibilidad de herramienta.

Escala: títulos de página grandes y serif para el registro editorial; escala de UI fija en rem, ratio ~1.2, contraste por peso. Longitud de línea de prosa 60–72ch; tablas y datos pueden correr más densos.

## Layout

Registro de diario envolviendo una herramienta de datos limpia:

- **Masthead** full-width: wordmark Fraunces + doble regla fina (convención de prensa) + nav horizontal de texto (acento en activo) + dateline de fuente a la derecha.
- **Sin cards genéricas.** Los stats van en una tira separada por hairlines verticales (strip de datos de diario), no en cajas redondeadas con sombra. Las listas se separan con reglas finas.
- Columna editorial angosta para la home/lede y el AskBox; ancho mayor (`max-w-5xl/6xl`) para vistas densas (explorar, comparar, mapa).
- Espaciado variado para ritmo; nada de padding uniforme en todo.
- Bordes de 1px, radios discretos. Una sola sombra sutil reservada para overlays (tooltip del mapa).

## Components

Selectores, campos, botón primario/secundario, chips de toggle, tira de stats, barra de resultado, tabla editorial, tooltip de mapa: vocabulario único y consistente pantalla a pantalla. Cada control con estados default/hover/focus/disabled; foco con anillo de acento. Estados de carga discretos (texto), error en `--color-danger`, vacío que enseña la interfaz.

## Motion

150–250 ms, ease-out exponencial. La motion comunica estado: las barras crecen en ancho al cargar, los reveal de detalle. Nada de coreografía de página ni bounce. Respeta `prefers-reduced-motion`.
