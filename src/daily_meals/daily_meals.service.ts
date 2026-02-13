import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DailyMeal } from './entities/daily_meal.entity';
import { Repository } from 'typeorm';
import { BatchStagesService } from 'src/batch_stages/batch_stages.service';
import { CreateDailyMealDto } from './dtos/create-daily_meal.dto';

@Injectable()
export class DailyMealsService {
  constructor(
    @InjectRepository(DailyMeal)
    private readonly dailyMelaRepository: Repository<DailyMeal>,
    private readonly batchStagesService: BatchStagesService,
  ) {}

  async createDailyMeals(records: CreateDailyMealDto[]){
    try {
      const recordsToUpsert = records.map(record => ({
        ...record,
        batchStage: { id: record.batch_stage_id }
      }));

      const savedRecords = await this.dailyMelaRepository.upsert(recordsToUpsert, {
        conflictPaths: ['batchStage', 'date'],
        skipUpdateIfNoValuesChanged: true
      })

      return savedRecords;
    } catch (error) {
      console.log('error: ', error);

      throw new InternalServerErrorException(`Error creating daily meals: ${error.message || error}`);
    }
  }
}
