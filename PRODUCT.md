# Product

## Register

product

## Users

Dos públicos atendidos por igual:

- **Ciudadanía general** que quiere entender, sin formación electoral, quién ganó y por cuánto. Llega de un link, a veces desde el teléfono, con poca paciencia. Necesita una capa simple por encima: preguntar en lenguaje natural, ver un resultado claro, un mapa legible.
- **Periodistas y analistas** que necesitan el dato rápido, comparable y citable. Llegan a verificar una cifra, comparar años, generar un informe, exportarlo. Toleran y valoran la densidad si está bien ordenada.

El producto sirve ambos: simple en la superficie, con profundidad disponible (drill por sección/circuito, BigQuery, informes IA).

## Product Purpose

Visualizar resultados electorales argentinos de forma abierta y fácil, sobre la API pública de la DINE (Ministerio del Interior), más una capa de IA (Claude API) para preguntar a los datos en lenguaje natural y generar informes más complejos que los estandarizados. El éxito es que cualquiera, ciudadano o periodista, obtenga una respuesta confiable y la fuente, sin fricción y sin sospecha de sesgo.

## Brand Personality

Confiable, sobrio, periodístico. Tono de página de datos de un buen diario, no de app de startup ni de portal de gobierno. Tres palabras: **riguroso, abierto, legible**. La interfaz debe transmitir neutralidad: el lector tiene que sentir que los números no están tomando partido.

## Anti-references

- **Dashboard SaaS genérico**: sidebar + cards idénticas + hero-metric gigante + gradientes. Es exactamente lo que tenía la versión anterior. Prohibido.
- **Sitio gubernamental burocrático**: argentina.gob.ar, tablas pesadas sin jerarquía, gris institucional, ilegible. Evitar.
- **Estética partidaria o militante**: ningún color de la paleta puede leerse como el de un partido. Las barras usan el color oficial que la DINE asigna a cada agrupación; el cromo de la app es deliberadamente no-partidario.

## Design Principles

1. **El número manda.** Los datos y las barras son los protagonistas; el cromo se aparta. Jerarquía editorial, no decorativa.
2. **Neutralidad visible.** Acento único no-partidario, paleta sobria. Que se lea imparcial sin tener que decirlo.
3. **Simple arriba, profundo abajo.** El ciudadano resuelve en un gesto (preguntar/elegir); el analista puede bajar a sección, circuito, SQL e informe sin que la app cambie de carácter.
4. **Mostrar la fuente, siempre.** Cada vista cita de dónde viene el dato (DINE en vivo, recuento provisorio). La confianza se gana con procedencia.
5. **Densidad ordenada, no ruido.** Reglas finas y ritmo tipográfico antes que cajas y sombras. Consistencia pantalla a pantalla como afordancia.

## Accessibility & Inclusion

- Objetivo WCAG AA: contraste de texto e interactivos sobre el papel cálido verificado.
- No comunicar nunca solo por color: las agrupaciones llevan etiqueta y valor además del color; el mapa tiene leyenda textual y tooltip.
- Respetar `prefers-reduced-motion`: las animaciones de barras y revelado se desactivan.
- Foco visible con anillo de acento en todos los controles. Targets táctiles cómodos para uso en teléfono.
