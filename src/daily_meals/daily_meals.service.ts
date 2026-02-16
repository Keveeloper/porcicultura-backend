import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DailyMeal } from './entities/daily_meal.entity';
import { Repository } from 'typeorm';
import { BatchStagesService } from 'src/batch_stages/batch_stages.service';
import { CreateDailyMealDto } from './dtos/create-daily_meal.dto';
import { BatchStageStatus } from 'src/batch_stages/entities/types';

@Injectable()
export class DailyMealsService {
  constructor(
    @InjectRepository(DailyMeal)
    private readonly dailyMealRepository: Repository<DailyMeal>,
    private readonly batchStagesService: BatchStagesService,
  ) {}

  // async createDailyMeals(records: CreateDailyMealDto[]){
  //   const batchStageId = records[0].batch_stage_id;
  //   try {
  //     const batchStage = await this.batchStagesService.getBatchStageById(batchStageId);

  //     const recordsToUpsert = records.map(record => ({
  //       ...record,
  //       batchStage: { id: record.batch_stage_id }
  //     }));

  //     await this.dailyMelaRepository.upsert(recordsToUpsert, {
  //       conflictPaths: ['batchStage', 'date'],
  //       skipUpdateIfNoValuesChanged: true
  //     })

  //     if (batchStage.status === BatchStageStatus.PENDING) {
  //       await this.batchStagesService.updateStatus(batchStageId, BatchStageStatus.IN_PROGRESS)
  //     }

  //     return {
  //       message: 'Daily meals processed successfully',
  //       count: records.length,
  //       stageStatus: batchStage.status === BatchStageStatus.PENDING ? BatchStageStatus.IN_PROGRESS : batchStage.status
  //     };
  //   } catch (error) {
  //     if (error.status && error.status < 500) {
  //       throw error;
  //     }
  //     throw new InternalServerErrorException(`Error creating daily meals: ${error.message}`);
  //   }
  // }

  async createDailyMeals(batchId: string, batchStageId: string, records: CreateDailyMealDto[]) {
    try {
      // 1. Verificamos que la etapa exista y pertenezca al lote
      const batchStage = await this.batchStagesService.getOneBatchStage(batchId, batchStageId);
      if (!batchStage) {
        throw new NotFoundException('La etapa no coincide con el lote proporcionado');
      }

      // 2. Preparamos los registros para el UPSERT
      const recordsToUpsert = records.map(record => ({
        ...record,
        date: new Date(record.date),
        batchStage: { id: batchStageId }
      }));

      // 3. Guardamos/Actualizamos masivamente
      await this.dailyMealRepository.upsert(recordsToUpsert, {
        conflictPaths: ['batchStage', 'date'],
        skipUpdateIfNoValuesChanged: true
      });

      // 4. Actualizamos estado si estaba pendiente
      if (batchStage.status === BatchStageStatus.PENDING) {
        await this.batchStagesService.updateStatus(batchStageId, BatchStageStatus.IN_PROGRESS);
      }

      // 5. Retornamos el objeto completo con métricas calculadas
      return this.getBatchStageMetrics(batchId, batchStageId);

    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(`Error al procesar registros diarios: ${error.message}`);
    }
  }

  async getBatchStageMetrics(batchId: string, batchStageId: string) {
    // Obtenemos la etapa con todos sus registros históricos
    const batchStage = await this.batchStagesService.getOneBatchStage(batchId, batchStageId)

    if (batchStage) {

      // Cálculos de acumulados (Como en tu imagen de Excel)
      const totals = batchStage.dailyMeals.reduce((acc, curr) => {
        acc.feed += Number(curr.feed_kg);
        acc.deaths += curr.mortality;
        return acc;
      }, { feed: 0, deaths: 0 });
      const currentPigs = batchStage.initial_pigs - totals.deaths;
      // Peso total ganado (Simulación: asumiendo que el peso final se actualiza en la etapa)
      const weightGain = batchStage.final_batch_weight
        ? Number(batchStage.final_batch_weight) - Number(batchStage.initial_batch_weight)
        : 0;

        return {
          ...batchStage,
          metrics: {
            cumulative_feed: totals.feed.toFixed(2),
            cumulative_mortality: totals.deaths,
            mortality_percentage: ((totals.deaths / batchStage.initial_pigs) * 100).toFixed(2),
            current_pig_balance: currentPigs,
            // FCR = Alimento total / Ganancia de peso
            fcr: weightGain > 0 ? (totals.feed / weightGain).toFixed(2) : "0.00"
          }
        };
    }
    throw new BadRequestException('Batch stage does not exists');
  }

}
