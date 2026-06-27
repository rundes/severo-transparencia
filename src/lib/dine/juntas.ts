// Organismos electorales oficiales: la Justicia Nacional Electoral (CNE) y las 24
// autoridades electorales provinciales (juntas / tribunales / juzgados electorales).
// URLs verificadas por investigación web (WebFetch) en junio 2026. Para varias
// provincias el escrutinio provisorio en vivo se publica en dominios temporales del
// Ejecutivo provincial, distintos por elección; aquí listamos solo las fuentes
// institucionales permanentes y, cuando existe, la página estable de resultados.

export interface FuenteElectoral {
  /** Jurisdicción, en orden de distrito DINE (1..24). Nacional va aparte. */
  jurisdiccion: string;
  organismo: string;
  /** Sitio institucional oficial. */
  sitio: string;
  /** Página estable de publicación de resultados, si es distinta del sitio. */
  resultados?: string;
  /** Caveat técnico (p. ej. certificado TLS) o aclaración de procedencia. */
  nota?: string;
}

/** Justicia Nacional Electoral — Consulta de Escrutinio Definitivo (resultados nacionales). */
export const FUENTE_NACIONAL: FuenteElectoral = {
  jurisdiccion: "Nacional",
  organismo: "Justicia Nacional Electoral (CNE)",
  sitio: "https://www.padron.gob.ar/publica/",
  nota: "Consulta de Escrutinio Definitivo por mesa, zona y cargo. Datos a efecto estadístico, sin valor legal (las Actas de los Juzgados Electorales son el documento válido).",
};

