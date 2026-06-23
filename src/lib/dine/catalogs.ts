// Catálogos para la UI y la IA. El árbol completo y autoritativo se obtiene en vivo
// del endpoint `menu` (ver v2-client.ts); esto son constantes de apoyo.
//
// Endpoints correctos (abiertos, sin token): menu / menu/periodos / resultado/totalizado.
// idDistrito: 0 = ARGENTINA (nacional), 1..24 = provincias (mismo orden que ID_INDRA).
// idCargo verificado por elección vía el árbol `menu`.

export const TIPOS_ELECCION = [
  { id: "1", nombre: "PASO" },
  { id: "2", nombre: "Generales" },
  { id: "3", nombre: "Balotaje" },
] as const;

// Cargos (IdCargo) tal como los devuelve el árbol `menu`. 1-3 nacionales; 4-10 prov/locales.
export const CARGOS = [
  { idCargo: 1, nombre: "Presidente/a" },
  { idCargo: 2, nombre: "Senadores/as Nacionales" },
  { idCargo: 3, nombre: "Diputados/as Nacionales" },
  { idCargo: 4, nombre: "Gobernador/a - Jefe/a de Gobierno" },
  { idCargo: 5, nombre: "Senadores/as Provinciales" },
  { idCargo: 6, nombre: "Diputados/as Provinciales / de la Ciudad" },
  { idCargo: 7, nombre: "Intendente/a" },
  { idCargo: 8, nombre: "Parlamento Mercosur Nacional" },
  { idCargo: 9, nombre: "Parlamento Mercosur Regional" },
  { idCargo: 10, nombre: "Concejal/a - Junta" },
] as const;

// Cargos nacionales (válidos con idDistrito=0).
export const CARGOS_NACIONALES = CARGOS.slice(0, 3);

export const ANIOS_DISPONIBLES = ["2011", "2013", "2015", "2017", "2019", "2021", "2023"] as const;

// Distritos por IdDistrito numérico (totalizado). 0 = nacional.
export const DISTRITOS: { id: number; nombre: string }[] = [
  { id: 0, nombre: "Argentina (nacional)" },
  { id: 1, nombre: "Ciudad Autónoma de Buenos Aires" },
  { id: 2, nombre: "Buenos Aires" },
  { id: 3, nombre: "Catamarca" },
  { id: 4, nombre: "Córdoba" },
  { id: 5, nombre: "Corrientes" },
  { id: 6, nombre: "Chaco" },
  { id: 7, nombre: "Chubut" },
  { id: 8, nombre: "Entre Ríos" },
  { id: 9, nombre: "Formosa" },
  { id: 10, nombre: "Jujuy" },
  { id: 11, nombre: "La Pampa" },
  { id: 12, nombre: "La Rioja" },
  { id: 13, nombre: "Mendoza" },
  { id: 14, nombre: "Misiones" },
  { id: 15, nombre: "Neuquén" },
  { id: 16, nombre: "Río Negro" },
  { id: 17, nombre: "Salta" },
  { id: 18, nombre: "San Juan" },
  { id: 19, nombre: "San Luis" },
  { id: 20, nombre: "Santa Cruz" },
  { id: 21, nombre: "Santa Fe" },
  { id: 22, nombre: "Santiago del Estero" },
  { id: 23, nombre: "Tucumán" },
  { id: 24, nombre: "Tierra del Fuego" },
];
