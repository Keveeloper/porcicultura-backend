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

  // CONV — conversión alimenticia = feed_per_pig / gain de la etapa (2 decimales).
  conv: number | null;
}

// Fila TOTALES del bloque CONSUMO ALIMENTO (acumulado del lote).
export class FeedConsumptionTotal {
  // DIAS — total de días del lote (suma de days por etapa).
  days: number;

  // KILOS — total de alimento del lote (suma de kilos por etapa).
  kilos: number;

  // C/CERDO — kilos totales / final_pigs (2 decimales).
  feed_per_pig: number | null;

  // C/DIA — feed_per_pig total / días totales (2 decimales).
  feed_per_day: number | null;

  // CONV — feed_per_pig total / ganancia total (2 decimales).
  conv: number | null;
}

// Fila resumen del bloque PESO PROMEDIO CERDOS POR ETAPAS (acumulado del lote).
export class WeightPerStageTotal {
  // INICIAL — peso inicial de la primera etapa.
  initial_weight: number | null;

  // FINAL — peso final de la última etapa.
  final_weight: number | null;

  // GANANCIA — final - inicial del lote completo (2 decimales).
  gain: number | null;

  // GAN/DIA — ganancia total / días totales (3 decimales).
  gain_per_day: number | null;
}

// Fila del bloque PESO PROMEDIO CERDOS POR ETAPAS (una por etapa).
// Se irá ampliando con ganancia y ganancia/día.
export class WeightPerStageRow {
  // ETAPA — tipo de etapa.
  stage: BatchStageType;

  // INICIAL — peso inicial del cerdo en la etapa (BatchStage.initial_pig_weight).
  initial_weight: number;

  // FINAL — peso final del cerdo en la etapa (BatchStage.final_pig_weight).
  final_weight: number | null;

  // GANANCIA — peso ganado en la etapa = final_weight - initial_weight (2 decimales).
  gain: number | null;

  // GAN/DIA — ganancia diaria = gain / days (3 decimales).
  gain_per_day: number | null;
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

  // CONSUMO ALIMENTO — una fila por etapa.
  feed_consumption: FeedConsumptionRow[];

  // CONSUMO ALIMENTO — fila TOTALES (acumulado del lote).
  feed_consumption_total: FeedConsumptionTotal;

  // PESO PROMEDIO CERDOS POR ETAPAS — una fila por etapa.
  weight_per_stage: WeightPerStageRow[];

  // PESO PROMEDIO CERDOS POR ETAPAS — fila resumen (acumulado del lote).
  weight_per_stage_total: WeightPerStageTotal;

  // TOTAL PESO LOTE GRANJA — peso final por cerdo * número final de cerdos.
  total_batch_weight_farm: number | null;

  // TOTAL PESO LOTE SACRIFICIO — peso de granja menos 2% de merma (granja * 0.98).
  total_batch_weight_slaughter: number | null;

  // PROMEDIO PESO SACRIFICIO — peso de sacrificio / número final de cerdos.
  average_slaughter_weight: number | null;
}