/** Autoridades electorales provinciales, en orden de distrito DINE (1..24). */
export const JUNTAS_PROVINCIALES: FuenteElectoral[] = [
  {
    jurisdiccion: "Ciudad Autónoma de Buenos Aires",
    organismo: "Tribunal Electoral de la CABA",
    sitio: "https://electoralcaba.gob.ar/",
    resultados: "https://resultados.electoralcaba.gob.ar/",
  },
  {
    jurisdiccion: "Buenos Aires",
    organismo: "Junta Electoral de la Provincia de Buenos Aires",
    sitio: "https://www.juntaelectoral.gba.gov.ar/",
    resultados: "https://www.juntaelectoral.gba.gov.ar/escrutinio-definitivo-2025/",
  },
  {
    jurisdiccion: "Catamarca",
    organismo: "Tribunal Electoral de la Provincia de Catamarca",
    sitio: "https://www.juscatamarca.gob.ar/",
    nota: "Funciona dentro del Poder Judicial provincial; sin portal propio de resultados.",
  },
  {
    jurisdiccion: "Córdoba",
    organismo: "Junta Electoral / Fuero Electoral de Córdoba",
    sitio: "https://www.justiciacordoba.gob.ar/jel/",
    resultados: "https://www.justiciacordoba.gob.ar/jel/Contenido/escrutinios.aspx",
  },
  {
    jurisdiccion: "Corrientes",
    organismo: "Junta Electoral de la Provincia de Corrientes",
    sitio: "https://www.juscorrientes.gov.ar/junta-electoral/",
    nota: "Recuento provisorio por elección en dominios del Ejecutivo provincial.",
  },
  {
    jurisdiccion: "Chaco",
    organismo: "Tribunal Electoral de la Provincia del Chaco",
    sitio: "https://electoralchaco.gob.ar/",
    resultados: "https://resultados.chaco.gob.ar/",
    nota: "El sitio institucional presentó un error de certificado TLS al verificar; el portal de resultados es válido.",
  },
  {
    jurisdiccion: "Chubut",
    organismo: "Tribunal Electoral Provincial del Chubut",
    sitio: "https://electoralchubut.gob.ar/",
    resultados: "https://datosoficiales.juschubut.gov.ar/",
  },
  {
    jurisdiccion: "Entre Ríos",
    organismo: "Tribunal Electoral de la Provincia de Entre Ríos",
    sitio: "https://www.tribunalelectoraler.gob.ar/",
    resultados: "https://tribunalelectoraler.gob.ar/sistema-de-elecciones",
  },
  {
    jurisdiccion: "Formosa",
    organismo: "Tribunal Electoral Permanente de Formosa",
    sitio: "https://tep.jusformosa.gob.ar/",
    resultados: "https://tep.jusformosa.gob.ar/resultados",
  },
  {
    jurisdiccion: "Jujuy",
    organismo: "Tribunal Electoral de la Provincia de Jujuy",
    sitio: "https://electoraljujuy.gob.ar/",
    nota: "Escrutinios definitivos publicados dentro del propio sitio.",
  },
  {
    jurisdiccion: "La Pampa",
    organismo: "Tribunal Electoral de la Provincia de La Pampa",
    sitio: "https://trielectorallapampa.gob.ar/",
    nota: "Resultados por año (desde 1963) dentro del propio sitio.",
  },
  {
    jurisdiccion: "La Rioja",
    organismo: "Tribunal Electoral Provincial de La Rioja",
    sitio: "https://justicialarioja.gob.ar/index.php/tribunal-electoral-menu",
    nota: "Sección del Poder Judicial provincial; sin portal propio de resultados.",
  },
  {
    jurisdiccion: "Mendoza",
    organismo: "Junta Electoral de Mendoza",
    sitio: "https://jusmendoza.gob.ar/junta-electoral-de-mendoza/",
    resultados: "https://jusmendoza.gob.ar/escrutinios-definitivos-elecciones-generales-de-mendoza/",
  },
  {
    jurisdiccion: "Misiones",
    organismo: "Tribunal Electoral de la Provincia de Misiones",
    sitio: "https://www.electoralmisiones.gov.ar/",
    resultados: "https://www.electoralmisiones.gov.ar/elecciones-legislativas-provinciales-2025-resultados-del-escrutinio-definitivo/",
  },
  {
    jurisdiccion: "Neuquén",
    organismo: "Junta / Juzgado Electoral Provincial de Neuquén",
    sitio: "https://www.jusneuquen.gov.ar/elecciones/",
    nota: "Dentro del Poder Judicial provincial; escrutinios definitivos por elección.",
  },
  {
    jurisdiccion: "Río Negro",
    organismo: "Tribunal Electoral de la Provincia de Río Negro",
    sitio: "https://www.jusrionegro.gov.ar/web/institucional/tribunal-electoral/elecciones.php",
    nota: "Dentro del Poder Judicial provincial; microsites de escrutinio por elección.",
  },
  {
    jurisdiccion: "Salta",
    organismo: "Tribunal Electoral de la Provincia de Salta",
    sitio: "https://www.electoralsalta.gob.ar/",
    resultados: "https://www.electoralsalta.gob.ar/elecciones/generales/escrutinio-definitivo",
  },
  {
    jurisdiccion: "San Juan",
    organismo: "Tribunal Electoral de la Provincia de San Juan",
    sitio: "https://www.jussanjuan.gov.ar/tribunal-electoral/",
    nota: "Dentro del Poder Judicial provincial; sin portal permanente de resultados.",
  },
  {
    jurisdiccion: "San Luis",
    organismo: "Tribunal Electoral de la Provincia de San Luis",
    sitio: "https://electoral.justiciasanluis.gov.ar/",
    nota: "Escrutinios y cómputos definitivos dentro del propio sitio.",
  },
  {
    jurisdiccion: "Santa Cruz",
    organismo: "Tribunal Superior de Justicia — Secretaría Electoral Permanente",
    sitio: "https://www.jussantacruz.gob.ar/",
    nota: "Santa Cruz no tiene tribunal electoral autónomo; la competencia recae en el TSJ.",
  },
  {
    jurisdiccion: "Santa Fe",
    organismo: "Tribunal Electoral de la Provincia de Santa Fe",
    sitio: "https://www.santafe.gob.ar/ms/tribunalelectoral/elecciones/",
    nota: "Repositorio de escrutinios definitivos 2013–2025 dentro del propio sitio.",
  },
  {
    jurisdiccion: "Santiago del Estero",
    organismo: "Tribunal Electoral de la Provincia de Santiago del Estero",
    sitio: "http://www.tribunalelectoralse.gov.ar/",
    nota: "Solo disponible por HTTP (desajuste de certificado TLS en HTTPS).",
  },
  {
    jurisdiccion: "Tucumán",
    organismo: "Junta Electoral de la Provincia de Tucumán",
    sitio: "https://electoraltucuman.gob.ar/",
    nota: "Resultados de generales por ciclo (2003–2023) dentro del propio sitio.",
  },
  {
    jurisdiccion: "Tierra del Fuego",
    organismo: "Juzgado Electoral de Tierra del Fuego (STJ)",
    sitio: "https://eleccionestdf.justierradelfuego.gov.ar/",
    resultados: "https://resultados.justierradelfuego.gov.ar/",
  },
];
