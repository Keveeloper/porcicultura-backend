import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
    private readonly dailyMelaRepository: Repository<DailyMeal>,
    private readonly batchStagesService: BatchStagesService,
  ) {}

  async createDailyMeals(records: CreateDailyMealDto[]){
    const batchStageId = records[0].batch_stage_id;
    try {
      const batchStage = await this.batchStagesService.getBatchStageById(batchStageId);

      const recordsToUpsert = records.map(record => ({
        ...record,
        batchStage: { id: record.batch_stage_id }
      }));

      await this.dailyMelaRepository.upsert(recordsToUpsert, {
        conflictPaths: ['batchStage', 'date'],
        skipUpdateIfNoValuesChanged: true
      })

      if (batchStage.status === BatchStageStatus.PENDING) {
        await this.batchStagesService.updateStatus(batchStageId, BatchStageStatus.IN_PROGRESS)
      }

      return {
        message: 'Daily meals processed successfully',
        count: records.length,
        stageStatus: batchStage.status === BatchStageStatus.PENDING ? BatchStageStatus.IN_PROGRESS : batchStage.status
      };
    } catch (error) {
      if (error.status && error.status < 500) {
        throw error;
      }
      throw new InternalServerErrorException(`Error creating daily meals: ${error.message}`);
    }
  }
}
