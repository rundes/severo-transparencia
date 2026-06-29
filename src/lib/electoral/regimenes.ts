// Régimen electoral por jurisdicción (Nación + 24 distritos).
// Fuente: investigación web verificada (WebFetch), corte 2026-06. Cada campo
// con cita y nivel de confianza. Para varias provincias el escrutinio provisorio
// en vivo se publica en dominios temporales del Ejecutivo; aquí solo lo permanente.
// Spec: docs/superpowers/specs/2026-06-29-mapeo-sistema-electoral-strategy.md

export type RegimenDesdoblamiento =
  | "obliga_concurrencia"
  | "permite_desdoblar"
  | "obliga_desdoblar"
  | "prohibe_desdoblar"
  | "sin_norma_clara"
  | "no_aplica";

export type ModalidadEleccion = "concurrente" | "desdoblada" | "no_hubo";
export type FormulaGobernador = "mayoria_simple" | "doble_vuelta" | "no_aplica";
export type RegimenPrimarias = "paso" | "sin_paso";
export type RegimenAlianzas = "ley_de_lemas" | "colectoras" | "acoples" | "estandar" | "otro";
export type Instrumento = "boleta_partidaria" | "bup" | "bue" | "mixto";
export type Camaras = "unicameral" | "bicameral";
export type Renovacion = "total_4" | "parcial_2";
export type VotoJoven = "si" | "no" | "solo_nacional" | "sin_dato";
export type Confianza = "alta" | "media" | "baja";

export interface DesdoblamientoAnio {
  anio: number;
  modalidad: ModalidadEleccion;
  fecha?: string;
}

export const LABELS = {
  gobernador: { mayoria_simple: "Mayoría simple", doble_vuelta: "Doble vuelta", no_aplica: "—" } as Record<string, string>,
  instrumento: { boleta_partidaria: "Boleta partidaria", bup: "Boleta Única Papel", bue: "Boleta Única Electrónica", mixto: "Mixto" } as Record<string, string>,
  alianzas: { ley_de_lemas: "Ley de Lemas", colectoras: "Colectoras", acoples: "Acoples", estandar: "Estándar", otro: "Otro" } as Record<string, string>,
  desdoblamiento: { obliga_concurrencia: "Obliga concurrir", permite_desdoblar: "Permite desdoblar", obliga_desdoblar: "Obliga desdoblar", prohibe_desdoblar: "Prohíbe desdoblar", sin_norma_clara: "Sin norma clara", no_aplica: "—" } as Record<string, string>,
  modalidad: { concurrente: "Concurrente", desdoblada: "Desdoblada", no_hubo: "—" } as Record<string, string>,
  camaras: { unicameral: "Unicameral", bicameral: "Bicameral" } as Record<string, string>,
  renovacion: { total_4: "Total, cada 4 años", parcial_2: "Parcial, cada 2 años" } as Record<string, string>,
  votoJoven: { si: "Sí (16-17)", no: "No", solo_nacional: "Solo en la nacional", sin_dato: "Sin dato" } as Record<string, string>,
};

export interface Fuente {
  campo: string;
  url: string;
}

export interface RegimenElectoral {
  jurisdiccion: string;
  /** Citas por campo (ley, desdoblamiento, sistema, instrumento, proveedores, financiamiento). */
  fuentes?: Fuente[];
  camaras?: Camaras;
  renovacion?: Renovacion;
  votoJoven?: VotoJoven;
  organismo?: string;
  leyElectoral: string;
  leyElectoralUrl?: string;
  desdoblamiento: {
    regimen: RegimenDesdoblamiento;
    nota?: string;
    ultimas4: DesdoblamientoAnio[];
  };
  gobernador: FormulaGobernador;
  legislatura: string;
  primarias: RegimenPrimarias;
  alianzas: RegimenAlianzas;
  instrumento: Instrumento;
  instrumentoAnio?: string;
  proveedorRecuento?: string;
  financiamientoCampanias?: string;
  confianza: Confianza;
  nota?: string;
}

