# Estrategia: mapeo del sistema electoral (Nación + 24 provincias)

Fecha: 2026-06-29

## Objetivo

Ficha estructurada por jurisdicción (Nación + 24 distritos) para entender el
sistema electoral: marco normativo vigente, desdoblamiento (de jure y de facto),
sistema electoral y de alianzas, instrumento de votación, proveedores de
recuento/logística, y financiamiento de partidos y campañas. Cada campo con
**cita de fuente** y **fecha de corte de vigencia**.

Principio rector: separar **de jure** (qué dice la norma) de **de facto** (qué
pasó). El desdoblamiento es el caso típico — la norma permite/obliga/prohíbe,
pero la decisión la toma el ejecutivo cada elección.

## Schema (por jurisdicción)

```jsonc
{
  "jurisdiccion": "Santa Fe",
  "marcoNormativo": {
    "constitucionArts": "arts. … (o null)",
    "leyElectoral": { "nombre": "", "numero": "", "anioUltimaReforma": "", "url": "" },
    "leyPartidos": { "existe": true, "numero": "", "url": "" }
  },
  "desdoblamiento": {
    "regimen": "obliga_concurrencia | permite_desdoblar | prohibe_desdoblar | sin_norma_clara",
    "quienDecideFecha": "ejecutivo_provincial | fija_por_ley | otro",
    "fuenteUrl": "", "nota": "",
    "ultimas4": [
      { "anio": 2025, "modalidad": "concurrente | desdoblada | no_hubo", "fecha": "", "fuenteUrl": "" },
      { "anio": 2023, "modalidad": "", "fecha": "", "fuenteUrl": "" },
      { "anio": 2021, "modalidad": "", "fecha": "", "fuenteUrl": "" },
      { "anio": 2019, "modalidad": "", "fecha": "", "fuenteUrl": "" }
    ]
  },
  "sistemaElectoral": {
    "gobernador": "mayoria_simple | doble_vuelta | no_aplica",
    "legislatura": "dhondt | otro (describir) + umbral si hay",
    "primarias": "paso | sin_paso",
    "alianzas": "ley_de_lemas | colectoras | acoples | estandar | otro",
    "fuenteUrl": "", "nota": ""
  },
  "instrumentoVotacion": {
    "tipo": "boleta_partidaria | bup | bue | mixto",
    "anioAdopcion": "", "fuenteUrl": "", "nota": ""
  },
  "tecnologiaProveedores": {
    "escrutinioProvisorioProveedor": "", "logistica": "", "contratante": "",
    "escrutinioDefinitivo": "", "confianza": "alta | media | baja", "fuenteUrl": ""
  },
  "financiamiento": {
    "leyFinanciamientoPartidos": { "existe": true, "numero": "", "url": "" },
    "campanias": { "topeGasto": "", "aportePublico": "", "organoControl": "", "url": "" },
    "nota": ""
  },
  "confianzaGlobal": "alta | media | baja",
  "fechaCorte": "2026-06",
  "notas": ""
}
```

## Reglas

- Cada afirmación con URL verificada (WebFetch). Lo no hallado → `null` + nota.
  Nunca rellenar de memoria.
- Enums fijos arriba; terminología provincial dispar va en `nota`.
- `fechaCorte` obligatoria.

## Ejecución

- Fan-out en paralelo, ~4 jurisdicciones por agente (7 grupos).
- Verificación adversarial posterior de campos sensibles (desdoblamiento,
  Ley de Lemas, proveedor).

## Integración

- `src/lib/electoral/regimenes.ts`: dataset tipado + enums.
- Sección en `/datos` + mapas temáticos (instrumento, desdoblamiento) reusando
  `Choropleth`. Tool del AI para consultas en lenguaje natural.
