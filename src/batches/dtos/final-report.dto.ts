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
}