export const REGIMENES: RegimenElectoral[] = [
  {
    jurisdiccion: "Nación",
    organismo: "Justicia Nacional Electoral (CNE)",
    leyElectoral: "Código Electoral Nacional 19.945",
    leyElectoralUrl: "https://www.argentina.gob.ar/normativa/nacional/ley-19945-19442/actualizacion",
    desdoblamiento: {
      regimen: "no_aplica",
      nota: "Referencia federal: las provincias adelantan o no respecto de la nacional. Fecha por decreto del PEN dentro de plazos constitucionales.",
      ultimas4: [
        { anio: 2025, modalidad: "concurrente", fecha: "2025-10-26" },
        { anio: 2023, modalidad: "concurrente", fecha: "2023-10-22" },
        { anio: 2021, modalidad: "concurrente", fecha: "2021-11-14" },
        { anio: 2019, modalidad: "concurrente", fecha: "2019-10-27" },
      ],
    },
    gobernador: "doble_vuelta",
    legislatura: "Bicameral. Diputados (257): D'Hondt por distrito, piso 3%, renovación por mitades. Senado (72): 3 por distrito (2 mayoría + 1 primera minoría), renovación por tercios.",
    primarias: "paso",
    alianzas: "estandar",
    instrumento: "bup",
    instrumentoAnio: "2024",
    proveedorRecuento: "Escrutinio provisorio: Indra (histórico desde 1997). Logística: Correo Argentino. Definitivo: Justicia Nacional Electoral.",
    financiamientoCampanias: "Ley 26.215 (ref. 27.504). Tope ~$1,50 por elector; Fondo Partidario Permanente (20% igualitario / 80% por votos). Control: Justicia Nacional Electoral.",
    confianza: "alta",
    nota: "Ejecutivo = Presidente/Vice (régimen presidencial, ballotage 45 / 40-10). De facto 2025: PASO suspendidas (Ley 27.783) y primera elección nacional con BUP (Ley 27.781).",
  },
  {
    jurisdiccion: "Ciudad Autónoma de Buenos Aires",
    organismo: "Tribunal Electoral de la CABA",
    leyElectoral: "Código Electoral CABA 6031",
    leyElectoralUrl: "http://www2.cedom.gob.ar/es/legislacion/normas/leyes/ley6031.html",
    desdoblamiento: {
      regimen: "permite_desdoblar",
      nota: "El Jefe de Gobierno convoca por decreto; en 2025 Jorge Macri desdobló, 2019/2021/2023 concurrentes.",
      ultimas4: [
        { anio: 2025, modalidad: "desdoblada", fecha: "2025-05-18" },
        { anio: 2023, modalidad: "concurrente", fecha: "2023-10-22" },
        { anio: 2021, modalidad: "concurrente", fecha: "2021-11-14" },
        { anio: 2019, modalidad: "concurrente", fecha: "2019-10-27" },
      ],
    },
    gobernador: "doble_vuelta",
    legislatura: "Unicameral, 60 diputados, D'Hondt en distrito único, renovación por mitades.",
    primarias: "paso",
    alianzas: "estandar",
    instrumento: "bue",
    instrumentoAnio: "2015",
    proveedorRecuento: "BUE: Magic Software Argentina (MSA, vot.ar). Administra: Instituto de Gestión Electoral (IGE).",
    financiamientoCampanias: "Ley 268: tope 1,40 U.F. por elector/categoría; aporte público por padrón; control IGE + Tribunal Electoral. Rige ley nacional de partidos 23.298.",
    confianza: "alta",
    nota: "Jefe de Gobierno por mayoría absoluta con ballotage. PASO locales eliminadas/suspendidas para 2025.",
  },
  {
    jurisdiccion: "Buenos Aires",
    organismo: "Junta Electoral de la Provincia de Buenos Aires",
    leyElectoral: "Ley Electoral 5109",
    leyElectoralUrl: "https://www.juntaelectoral.gba.gov.ar/docs/LEY5109.pdf",
    desdoblamiento: {
      regimen: "permite_desdoblar",
      nota: "Fecha por decreto del Gobernador. En 2025 Kicillof desdobló por primera vez en mucho tiempo (Decreto 639/2025); 2019/2021/2023 concurrentes.",
      ultimas4: [
        { anio: 2025, modalidad: "desdoblada", fecha: "2025-09-07" },
        { anio: 2023, modalidad: "concurrente", fecha: "2023-10-22" },
        { anio: 2021, modalidad: "concurrente", fecha: "2021-11-14" },
        { anio: 2019, modalidad: "concurrente", fecha: "2019-10-27" },
      ],
    },
    gobernador: "mayoria_simple",
    legislatura: "Bicameral: 92 diputados y 46 senadores, RP, renovación por mitades, en 8 secciones electorales.",
    primarias: "paso",
    alianzas: "estandar",
    instrumento: "boleta_partidaria",
    proveedorRecuento: "Provisorio: Ministerio de Gobierno provincial. Logística: Correo Argentino. Definitivo: Junta Electoral.",
    financiamientoCampanias: "Sin ley integral; reglas dispersas en Decreto-Ley 9889/1982 (Fondo Partidario) y Ley 14086. Control: Junta Electoral.",
    confianza: "media",
    nota: "Gobernador por simple mayoría sin ballotage. PASO suspendidas (Ley 15522) y colectoras prohibidas. Mantiene boleta partidaria (no adoptó BUP).",
  },
  {
    jurisdiccion: "Catamarca",
    organismo: "Tribunal Electoral de la Provincia de Catamarca",
    leyElectoral: "Ley Electoral (Decreto Ley 4628)",
    leyElectoralUrl: "https://www.joseperezcorti.com.ar/Archivos/Legislacion/Provincial/Catamarca/L4628_Ley_Electoral_Provincial_Catamarca.pdf",
    desdoblamiento: {
      regimen: "obliga_concurrencia",
      nota: "Const. art. 90/144: cuando hay comicios nacionales, la renovación provincial es simultánea. Concurrencia ininterrumpida desde al menos 2011.",
      ultimas4: [
        { anio: 2025, modalidad: "concurrente", fecha: "2025-10-26" },
        { anio: 2023, modalidad: "concurrente", fecha: "2023-10-22" },
        { anio: 2021, modalidad: "concurrente", fecha: "2021-11-14" },
        { anio: 2019, modalidad: "concurrente", fecha: "2019-10-27" },
      ],
    },
    gobernador: "mayoria_simple",
    legislatura: "Bicameral: Diputados (RP D'Hondt, distrito único) y Senado (uno por departamento, simple pluralidad). Renovación por mitades.",
    primarias: "paso",
    alianzas: "estandar",
    instrumento: "boleta_partidaria",
    financiamientoCampanias: "Sin ley autónoma; reglas en Dec. Ley 3894 (partidos) y 4628. Sin tope de gasto regulado (OEAR-CIPPEC).",
    confianza: "media",
    nota: "Gobernador por simple pluralidad. PASO suspendidas en 2025 (Ley 5900). Boleta partidaria provincial.",
  },
  {
    jurisdiccion: "Córdoba",
    organismo: "Junta Electoral / Fuero Electoral de Córdoba",
    leyElectoral: "Código Electoral Provincial 9571",
    leyElectoralUrl: "https://www.justiciacordoba.gob.ar/Estatico/JEL/Contenido/Legislacion/files/Electoral/L.9571.pdf",
    desdoblamiento: {
      regimen: "permite_desdoblar",
      nota: "Desdobla históricamente; fecha por decreto del PE provincial. Sin elección provincial de medio término (2021, 2025).",
      ultimas4: [
        { anio: 2025, modalidad: "no_hubo" },
        { anio: 2023, modalidad: "desdoblada", fecha: "2023-06-25" },
        { anio: 2021, modalidad: "no_hubo" },
        { anio: 2019, modalidad: "desdoblada", fecha: "2019-05-12" },
      ],
    },
    gobernador: "mayoria_simple",
    legislatura: "Unicameral, 70: 44 por distrito único (D'Hondt) + 26 uninominales por departamento.",
    primarias: "sin_paso",
    alianzas: "estandar",
    instrumento: "bup",
    instrumentoAnio: "2011",
    proveedorRecuento: "Provisorio 2023: OCASA (sistema Turing). Definitivo: Justicia Electoral provincial.",
    financiamientoCampanias: "Ley 9572: tope 2‰ del SMVM por elector; aporte público 2‰ del SMVM por voto. Control: Juzgado Electoral.",
    confianza: "alta",
    nota: "Pionera en Boleta Única ('BUS') desde 2011. Gobernador por simple pluralidad, sin PASO.",
  },
  {
    jurisdiccion: "Corrientes",
    organismo: "Junta Electoral de la Provincia de Corrientes",
    leyElectoral: "Código Electoral provincial (adopta el CEN; Decreto-Ley 135/2001)",
    leyElectoralUrl: "https://www.argentina.gob.ar/dine/normativa-electoral/corrientes",
    desdoblamiento: {
      regimen: "permite_desdoblar",
      nota: "Desdobla sistemáticamente desde los '90; fecha por decreto del Gobernador.",
      ultimas4: [
        { anio: 2025, modalidad: "desdoblada", fecha: "2025-08-31" },
        { anio: 2023, modalidad: "desdoblada", fecha: "2023-06-11" },
        { anio: 2021, modalidad: "desdoblada", fecha: "2021-08-29" },
        { anio: 2019, modalidad: "desdoblada", fecha: "2019-06-02" },
      ],
    },
    gobernador: "doble_vuelta",
    legislatura: "Bicameral: Diputados (30, renovación por mitades) y Senado (15, renovación por tercios), RP.",
    primarias: "sin_paso",
    alianzas: "acoples",
    instrumento: "boleta_partidaria",
    financiamientoCampanias: "Sin ley autónoma verificada; rige el Estatuto de Partidos (Ley 3.767). Control: Junta Electoral.",
    confianza: "media",
    nota: "Gobernador a doble vuelta (45 / 40-10). Acoples para legislativos/municipales; sin PASO. Boleta partidaria (decenas de boletas por cuarto oscuro).",
  },
  {
    jurisdiccion: "Chaco",
    organismo: "Tribunal Electoral de la Provincia del Chaco",
    leyElectoral: "Régimen Electoral 834-Q (ex 4.169)",
    leyElectoralUrl: "https://www.electoralchaco.gov.ar/images/leyesprovinciales/4169ahora834Q.pdf",
    desdoblamiento: {
      regimen: "permite_desdoblar",
      nota: "La Ley de PASO provincial fuerza no coincidir con las nacionales (tiende a desdoblar); en 2021 se unificó por ley especial (pandemia).",
      ultimas4: [
        { anio: 2025, modalidad: "desdoblada", fecha: "2025-05-11" },
        { anio: 2023, modalidad: "desdoblada", fecha: "2023-09-17" },
        { anio: 2021, modalidad: "concurrente", fecha: "2021-11-14" },
        { anio: 2019, modalidad: "desdoblada", fecha: "2019-10-13" },
      ],
    },
    gobernador: "doble_vuelta",
    legislatura: "Unicameral, 32 diputados, D'Hondt en distrito único, renovación por mitades.",
    primarias: "paso",
    alianzas: "estandar",
    instrumento: "boleta_partidaria",
    proveedorRecuento: "Definitivo: Tribunal Electoral provincial. (BUE solo pilotos 2015/2017 con MSA, no adoptada).",
    financiamientoCampanias: "Fondo Partidario Permanente provincial (Ley 3.401 art. 16); sin ley integral de campañas. Control: Tribunal Electoral.",
    confianza: "media",
    nota: "Gobernador con ballotage (45 / 40-10). Vota con boleta partidaria; PASO suspendidas en 2025.",
  },
  {
    jurisdiccion: "Chubut",
    organismo: "Tribunal Electoral Provincial del Chubut",
    leyElectoral: "Código Electoral XII Nº 21",
    leyElectoralUrl: "https://electoralchubut.gob.ar/wp-content/uploads/2025/08/LEY-XII-21.pdf",
    desdoblamiento: {
      regimen: "permite_desdoblar",
      nota: "Desdobla y adelanta tradicionalmente; fecha por decreto. Sin medio término provincial (2021, 2025).",
      ultimas4: [
        { anio: 2025, modalidad: "no_hubo" },
        { anio: 2023, modalidad: "desdoblada", fecha: "2023-07-30" },
        { anio: 2021, modalidad: "no_hubo" },
        { anio: 2019, modalidad: "desdoblada", fecha: "2019-06-09" },
      ],
    },
    gobernador: "mayoria_simple",
    legislatura: "Unicameral, 27 diputados, distrito único, mixto: 16 a la lista más votada + 11 por D'Hondt.",
    primarias: "sin_paso",
    alianzas: "estandar",
    instrumento: "bup",
    instrumentoAnio: "2024",
    proveedorRecuento: "Definitivo: Tribunal Electoral provincial (Secretaría Electoral Permanente).",
    financiamientoCampanias: "Reglas en el Código XII Nº 21 y Ley de Partidos XII Nº 23; montos no verificados.",
    confianza: "media",
    nota: "Nuevo Código (2024) adoptó BUP y eliminó PASO provinciales; primera aplicación provincial prevista 2027.",
  },
  {
    jurisdiccion: "Entre Ríos",
    organismo: "Tribunal Electoral de la Provincia de Entre Ríos",
    leyElectoral: "Código Electoral 11.190 (2025)",
    leyElectoralUrl: "https://www.tribunalelectoraler.gob.ar/",
    desdoblamiento: {
      regimen: "permite_desdoblar",
      nota: "Fecha por decreto del Gobernador; 2019 desdoblada, 2023 concurrente.",
      ultimas4: [
        { anio: 2025, modalidad: "no_hubo" },
        { anio: 2023, modalidad: "concurrente", fecha: "2023-10-22" },
        { anio: 2021, modalidad: "no_hubo" },
        { anio: 2019, modalidad: "desdoblada", fecha: "2019-06-09" },
      ],
    },
    gobernador: "mayoria_simple",
    legislatura: "Bicameral: Diputados (34, distrito único, RP con mayoría asegurada) y Senado (17, uno por departamento, simple pluralidad).",
    primarias: "paso",
    alianzas: "estandar",
    instrumento: "bup",
    instrumentoAnio: "2027",
    proveedorRecuento: "Definitivo: Tribunal Electoral provincial.",
    financiamientoCampanias: "Sin ley autónoma; rige Ley de Partidos 5.170 + Código 11.190 (supletoria nacional).",
    confianza: "media",
    nota: "Código Electoral 11.190 (2025) adopta BUP a regir desde 2027 y crea ente electoral provincial.",
  },
  {
    jurisdiccion: "Formosa",
    organismo: "Tribunal Electoral Permanente de Formosa",
    leyElectoral: "Régimen Electoral 152 / Ley de Lemas 653",
    leyElectoralUrl: "https://www.argentina.gob.ar/sites/default/files/02-ley_152_formosa.pdf",
    desdoblamiento: {
      regimen: "permite_desdoblar",
      nota: "Fecha por decreto del Gobernador; desdobla en la práctica reciente (2019, 2023, 2025).",
      ultimas4: [
        { anio: 2025, modalidad: "desdoblada", fecha: "2025-06-29" },
        { anio: 2023, modalidad: "desdoblada", fecha: "2023-06-25" },
        { anio: 2021, modalidad: "concurrente", fecha: "2021-11-14" },
        { anio: 2019, modalidad: "desdoblada", fecha: "2019-06-16" },
      ],
    },
    gobernador: "mayoria_simple",
    legislatura: "Unicameral (30 bancas, renovación por mitades). Ley de Lemas (Ley 653) para legislativos y municipales; gobernador exceptuado (Ley 1.570/2011).",
    primarias: "sin_paso",
    alianzas: "ley_de_lemas",
    instrumento: "boleta_partidaria",
    financiamientoCampanias: "Con regulación específica (CIPPEC); número de ley no verificado. Aporte público para campañas e impresión de boletas.",
    confianza: "media",
    nota: "Ley de Lemas/Sublemas vigente para legislatura y municipios. Reforma constitucional 2025 (post-fallo CSJN) limitó la reelección.",
  },
  {
    jurisdiccion: "Jujuy",
    organismo: "Tribunal Electoral de la Provincia de Jujuy",
    leyElectoral: "Código Electoral 4164",
    leyElectoralUrl: "https://electoraljujuy.gob.ar/",
    desdoblamiento: {
      regimen: "permite_desdoblar",
      nota: "Desdobla sistemáticamente; fecha por decreto del Gobernador.",
      ultimas4: [
        { anio: 2025, modalidad: "desdoblada", fecha: "2025-05-11" },
        { anio: 2023, modalidad: "desdoblada", fecha: "2023-05-07" },
        { anio: 2021, modalidad: "desdoblada", fecha: "2021-06-27" },
        { anio: 2019, modalidad: "desdoblada", fecha: "2019-06-09" },
      ],
    },
    gobernador: "mayoria_simple",
    legislatura: "Unicameral, 48 diputados, RP D'Hondt, distrito único, piso 5%, renovación por mitades.",
    primarias: "paso",
    alianzas: "estandar",
    instrumento: "boleta_partidaria",
    financiamientoCampanias: "Rige la Ley Orgánica de Partidos 3919 (rendición a 60 días). Sin ley específica de campañas.",
    confianza: "media",
    nota: "Ley 5522 prohíbe la Ley de Lemas y las adhesiones. Boleta partidaria provincial (BUP solo nacional 2025).",
  },
  {
    jurisdiccion: "La Pampa",
    organismo: "Tribunal Electoral de la Provincia de La Pampa",
    leyElectoral: "Ley Electoral 1593",
    leyElectoralUrl: "https://www.saij.gob.ar/1593-local-pampa-ley-electoral-provincial-lpl0000601-1994-12-01/123456789-0abc-defg-106-0000lvorpyel",
    desdoblamiento: {
      regimen: "permite_desdoblar",
      nota: "Fecha por decreto del Gobernador; desdobló 2019 y 2023. Sin medio término provincial (renovación total cada 4 años).",
      ultimas4: [
        { anio: 2025, modalidad: "no_hubo" },
        { anio: 2023, modalidad: "desdoblada", fecha: "2023-05-14" },
        { anio: 2021, modalidad: "no_hubo" },
        { anio: 2019, modalidad: "desdoblada", fecha: "2019-05-19" },
      ],
    },
    gobernador: "mayoria_simple",
    legislatura: "Unicameral, 30 diputados, renovación total cada 4 años, RP D'Hondt, umbral 3%.",
    primarias: "paso",
    alianzas: "estandar",
    instrumento: "boleta_partidaria",
    financiamientoCampanias: "Sin ley específica; reglas en Ley de Partidos 1.176 y Electoral 1.593. Aporte público sin topes ni auditoría (CIPPEC).",
    confianza: "media",
    nota: "Boleta partidaria provincial; PASO provinciales (Ley 2.042).",
  },
  {
    jurisdiccion: "La Rioja",
    organismo: "Tribunal Electoral Provincial de La Rioja",
    leyElectoral: "Ley Electoral 5139",
    leyElectoralUrl: "https://justicialarioja.gob.ar/legislacion/Ley%20Electoral%20Provincial%20-%20(Ley%205139%20-%20revisada%20al%2025-03-2015).pdf",
    desdoblamiento: {
      regimen: "permite_desdoblar",
      nota: "Fecha por decreto del Ejecutivo, caso por caso: desdobló 2023, concurrió 2019/2021/2025.",
      ultimas4: [
        { anio: 2025, modalidad: "concurrente", fecha: "2025-10-26" },
        { anio: 2023, modalidad: "desdoblada", fecha: "2023-05-07" },
        { anio: 2021, modalidad: "concurrente", fecha: "2021-11-14" },
        { anio: 2019, modalidad: "concurrente", fecha: "2019-10-27" },
      ],
    },
    gobernador: "mayoria_simple",
    legislatura: "Unicameral, 36 diputados, D'Hondt por departamentos, renovación por mitades.",
    primarias: "sin_paso",
    alianzas: "colectoras",
    instrumento: "boleta_partidaria",
    financiamientoCampanias: "Sin ley autónoma; reglas en Ley Electoral 5139 y Partidos 4887. Sin tope (CIPPEC).",
    confianza: "media",
    nota: "Ley de Lemas derogada en 2007. Admite colectoras/listas espejo. Boleta partidaria; en 2025 'doble urna' con BUP nacional.",
  },
  {
    jurisdiccion: "Mendoza",
    organismo: "Junta Electoral de Mendoza",
    leyElectoral: "Régimen Electoral 2551 / BUP Ley 9375",
    leyElectoralUrl: "https://www.jus.mendoza.gov.ar/documents/224179/238636/Ley+2551+-+Regimen+Electoral.pdf",
    desdoblamiento: {
      regimen: "permite_desdoblar",
      nota: "Fecha por decreto del Gobernador: 2019 y 2023 desdobladas, 2025 concurrente.",
      ultimas4: [
        { anio: 2025, modalidad: "concurrente", fecha: "2025-10-26" },
        { anio: 2023, modalidad: "desdoblada", fecha: "2023-09-24" },
        { anio: 2021, modalidad: "concurrente", fecha: "2021-11-14" },
        { anio: 2019, modalidad: "desdoblada", fecha: "2019-09-29" },
      ],
    },
    gobernador: "mayoria_simple",
    legislatura: "Bicameral: Diputados (48) y Senado (38), RP D'Hondt en 4 secciones, renovación por mitades.",
    primarias: "sin_paso",
    alianzas: "estandar",
    instrumento: "bup",
    instrumentoAnio: "2022",
    proveedorRecuento: "Definitivo: Junta Electoral (Poder Judicial).",
    financiamientoCampanias: "Ley 7005: tope por elector y crédito fiscal del 20%. Control: Junta Electoral.",
    confianza: "alta",
    nota: "Boleta Única de Sufragio (papel) desde 2022/2023. PASO suspendidas (no eliminadas) para 2025-2026 (Ley 9643).",
  },
  {
    jurisdiccion: "Misiones",
    organismo: "Tribunal Electoral de la Provincia de Misiones",
    leyElectoral: "Ley Electoral XI Nº 6",
    leyElectoralUrl: "https://www.electoralmisiones.gov.ar/wp-content/uploads/2021/01/LeyXI-N6TextoDefinitivo2020.pdf",
    desdoblamiento: {
      regimen: "permite_desdoblar",
      nota: "Desdobla y vota temprano (mayo/junio); partido provincial dominante.",
      ultimas4: [
        { anio: 2025, modalidad: "desdoblada", fecha: "2025-06-08" },
        { anio: 2023, modalidad: "desdoblada", fecha: "2023-05-07" },
        { anio: 2021, modalidad: "desdoblada", fecha: "2021-06-06" },
        { anio: 2019, modalidad: "desdoblada", fecha: "2019-06-02" },
      ],
    },
    gobernador: "mayoria_simple",
    legislatura: "Unicameral (Cámara de Representantes, 40 bancas), RP D'Hondt, distrito único, renovación por mitades.",
    primarias: "sin_paso",
    alianzas: "estandar",
    instrumento: "boleta_partidaria",
    financiamientoCampanias: "Sin ley específica verificada; reglas en Ley de Partidos XI Nº 7 y Electoral XI Nº 6.",
    confianza: "media",
    nota: "Boleta partidaria provincial. Ley de Lemas solo para municipales. Piloto de voto codificado (VoCoMi) en algunos municipios.",
  },
  {
    jurisdiccion: "Neuquén",
    organismo: "Junta / Juzgado Electoral Provincial de Neuquén",
    leyElectoral: "Ley de bases del sistema electoral 3053 (BUE)",
    leyElectoralUrl: "https://www.argentina.gob.ar/normativa/provincial/ley-3053-123456789-0abc-defg-350-3000qvorpyel",
    desdoblamiento: {
      regimen: "permite_desdoblar",
      nota: "Desdobla sistemáticamente (MPN); fecha por decreto. Sin medio término provincial (2021, 2025).",
      ultimas4: [
        { anio: 2025, modalidad: "no_hubo" },
        { anio: 2023, modalidad: "desdoblada", fecha: "2023-04-16" },
        { anio: 2021, modalidad: "no_hubo" },
        { anio: 2019, modalidad: "desdoblada", fecha: "2019-03-10" },
      ],
    },
    gobernador: "mayoria_simple",
    legislatura: "Unicameral, 35 diputados, RP D'Hondt en distrito único.",
    primarias: "sin_paso",
    alianzas: "estandar",
    instrumento: "bue",
    instrumentoAnio: "2016",
    proveedorRecuento: "BUE: Magic Software Argentina (MSA), único oferente. Definitivo: Justicia Electoral provincial.",
    financiamientoCampanias: "Ley 3053: aporte público 50% igualitario / 50% por votos; informe a 90 días. Sin tope verificado.",
    confianza: "media",
    nota: "Boleta Única Electrónica desde 2016 (estreno total 2019).",
  },
  {
    jurisdiccion: "Río Negro",
    organismo: "Tribunal Electoral de la Provincia de Río Negro",
    leyElectoral: "Código Electoral y de Partidos 2431",
    leyElectoralUrl: "https://www.jusrionegro.gov.ar/web/normativa/documentacion/LEY_O_2431.pdf",
    desdoblamiento: {
      regimen: "permite_desdoblar",
      nota: "Desdobla sistemáticamente; fecha por decreto. Sin medio término provincial (2021, 2025).",
      ultimas4: [
        { anio: 2025, modalidad: "no_hubo" },
        { anio: 2023, modalidad: "desdoblada", fecha: "2023-04-16" },
        { anio: 2021, modalidad: "no_hubo" },
        { anio: 2019, modalidad: "desdoblada", fecha: "2019-04-07" },
      ],
    },
    gobernador: "mayoria_simple",
    legislatura: "Unicameral, 46 legisladores, mixto (22 poblacionales + 24 regionales en 8 circuitos), D'Hondt, piso 5%.",
    primarias: "sin_paso",
    alianzas: "estandar",
    instrumento: "boleta_partidaria",
    financiamientoCampanias: "Régimen integrado en el Código 2431; control de la Justicia Electoral. Montos no verificados.",
    confianza: "media",
    nota: "PASO provinciales sancionadas en 2014 y derogadas en 2018 sin aplicarse. Boleta partidaria (proyectos de BUP para 2027).",
  },
  {
    jurisdiccion: "Salta",
    organismo: "Tribunal Electoral de la Provincia de Salta",
    leyElectoral: "Régimen Electoral 6444 / BUE Ley 7730",
    leyElectoralUrl: "https://www.electoralsalta.gob.ar/Informacion/Ley6444.pdf",
    desdoblamiento: {
      regimen: "permite_desdoblar",
      nota: "Desdobla/anticipa sistemáticamente; fecha por decreto (Ley 8463 fija antelación ≥6 meses).",
      ultimas4: [
        { anio: 2025, modalidad: "desdoblada", fecha: "2025-05-11" },
        { anio: 2023, modalidad: "desdoblada", fecha: "2023-05-14" },
        { anio: 2021, modalidad: "desdoblada", fecha: "2021-08-15" },
        { anio: 2019, modalidad: "desdoblada", fecha: "2019-11-10" },
      ],
    },
    gobernador: "mayoria_simple",
    legislatura: "Bicameral: Diputados (hasta 60, por departamento, proporcional) y Senado (23, uno por departamento, uninominal). Renovación por mitades.",
    primarias: "sin_paso",
    alianzas: "acoples",
    instrumento: "bue",
    instrumentoAnio: "2011",
    proveedorRecuento: "BUE: Magic Software Argentina (MSA, vot.ar), ~3.298 máquinas. Definitivo: Tribunal Electoral.",
    financiamientoCampanias: "Aporte estatal (igualitario + por votos); rendición a 30 días. Auditoría: Auditoría General de la Provincia. Régimen en transición (Ley 8463/2024 derogó PASO).",
    confianza: "media",
    nota: "Primera provincia con BUE en todo el territorio (desde 2011). Sistema de acoples. PASO derogadas en 2024.",
  },
  {
    jurisdiccion: "San Juan",
    organismo: "Tribunal Electoral de la Provincia de San Juan",
    leyElectoral: "Código Electoral 1268-N / SiPAD Ley 2348-N",
    leyElectoralUrl: "https://www.digestosanjuan.gob.ar/Leyes/5262/LP-1268-N.PDF",
    desdoblamiento: {
      regimen: "permite_desdoblar",
      nota: "Fecha por decreto; desdobla. Sin medio término provincial (2021, 2025).",
      ultimas4: [
        { anio: 2025, modalidad: "no_hubo" },
        { anio: 2023, modalidad: "desdoblada", fecha: "2023-07-02" },
        { anio: 2021, modalidad: "no_hubo" },
        { anio: 2019, modalidad: "desdoblada", fecha: "2019-06-02" },
      ],
    },
    gobernador: "mayoria_simple",
    legislatura: "Unicameral, 36 diputados: 19 departamentales (simple pluralidad) + 17 proporcionales (D'Hondt). Renovación total.",
    primarias: "sin_paso",
    alianzas: "ley_de_lemas",
    instrumento: "boleta_partidaria",
    financiamientoCampanias: "Reglas en Estatuto de Partidos 815-N y transparencia 8151. Montos no verificados.",
    confianza: "media",
    nota: "SiPAD (Ley 2348-N, 2022): doble voto simultáneo y acumulativo tipo Ley de Lemas, reemplazó a las PASO. En 2023 la CSJN inhabilitó a Uñac y reprogramó la elección.",
  },
  {
    jurisdiccion: "San Luis",
    organismo: "Tribunal Electoral de la Provincia de San Luis",
    leyElectoral: "Código Electoral XI-0345 / BUP Ley XI-1149",
    leyElectoralUrl: "https://electoral.justiciasanluis.gov.ar/?page_id=562",
    desdoblamiento: {
      regimen: "permite_desdoblar",
      nota: "Fecha por decreto; desdobló 2019/2023/2025, concurrió 2021.",
      ultimas4: [
        { anio: 2025, modalidad: "desdoblada", fecha: "2025-05-11" },
        { anio: 2023, modalidad: "desdoblada", fecha: "2023-06-11" },
        { anio: 2021, modalidad: "concurrente", fecha: "2021-11-14" },
        { anio: 2019, modalidad: "desdoblada", fecha: "2019-06-16" },
      ],
    },
    gobernador: "mayoria_simple",
    legislatura: "Bicameral: Diputados (43) y Senadores (9, uno por departamento), renovación por mitades.",
    primarias: "sin_paso",
    alianzas: "estandar",
    instrumento: "bup",
    instrumentoAnio: "2025",
    proveedorRecuento: "Definitivo: Tribunal Electoral provincial.",
    financiamientoCampanias: "Reglas en Ley de Partidos XI-0346. Montos no verificados.",
    confianza: "media",
    nota: "Ley de Lemas reinstaurada 2022 (usada 2023) y derogada con las PASO por la reforma 2024 (Ley XI-1149), que instauró BUP (estreno 2025).",
  },
  {
    jurisdiccion: "Santa Cruz",
    organismo: "Tribunal Superior de Justicia — Secretaría Electoral Permanente",
    leyElectoral: "Ley transitoria 3929 (2025); rige supletoria el CEN",
    leyElectoralUrl: "https://diputadosdesantacruz.gob.ar/?p=5267",
    desdoblamiento: {
      regimen: "permite_desdoblar",
      nota: "Fecha por decreto; desdobló 2019/2023. Sin medio término provincial (2021, 2025).",
      ultimas4: [
        { anio: 2025, modalidad: "no_hubo" },
        { anio: 2023, modalidad: "desdoblada", fecha: "2023-08-13" },
        { anio: 2021, modalidad: "no_hubo" },
        { anio: 2019, modalidad: "desdoblada", fecha: "2019-08-11" },
      ],
    },
    gobernador: "mayoria_simple",
    legislatura: "Unicameral, 24 diputados (14 uninominales + 10 por distrito único, RP), renovación total.",
    primarias: "sin_paso",
    alianzas: "estandar",
    instrumento: "bup",
    instrumentoAnio: "2025",
    proveedorRecuento: "Definitivo: Tribunal Electoral Permanente (TSJ).",
    financiamientoCampanias: "Sin ley específica; algunas previsiones en Ley de Partidos 1.499.",
    confianza: "media",
    nota: "En transición: Ley de Lemas derogada (2024), ley transitoria 3929 (2025) adoptó simple pluralidad y BUP pero venció 31/12/2025 sin ley definitiva.",
  },
  {
    jurisdiccion: "Santa Fe",
    organismo: "Tribunal Electoral de la Provincia de Santa Fe",
    leyElectoral: "Boleta Única 13.156 / Primarias 12.367",
    leyElectoralUrl: "https://www.saij.gob.ar/13156-local-santa-fe-sistema-boleta-unica-unificacion-padron-electoral-lps0013156-2010-11-25/123456789-0abc-defg-651-3100svorpyel",
    desdoblamiento: {
      regimen: "permite_desdoblar",
      nota: "Desdobla sistemáticamente; fecha por decreto del PE.",
      ultimas4: [
        { anio: 2025, modalidad: "desdoblada", fecha: "2025-04-13" },
        { anio: 2023, modalidad: "desdoblada", fecha: "2023-09-10" },
        { anio: 2021, modalidad: "concurrente", fecha: "2021-11-14" },
        { anio: 2019, modalidad: "desdoblada", fecha: "2019-06-16" },
      ],
    },
    gobernador: "mayoria_simple",
    legislatura: "Bicameral: Diputados (50, distrito único, RP D'Hondt tras reforma 2025) y Senado (19, uno por departamento). Renovación total.",
    primarias: "paso",
    alianzas: "estandar",
    instrumento: "bup",
    instrumentoAnio: "2011",
    proveedorRecuento: "Logística: Tribunal Electoral + Ministerio de Gobierno. Definitivo: Tribunal Electoral.",
    financiamientoCampanias: "Ley 12.080: gastos ≤ tope nacional (70% si coincide con nacional); Fondo Partidario (Ley 6.808). Control: Tribunal Electoral.",
    confianza: "media",
    nota: "Boleta Única Papel (una por categoría) desde 2011; Ley de Lemas derogada 2004. Reforma constitucional 2025 habilitó reelección del gobernador y eliminó la mayoría automática en Diputados.",
  },
  {
    jurisdiccion: "Santiago del Estero",
    organismo: "Tribunal Electoral de la Provincia de Santiago del Estero",
    leyElectoral: "Código Electoral 6908",
    leyElectoralUrl: "https://www.jussantiago.gov.ar/jusnueva/Normativa/Ley6908.php",
    desdoblamiento: {
      regimen: "permite_desdoblar",
      nota: "Const. art. 45 habilita (no obliga) la simultaneidad; fecha del Gobernador. Calendario propio por intervención federal 2004; concurrió 2021 y 2025.",
      ultimas4: [
        { anio: 2025, modalidad: "concurrente", fecha: "2025-10-26" },
        { anio: 2023, modalidad: "no_hubo" },
        { anio: 2021, modalidad: "concurrente", fecha: "2021-11-14" },
        { anio: 2019, modalidad: "no_hubo" },
      ],
    },
    gobernador: "mayoria_simple",
    legislatura: "Unicameral, 40 diputados, distrito único, RP D'Hondt, umbral 2%, renovación total.",
    primarias: "sin_paso",
    alianzas: "estandar",
    instrumento: "boleta_partidaria",
    financiamientoCampanias: "Ley 6.680 de financiamiento de campañas (2004): topes + aporte público proporcional. Control: Tribunal Electoral.",
    confianza: "alta",
    nota: "Const. art. 44 PROHÍBE la Ley de Lemas (doble voto simultáneo y acumulativo). Boleta partidaria provincial. Fallo CSJN 2013 limitó la reelección de Zamora.",
  },
  {
    jurisdiccion: "Tucumán",
    organismo: "Junta Electoral de la Provincia de Tucumán",
    leyElectoral: "Régimen Electoral 7876",
    leyElectoralUrl: "https://atlaselectoral.tucuman.gov.ar/norma/guia/",
    desdoblamiento: {
      regimen: "permite_desdoblar",
      nota: "Desdobla; fecha por decreto. Sin medio término provincial (2021, 2025).",
      ultimas4: [
        { anio: 2025, modalidad: "no_hubo" },
        { anio: 2023, modalidad: "desdoblada", fecha: "2023-06-11" },
        { anio: 2021, modalidad: "no_hubo" },
        { anio: 2019, modalidad: "desdoblada", fecha: "2019-06-09" },
      ],
    },
    gobernador: "mayoria_simple",
    legislatura: "Unicameral, 49 legisladores por 3 secciones (Capital 19 / Este 12 / Oeste 18), D'Hondt, renovación total.",
    primarias: "sin_paso",
    alianzas: "acoples",
    instrumento: "boleta_partidaria",
    financiamientoCampanias: "Sin ley específica verificada; disposiciones en Partidos 5454 y Régimen 7876.",
    confianza: "media",
    nota: "Sistema de ACOPLES con rango constitucional (art. 43, reforma 2006): listas legislativas se 'acoplan' a una candidatura ejecutiva sumando votos. Indispensable la boleta partidaria.",
  },
  {
    jurisdiccion: "Tierra del Fuego",
    organismo: "Juzgado Electoral de Tierra del Fuego (STJ)",
    leyElectoral: "Ley Electoral 201",
    leyElectoralUrl: "https://www.argentina.gob.ar/sites/default/files/02-ley201_tierra_del_fuego.pdf",
    desdoblamiento: {
      regimen: "obliga_desdoblar",
      nota: "Const. art. 202 PROHÍBE que las provinciales coincidan con las nacionales y exige anticiparlas (≥90 días). Concurrencia vedada; fecha por decreto dentro de ese marco.",
      ultimas4: [
        { anio: 2025, modalidad: "no_hubo" },
        { anio: 2023, modalidad: "desdoblada", fecha: "2023-05-14" },
        { anio: 2021, modalidad: "no_hubo" },
        { anio: 2019, modalidad: "desdoblada", fecha: "2019-06-16" },
      ],
    },
    gobernador: "doble_vuelta",
    legislatura: "Unicameral, 15 legisladores (ampliable a 25), distrito único, RP D'Hondt con sistema de tachas, renovación total.",
    primarias: "sin_paso",
    alianzas: "estandar",
    instrumento: "boleta_partidaria",
    financiamientoCampanias: "Sin ley específica; régimen en Ley de Partidos 470 y Electoral 201. Montos no verificados.",
    confianza: "media",
    nota: "Gobernador por mayoría absoluta con ballotage (art. 203). Desdoblamiento obligatorio por constitución. Boleta partidaria provincial.",
  },
];

