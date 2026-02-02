import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Batch } from './entities/batch.entity';
import { BatchesService } from './batches.service';
import { BatchesController } from './batches.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Batch])],
    exports: [BatchesService, TypeOrmModule],
    controllers: [BatchesController],
    providers: [BatchesService],
})
export class BatchesModule {}
