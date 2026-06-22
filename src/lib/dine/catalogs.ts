// Catálogos seedeados. El árbol completo vive en getMenu (requiere Bearer token);
// mientras tanto seedeamos lo estable y derivamos agrupaciones de getResultados.
// Reconciliar contra getMenu cuando haya token (DINE_BEARER_TOKEN).

export const TIPOS_ELECCION = [
  { id: "1", nombre: "PASO" },
  { id: "2", nombre: "Generales" },
  { id: "3", nombre: "Balotaje" },
] as const;

// Cargos nacionales confirmados. Provinciales (Gobernador, Intendente, etc.)
// varían por distrito/año — descubrir vía getMenu.
export const CARGOS_NACIONALES = [
  { categoriaId: 1, nombre: "Presidente y Vicepresidente" },
  { categoriaId: 2, nombre: "Senadores Nacionales" },
  { categoriaId: 3, nombre: "Diputados Nacionales" },
] as const;

// Años con datos en el API (recuento provisorio publicado desde 2011).
export const ANIOS_DISPONIBLES = ["2011", "2013", "2015", "2017", "2019", "2021", "2023"] as const;

// Distritos (provincias). IDs DINE como string. Nombres seedeados;
// el mapa exacto id→nombre se confirma contra getMenu.
export const DISTRITOS: { id: string; nombre: string }[] = [
  { id: "1", nombre: "Ciudad Autónoma de Buenos Aires" },
  { id: "2", nombre: "Buenos Aires" },
  { id: "3", nombre: "Catamarca" },
  { id: "4", nombre: "Córdoba" },
  { id: "5", nombre: "Corrientes" },
  { id: "6", nombre: "Chaco" },
  { id: "7", nombre: "Chubut" },
  { id: "8", nombre: "Entre Ríos" },
  { id: "9", nombre: "Formosa" },
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
  { id: "23", nombre: "Tierra del Fuego" },
  { id: "24", nombre: "Tucumán" },
];
