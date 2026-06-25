import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Batch } from './entities/batch.entity';
import { DailyMeal } from 'src/daily_meals/entities/daily_meal.entity';
import { BatchesService } from './batches.service';
import { BatchesController } from './batches.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [TypeOrmModule.forFeature([Batch, DailyMeal]), UsersModule],
    exports: [BatchesService, TypeOrmModule],
    controllers: [BatchesController],
    providers: [BatchesService],
})
export class BatchesModule {}
