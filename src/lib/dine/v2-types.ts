// Tipos de la API real que usa el SPA oficial (endpoints abiertos, sin token):
//   GET /api/menu/periodos
//   GET /api/menu?año=Y&idEleccion=E        (árbol de catálogos)
//   GET /api/resultado/totalizado?...        (resultados con listas y color)

// ---------- menu (catálogos) ----------

export interface Seccion {
  IdSeccion: number | null;
  Seccion: string | null;
}
export interface SeccionProvincial {
  IDSeccionProvincial: number | null;
  SeccionProvincial: string | null;
  Secciones: Seccion[];
}
export interface DistritoNodo {
  IdDistrito: number;
  Distrito: string;
  SeccionesProvinciales: SeccionProvincial[];
}
export interface CargoNodo {
  IdCargo: string;
  Cargo: string;
  Distritos: DistritoNodo[];
}
export interface EleccionMenu {
  _id: string;
  Año: number;
  Recuento: string;
  Fecha: string;
  IdEleccion: number;
  Elecciones: string; // "PASO" | "Generales" | "Balotaje" ...
  Cargos?: CargoNodo[]; // presente solo al pedir con año+idEleccion
}

// ---------- resultado/totalizado ----------

export interface ListaResultado {
  lista: string;
  idlista: string;
  Votos: number;
  tipoVoto: string;
  Agrupacion: string;
}
export interface AgrupacionTotalizado {
  nombre: string;
  votos: number;
  porcentaje: number;
  idAgrupacion: string;
  color: string;
  listas: ListaResultado[];
}
export interface Totalizado {
  total: number;
  positivos: number;
  blancos: number;
  nulos: number;
  impugnados: number;
  recurridos: number;
  comando: number;
  MesasEscrutadas: number;
  Electores: number;
  Votantes: number;
  ParticipacionSobreEscrutado: number;
  IdDistrito: number;
  Distrito: string;
  Año: number;
  Recuento: string;
  IdEleccion: number;
  Elecciones: string;
  IdCargo: number;
  Cargo: string;
  agrupaciones: AgrupacionTotalizado[];
}

export interface TotalizadoParams {
  anio: string; // año (se envía encodeado por la ñ)
  idEleccion: number;
  idCargo: number;
  idDistrito: number; // 0 = nacional
  idSeccionProvincial?: number;
  idSeccion?: number;
  idCircuito?: string;
  idMesa?: string;
}
