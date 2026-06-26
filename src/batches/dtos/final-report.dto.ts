import { BatchStageType } from 'src/batch_stages/entities/types';

// Fila del bloque CONSUMO ALIMENTO (una por etapa). Se irá ampliando con kilos, c/cerdo, c/día, conv.
export class FeedConsumptionRow {
  // ETAPA — tipo de etapa.
  stage: BatchStageType;

  // DIAS — número de días con registro de alimentación en la etapa (COUNT de daily_meals).
  days: number;

  // KILOS — consumo total de alimento de la etapa = SUM(daily_meals.feed_kg).
  kilos: number;

  // C/CERDO — consumo de alimento por cerdo = kilos / final_pigs (2 decimales).
  feed_per_pig: number | null;

  // C/DIA — consumo diario por cerdo = feed_per_pig / days (2 decimales).
  feed_per_day: number | null;
}

// DTO de respuesta para el informe final del lote (RESULTADO FINAL LOTE PORCINO).
// Se irá ampliando campo a campo.
export class FinalReportDto {
  // GRANJA — nombre de la compañía (Company.name)
  farm_name: string;

  // No LOTE — número del lote (Batch.batch_number)
  batch_number: string;

  // F-INGRESO — primer día de alimentación del lote = MIN(daily_meals.date). Formato 'YYYY-MM-DD'.
  entry_date: string | null;

  // F-SALIDA — último día de alimentación del lote = MAX(daily_meals.date). Formato 'YYYY-MM-DD'.
  exit_date: string | null;

  // DIAS — duración del lote en días = exit_date - entry_date.
  days: number | null;

  // No INICIAL DE CERDOS — initial_pigs de la primera etapa del lote.
  initial_pigs: number | null;

  // No FINAL DE CERDOS — inicial menos la mortalidad total acumulada.
  final_pigs: number | null;

  // MORTALIDAD — total de cerdos muertos = SUM(daily_meals.mortality).
  mortality: number;

  // % MORTALIDAD LOTE — mortalidad / initial_pigs * 100 (2 decimales).
  mortality_percentage: number | null;

  // CONSUMO ALIMENTO — una fila por etapa. Por ahora solo pre-nursery.
  feed_consumption: FeedConsumptionRow[];
}
