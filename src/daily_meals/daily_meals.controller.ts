import { Body, Controller, Param, Post, Res, UseGuards } from '@nestjs/common';
import { DailyMealsService } from './daily_meals.service';
import { CreateDailyMealDto } from './dtos/create-daily_meal.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('daily-meals')
@UseGuards(JwtAuthGuard)
export class DailyMealsController {
  constructor(
    private readonly dailyMealsService: DailyMealsService
  ) {}

  @Post('batch/:batchId/batch-stage/:batchStageId')
  create(
    @Param('batchId') batchId: string,
    @Param('batchStageId') batchStageId: string,
    @Body() createDailyMealDto: CreateDailyMealDto[],
  ) {
    return this.dailyMealsService.createDailyMeals(batchId, batchStageId, createDailyMealDto);
  }

}
