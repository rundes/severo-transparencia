// Catálogos seedeados.
//
// HALLAZGO CRÍTICO (verificado contra el API): `categoriaId` NO es global.
//   - A nivel NACIONAL (sin distritoId): categoriaId 1=Presidente, 2=Senadores Nac,
//     3=Diputados Nac. Confiable y abierto.
//   - Al filtrar por distritoId, el mismo categoriaId apunta a CARGOS LOCALES de esa
//     provincia (ej: distrito "02" con categoriaId 1 devuelve ~455k electores, no los
//     ~13M de Buenos Aires presidencial). El mapeo cargo↔distrito correcto vive en
//     `getMenu` (requiere DINE_BEARER_TOKEN). Hasta tener token, usar scope NACIONAL.
//
// Mapeo de distritos = autoritativo, extraído del GeoJSON oficial del frontend DINE
// (propiedad ID_INDRA). IDs zero-padded como los usa el API.

export const TIPOS_ELECCION = [
  { id: "1", nombre: "PASO" },
  { id: "2", nombre: "Generales" },
  { id: "3", nombre: "Balotaje" },
] as const;

// Cargos nacionales confirmados (válidos en scope nacional, sin distritoId).
export const CARGOS_NACIONALES = [
  { categoriaId: 1, nombre: "Presidente y Vicepresidente" },
  { categoriaId: 2, nombre: "Senadores Nacionales" },
  { categoriaId: 3, nombre: "Diputados Nacionales" },
] as const;

// Años con datos en el API (recuento provisorio publicado desde 2011).
export const ANIOS_DISPONIBLES = ["2011", "2013", "2015", "2017", "2019", "2021", "2023"] as const;

// Distritos (provincias). id = ID_INDRA oficial (zero-padded). Mapeo autoritativo.
export const DISTRITOS: { id: string; nombre: string }[] = [
  { id: "01", nombre: "Ciudad Autónoma de Buenos Aires" },
  { id: "02", nombre: "Buenos Aires" },
  { id: "03", nombre: "Catamarca" },
  { id: "04", nombre: "Córdoba" },
  { id: "05", nombre: "Corrientes" },
  { id: "06", nombre: "Chaco" },
  { id: "07", nombre: "Chubut" },
  { id: "08", nombre: "Entre Ríos" },
  { id: "09", nombre: "Formosa" },
  { id: "10", nombre: "Jujuy" },
  { id: "11", nombre: "La Pampa" },
  { id: "12", nombre: "La Rioja" },
  { id: "13", nombre: "Mendoza" },
  { id: "14", nombre: "Misiones" },
  { id: "15", nombre: "Neuquén" },
  { id: "16", nombre: "Río Negro" },
  { id: "17", nombre: "Salta" },
  { id: "18", nombre: "San Juan" },
  { id: "19", nombre: "San Luis" },
  { id: "20", nombre: "Santa Cruz" },
  { id: "21", nombre: "Santa Fe" },
  { id: "22", nombre: "Santiago del Estero" },
  { id: "23", nombre: "Tucumán" },
  { id: "24", nombre: "Tierra del Fuego, Antártida e Islas del Atlántico Sur" },
];
