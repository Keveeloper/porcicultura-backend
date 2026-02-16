import { Module } from '@nestjs/common';
import { DailyMealsService } from './daily_meals.service';
import { DailyMealsController } from './daily_meals.controller';
import { DailyMeal } from './entities/daily_meal.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatchStagesModule } from 'src/batch_stages/batch_stages.module';

@Module({
  imports: [TypeOrmModule.forFeature([DailyMeal]), BatchStagesModule],
  controllers: [DailyMealsController],
  providers: [DailyMealsService],
  exports: [DailyMealsService, TypeOrmModule]
})
export class DailyMealsModule {}
