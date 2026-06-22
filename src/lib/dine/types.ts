// Tipos del API electoral DINE — derivados de respuestas reales de getResultados.

export type TipoRecuento = "1"; // 1 = Recuento Provisorio (único público hoy)
export type TipoEleccion = "1" | "2" | "3"; // 1=PASO, 2=Generales, 3=Balotaje

/** Parámetros de la consulta getResultados. Los opcionales acotan el ámbito. */
export interface ResultadosParams {
  anioEleccion: string; // ej "2023"
  tipoRecuento: TipoRecuento;
  tipoEleccion: TipoEleccion;
  categoriaId: number; // cargo: 1=Presidente, 2=Senadores Nac, 3=Diputados Nac...
  distritoId?: string;
  seccionProvincialId?: string;
  seccionId?: string;
  circuitoId?: string; // 6 dígitos, ej "000039"
  mesaId?: string;
}

export interface EstadoRecuento {
  mesasEsperadas: number;
  mesasTotalizadas: number;
  mesasTotalizadasPorcentaje: number;
  cantidadElectores: number;
  cantidadVotantes: number;
  participacionPorcentaje: number;
}

export interface AgrupacionResultado {
  idAgrupacion: number;
  nombreAgrupacion: string;
  votos: number;
  votosPorcentaje: number;
  idAgrupacionTelegrama?: string;
  urlLogo?: string;
}

export interface ValoresTotalizadosOtros {
  votosNulos: number;
  votosEnBlanco: number;
  votosRecurridosComandoImpugnados: number;
}

export interface ResultadosResponse {
  fechaTotalizacion: string;
  estadoRecuento: EstadoRecuento;
  valoresTotalizadosPositivos: AgrupacionResultado[];
  valoresTotalizadosOtros: ValoresTotalizadosOtros | ValoresTotalizadosOtros[];
}
