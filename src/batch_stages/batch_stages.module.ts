import { forwardRef, Module } from '@nestjs/common';
import { BatchStagesService } from './batch_stages.service';
import { BatchStagesController } from './batch_stages.controller';
import { BatchStage } from './entities/batch_stage.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyMealsModule } from 'src/daily_meals/daily_meals.module';

@Module({
  imports: [TypeOrmModule.forFeature([BatchStage]), forwardRef(() => DailyMealsModule)],
  controllers: [BatchStagesController],
  providers: [BatchStagesService],
  exports: [BatchStagesService, TypeOrmModule],
})
export class BatchStagesModule {}
