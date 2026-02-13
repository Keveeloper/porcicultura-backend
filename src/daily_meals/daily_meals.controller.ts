import { Body, Controller, Post } from '@nestjs/common';
import { DailyMealsService } from './daily_meals.service';
import { CreateDailyMealDto } from './dtos/create-daily_meal.dto';

@Controller('daily-meals')
export class DailyMealsController {
  constructor(private readonly dailyMealsService: DailyMealsService) {}

  @Post()
  create(@Body() createDailyMealDto: CreateDailyMealDto[]) {
    return this.dailyMealsService.createDailyMeals(createDailyMealDto);
  }
}