// Fuentes por campo recolectadas en la investigación (corte 2026-06). Se anexan
// a cada ficha por nombre de jurisdicción. URLs verificadas o referenciadas; las
// secundarias (prensa, CIPPEC, Wikipedia) sostienen sobre todo el de-facto.
const FUENTES: Record<string, Fuente[]> = {
  "Nación": [
    { campo: "Código Electoral 19.945", url: "https://www.argentina.gob.ar/normativa/nacional/ley-19945-19442/actualizacion" },
    { campo: "Ley de Partidos 23.298", url: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/20000-24999/23893/texact.htm" },
    { campo: "BUP (Ley 27.781)", url: "https://servicios.infoleg.gob.ar/infolegInternet/verNorma.do?id=405395" },
    { campo: "Suspensión PASO 2025 (Ley 27.783)", url: "https://www.argentina.gob.ar/normativa/nacional/ley-27783-2025-410378" },
    { campo: "Proveedor recuento (Indra)", url: "https://www.lanacion.com.ar/politica/pliego-secreto-via-licitacion-privada-el-gobierno-contrato-a-indra-para-la-eleccion-y-avanza-con-la-nid07072025/" },
    { campo: "Financiamiento (Ley 26.215)", url: "https://servicios.infoleg.gob.ar/infolegInternet/anexos/120000-124999/124231/texact.htm" },
  ],
  "Ciudad Autónoma de Buenos Aires": [
    { campo: "Código Electoral 6031", url: "http://www2.cedom.gob.ar/es/legislacion/normas/leyes/ley6031.html" },
    { campo: "Desdoblamiento 2025", url: "https://chequeado.com/el-explicador/elecciones-en-la-ciudad-de-buenos-aires-como-quedan-las-elecciones-portenas-tras-el-desdoblamiento-de-los-comicios/" },
    { campo: "Instrumento (BUE)", url: "https://buenosaires.gob.ar/noticias/el-instituto-de-gestion-electoral-aprobo-la-implementacion-de-la-boleta-unica-electronica" },
    { campo: "Financiamiento (Ley 268)", url: "https://juristeca.jusbaires.gob.ar/compilacion-normativa-juristeca/ley-268/" },
  ],
  "Buenos Aires": [
    { campo: "Ley Electoral 5109", url: "https://www.juntaelectoral.gba.gov.ar/docs/LEY5109.pdf" },
    { campo: "Partidos (Dec-Ley 9889)", url: "https://www.juntaelectoral.gba.gov.ar/docs/texto_ley_9889.pdf" },
    { campo: "Desdoblamiento (Decreto 639/2025)", url: "https://normas.gba.gob.ar/documentos/0ZYM5GiE.html" },
  ],
  "Catamarca": [
    { campo: "Ley Electoral 4628", url: "https://www.joseperezcorti.com.ar/Archivos/Legislacion/Provincial/Catamarca/L4628_Ley_Electoral_Provincial_Catamarca.pdf" },
    { campo: "Desdoblamiento (Constitución)", url: "https://argentina.justia.com/provinciales/catamarca/constitucion-de-la-provincia-de-catamarca/" },
    { campo: "Sistema / financiamiento (OEAR-CIPPEC)", url: "https://oear.cippec.org/provincia/catamarca-2/" },
  ],
  "Córdoba": [
    { campo: "Código Electoral 9571", url: "https://www.justiciacordoba.gob.ar/Estatico/JEL/Contenido/Legislacion/files/Electoral/L.9571.pdf" },
    { campo: "Partidos / financiamiento (Ley 9572)", url: "https://www.justiciacordoba.gob.ar/Estatico/JEL/Contenido/Legislacion/files/Electoral/L.9572.pdf" },
    { campo: "Boleta Única (experiencia 2011)", url: "https://www.joseperezcorti.com.ar/Archivos/Doctrina/Electoral/2011_10_10_BUS_Experiencia_Cordoba_LLCba-01-2012_v.4.0.pdf" },
    { campo: "Proveedor recuento 2023 (OCASA)", url: "https://www.cadena3.com/noticia/cadena-3-elecciones-2023/comenzo-el-escrutinio-en-cordoba-llaryora-y-juez-una-pulseada-que-mira-el-pais_361665" },
  ],
  "Corrientes": [
    { campo: "Normativa electoral (DINE)", url: "https://www.argentina.gob.ar/dine/normativa-electoral/corrientes" },
    { campo: "Sistema (Constitución, doble vuelta)", url: "https://argentina.justia.com/provinciales/corrientes/constitucion-de-corrientes/parte-segunda/titulo-segundo/seccion-segunda/capitulo-ii/" },
    { campo: "Desdoblamiento 2025", url: "https://www.lanacion.com.ar/politica/elecciones-2025-corrientes-desdobla-sus-comicios-y-elegira-gobernador-el-31-de-agosto-nid26052025/" },
    { campo: "Junta Electoral", url: "https://www.juscorrientes.gov.ar/junta-electoral/" },
  ],
  "Chaco": [
    { campo: "Régimen Electoral 834-Q", url: "https://www.electoralchaco.gov.ar/images/leyesprovinciales/4169ahora834Q.pdf" },
    { campo: "Partidos / Fondo (Ley 3.401)", url: "https://www.argentina.gob.ar/sites/default/files/cha-14-ley_3.401.pdf" },
    { campo: "Sistema (Constitución, ballotage)", url: "https://argentina.justia.com/provinciales/chaco/constitucion-de-la-provincia-de-chaco/seccion-cuarta/capitulo-i/" },
    { campo: "Resultados oficiales", url: "https://resultados.chaco.gob.ar/" },
  ],
  "Chubut": [
    { campo: "Código Electoral XII Nº 21", url: "https://electoralchubut.gob.ar/wp-content/uploads/2025/08/LEY-XII-21.pdf" },
    { campo: "BUP / fin de PASO (2024)", url: "https://legislaturadelchubut.gob.ar/2024/11/21/en-una-sesion-historica-y-con-amplio-acompanamiento-la-legislatura-del-chubut-aprobo-el-codigo-electoral-provincial-con-boleta-unica/" },
    { campo: "Legislación electoral", url: "https://electoralchubut.gob.ar/legislacion_electoral/" },
  ],
  "Entre Ríos": [
    { campo: "Código Electoral 11.190", url: "https://portal.entrerios.gov.ar/gobiernoytrabajo/ps/proyectosynormativas/6084" },
    { campo: "Partidos (Ley 5170)", url: "https://www.tribunalelectoraler.gob.ar/legislacion/2-ley-p-n-5170-partidos-polticos" },
    { campo: "Instrumento (BUP)", url: "https://portal.entrerios.gov.ar/prensa/noticias/14997" },
    { campo: "Sistema de elecciones (archivo)", url: "https://tribunalelectoraler.gob.ar/sistema-de-elecciones" },
  ],
  "Formosa": [
    { campo: "Régimen Electoral 152", url: "https://www.argentina.gob.ar/sites/default/files/02-ley_152_formosa.pdf" },
    { campo: "Ley de Lemas 653", url: "https://www.argentina.gob.ar/sites/default/files/04-ley_653_formosa.pdf" },
    { campo: "Desdoblamiento 2025", url: "https://www.formosa.gob.ar/noticia/33074/12/el_gobernador_insfran_convoco_a_elecciones_legislativas_y_constituyentes_para_el_proximo_29_de_junio" },
    { campo: "Resultados (TEP)", url: "https://tep.jusformosa.gob.ar/resultados" },
  ],
  "Jujuy": [
    { campo: "Código Electoral 4164", url: "https://www.electoraljujuy.gob.ar/Contenido/TEP/Digesto/CodigoElectoralProvinciaLemas.pdf" },
    { campo: "Partidos (Ley 3919)", url: "https://electoraljujuy.gob.ar/Contenido/TEP/Digesto/LeyOrganicaPartidosPoliticos.pdf" },
    { campo: "Tribunal Electoral", url: "https://electoraljujuy.gob.ar/" },
  ],
  "La Pampa": [
    { campo: "Ley Electoral 1593", url: "https://www.saij.gob.ar/1593-local-pampa-ley-electoral-provincial-lpl0000601-1994-12-01/123456789-0abc-defg-106-0000lvorpyel" },
    { campo: "Sistema / financiamiento (OEAR-CIPPEC)", url: "https://oear.cippec.org/provincia/la-pampa/" },
    { campo: "Tribunal Electoral", url: "https://trielectorallapampa.gob.ar/" },
  ],
  "La Rioja": [
    { campo: "Ley Electoral 5139", url: "https://justicialarioja.gob.ar/legislacion/Ley%20Electoral%20Provincial%20-%20(Ley%205139%20-%20revisada%20al%2025-03-2015).pdf" },
    { campo: "Desdoblamiento 2023 (decretos)", url: "https://www.electoral.gob.ar/nuevo/paginas/pdf/2023%20-%20LA%20RIOJA%20(Dtos.%20116-23%20y%20117-23).pdf" },
    { campo: "Sistema / financiamiento (OEAR-CIPPEC)", url: "https://oear.cippec.org/provincia/la-rioja/" },
  ],
  "Mendoza": [
    { campo: "Régimen Electoral 2551", url: "https://www.jus.mendoza.gov.ar/documents/224179/238636/Ley+2551+-+Regimen+Electoral.pdf" },
    { campo: "Boleta Única (Ley 9375)", url: "https://www.argentina.gob.ar/normativa/provincial/ley-9375-123456789-0abc-defg-573-9000mvorpyel/actualizacion" },
    { campo: "Financiamiento (Ley 7005)", url: "https://mza-dicaws-portal-uploads-media-prod.s3.amazonaws.com/elecciones/uploads/2025/09/Ley-7005-Regulacion-y-financiamiento-de-las-campanas-electorales.pdf" },
    { campo: "Desdoblamiento 2025", url: "https://prensa.mendoza.gob.ar/elecciones-2025-mendoza-votara-el-26-de-octubre-cargos-provinciales-y-nacionales-en-forma-concurrente/" },
  ],
  "Misiones": [
    { campo: "Ley Electoral XI Nº 6", url: "https://www.electoralmisiones.gov.ar/wp-content/uploads/2021/01/LeyXI-N6TextoDefinitivo2020.pdf" },
    { campo: "Sistema / instrumento", url: "https://transparenciaelectoral.org/caoeste/argentina-que-se-vota-en-misiones/" },
    { campo: "Desdoblamiento 2025", url: "https://www.infobae.com/politica/2025/03/09/misiones-desdoblara-sus-elecciones-y-ya-son-siete-las-provincias-que-se-separaron-de-los-comicios-nacionales/" },
  ],
  "Neuquén": [
    { campo: "Ley 3053 (sistema + BUE)", url: "https://www.argentina.gob.ar/normativa/provincial/ley-3053-123456789-0abc-defg-350-3000qvorpyel" },
    { campo: "Instrumento (BUE)", url: "https://elecciones.neuquen.gov.ar/bue/" },
    { campo: "Proveedor (MSA)", url: "https://www.infobae.com/politica/2019/03/06/la-boleta-unica-electronica-se-usara-por-primera-vez-en-toda-la-provincia-de-neuquen/" },
    { campo: "Financiamiento", url: "https://www.lmneuquen.com/neuquen/quien-controla-la-plata-la-politica-neuquen-n1185729" },
  ],
  "Río Negro": [
    { campo: "Código Electoral 2431", url: "https://www.jusrionegro.gov.ar/web/normativa/documentacion/LEY_O_2431.pdf" },
    { campo: "Normativa electoral (DINE)", url: "https://www.argentina.gob.ar/dine/normativa-electoral/rio-negro" },
    { campo: "Financiamiento", url: "https://gobierno.rionegro.gov.ar/direccion-asuntos-electorales/normativa" },
  ],
  "Salta": [
    { campo: "Régimen Electoral 6444", url: "https://www.electoralsalta.gob.ar/Informacion/Ley6444.pdf" },
    { campo: "BUE (Ley 7730)", url: "https://www.electoralsalta.gov.ar/Informacion/Ley7730.pdf" },
    { campo: "Desdoblamiento 2025", url: "https://www.salta.gob.ar/prensa/noticias/el-gobernador-saenz-convoco-a-elecciones-para-el-4-de-mayo-de-2025-98483" },
    { campo: "Financiamiento", url: "https://elauditor.info/actualidad/-como-se-controlan-los-gastos-de-campana-en-las-provincias-_a64d4f60ba25c1e3fdab9c1b2" },
  ],
  "San Juan": [
    { campo: "Código Electoral 1268-N", url: "https://www.digestosanjuan.gob.ar/Leyes/5262/LP-1268-N.PDF" },
    { campo: "Normativa electoral (DINE)", url: "https://www.argentina.gob.ar/dine/normativa-electoral/san-juan" },
    { campo: "SiPAD (doble voto acumulativo)", url: "https://www.lanacion.com.ar/politica/como-funciona-el-sipad-el-sistema-con-el-que-se-vota-en-las-elecciones-de-san-juan-nid29062023/" },
  ],
  "San Luis": [
    { campo: "Código Electoral XI-0345 / BUP XI-1149", url: "https://electoral.justiciasanluis.gov.ar/?page_id=562" },
    { campo: "Ley de Lemas y su derogación (Senado)", url: "https://senado.sanluis.gov.ar/nota/?hash=8V2dw" },
    { campo: "BUP (2025)", url: "https://agenciasanluis.com/2024/11/20/1005047-las-proximas-elecciones-en-san-luis-seran-con-boleta-unica-de-papel/" },
  ],
  "Santa Cruz": [
    { campo: "Ley transitoria 3929 (2025)", url: "https://diputadosdesantacruz.gob.ar/?p=5267" },
    { campo: "Partidos (Ley 1499)", url: "https://www.jussantacruz.gob.ar/pdfs/normativa-juridica/leyes-usuales/ley-1499.pdf" },
    { campo: "Sistema / financiamiento (OEAR-CIPPEC)", url: "https://oear.cippec.org/provincia/santa-cruz/" },
  ],
  "Santa Fe": [
    { campo: "Boleta Única 13.156", url: "https://www.saij.gob.ar/13156-local-santa-fe-sistema-boleta-unica-unificacion-padron-electoral-lps0013156-2010-11-25/123456789-0abc-defg-651-3100svorpyel" },
    { campo: "Partidos (Ley 6808)", url: "https://www.santafe.gov.ar/tribunalelectoral/wp-content/uploads/sites/84/2024/03/Texto-Actualizado-Ley-N%C2%B0-6808.pdf" },
    { campo: "Financiamiento (Ley 12.080)", url: "https://www.santafe.gov.ar/tribunalelectoral/wp-content/uploads/2022/11/Ley-N%C2%B0-12080.pdf" },
  ],
  "Santiago del Estero": [
    { campo: "Código Electoral 6908", url: "https://www.jussantiago.gov.ar/jusnueva/Normativa/Ley6908.php" },
    { campo: "Normativa / financiamiento (DINE)", url: "https://www.argentina.gob.ar/dine/normativa-electoral/santiago-del-estero" },
    { campo: "Sistema (Constitución, art. 44 prohíbe lemas)", url: "https://argentina.justia.com/provinciales/santiago-del-estero/constitucion-provincial-de-santiago-del-estero/parte-primera/titulo-iii/capitulo-iii/" },
  ],
  "Tucumán": [
    { campo: "Régimen Electoral 7876 (digesto)", url: "https://atlaselectoral.tucuman.gov.ar/norma/guia/" },
    { campo: "Partidos (Ley 5454, DINE)", url: "https://www.argentina.gob.ar/dine/normativa-electoral/tucuman" },
    { campo: "Acoples (elección 2023)", url: "https://es.wikipedia.org/wiki/Elecciones_provinciales_de_Tucum%C3%A1n_de_2023" },
  ],
  "Tierra del Fuego": [
    { campo: "Ley Electoral 201", url: "https://www.argentina.gob.ar/sites/default/files/02-ley201_tierra_del_fuego.pdf" },
    { campo: "Partidos (Ley 470)", url: "https://www.justierradelfuego.gov.ar/regimen-de-partidos-politicos-2/" },
    { campo: "Constitución (art. 202/203)", url: "https://www.congreso.gob.ar/constituciones/TIERRA-DEL-FUEGO.pdf" },
  ],
};

// Cámaras (uni/bicameral) y renovación (total cada 4 años vs parcial cada 2),
// derivadas del campo `legislatura` de cada ficha.
const CAMARAS: Record<string, Camaras> = {
  "Nación": "bicameral",
  "Ciudad Autónoma de Buenos Aires": "unicameral",
  "Buenos Aires": "bicameral",
  "Catamarca": "bicameral",
  "Córdoba": "unicameral",
  "Corrientes": "bicameral",
  "Chaco": "unicameral",
  "Chubut": "unicameral",
  "Entre Ríos": "bicameral",
  "Formosa": "unicameral",
  "Jujuy": "unicameral",
  "La Pampa": "unicameral",
  "La Rioja": "unicameral",
  "Mendoza": "bicameral",
  "Misiones": "unicameral",
  "Neuquén": "unicameral",
  "Río Negro": "unicameral",
  "Salta": "bicameral",
  "San Juan": "unicameral",
  "San Luis": "bicameral",
  "Santa Cruz": "unicameral",
  "Santa Fe": "bicameral",
  "Santiago del Estero": "unicameral",
  "Tucumán": "unicameral",
  "Tierra del Fuego": "unicameral",
};

const RENOVACION: Record<string, Renovacion> = {
  "Nación": "parcial_2",
  "Ciudad Autónoma de Buenos Aires": "parcial_2",
  "Buenos Aires": "parcial_2",
  "Catamarca": "parcial_2",
  "Córdoba": "total_4",
  "Corrientes": "parcial_2",
  "Chaco": "parcial_2",
  "Chubut": "total_4",
  "Entre Ríos": "total_4",
  "Formosa": "parcial_2",
  "Jujuy": "parcial_2",
  "La Pampa": "total_4",
  "La Rioja": "parcial_2",
  "Mendoza": "parcial_2",
  "Misiones": "parcial_2",
  "Neuquén": "total_4",
  "Río Negro": "total_4",
  "Salta": "parcial_2",
  "San Juan": "total_4",
  "San Luis": "parcial_2",
  "Santa Cruz": "total_4",
  "Santa Fe": "total_4",
  "Santiago del Estero": "total_4",
  "Tucumán": "total_4",
  "Tierra del Fuego": "total_4",
};

// Voto joven (16-17). Investigación verificada (2026-06): las 25 jurisdicciones lo
// habilitan, optativo, tanto en elecciones nacionales como provinciales. Santa Fe
// fue la última (2023, por resolución del Tribunal Electoral, no por ley).
const VOTO_JOVEN: Record<string, VotoJoven> = {};
for (const r of REGIMENES) VOTO_JOVEN[r.jurisdiccion] = "si";

// Fuente del voto joven por jurisdicción (norma específica o el registro oficial
// del Observatorio Electoral del Ministerio del Interior).
const OBSERVATORIO = "https://www.argentina.gob.ar/interior/observatorioelectoral/voto-joven";
const VOTO_JOVEN_FUENTE: Record<string, string> = {
  "Nación": "https://www.saij.gob.ar/26774-nacional-ley-voto-joven-lns0005762-2012-10-31/123456789-0abc-defg-g26-75000scanyel",
  "Ciudad Autónoma de Buenos Aires": "https://www.argentina.gob.ar/sites/default/files/codigo_electoral.pdf",
  "Buenos Aires": "https://normas.gba.gob.ar/documentos/xkDZgUAB.html",
  "Catamarca": "https://digesto.catamarca.gob.ar/ley/ley_detail/40",
  "Corrientes": "https://hcdcorrientes.gov.ar/ley-6615-goce-de-derechos-politicos-de-los-jovenes-que-hubiesen-cumplido-16-anos/",
  "Mendoza": "https://elecciones.mendoza.gob.ar/ley-electoral-de-la-provincia/",
  "Neuquén": "https://www.legislaturaneuquen.gob.ar/svrfiles/Neuleg/normaslegales/pdf/LEY3053.pdf",
  "Santa Fe": "https://www.ellitoral.com/politica/voto-joven-santa-fe-elecciones-menores-tribunal-electoral-habilitacion_0_Lj3nunLgkB.html",
};

for (const r of REGIMENES) {
  const fuentes = [...(FUENTES[r.jurisdiccion] ?? [])];
  fuentes.push({ campo: "Voto joven (16-17)", url: VOTO_JOVEN_FUENTE[r.jurisdiccion] ?? OBSERVATORIO });
  r.fuentes = fuentes;
  r.camaras = CAMARAS[r.jurisdiccion];
  r.renovacion = RENOVACION[r.jurisdiccion];
  r.votoJoven = VOTO_JOVEN[r.jurisdiccion] ?? "sin_dato";
}
