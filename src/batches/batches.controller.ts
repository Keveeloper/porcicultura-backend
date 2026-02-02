import { Body, Controller, Post } from '@nestjs/common';
import { CreateBatchDto } from './dtos/create-batch.dto';
import { BatchesService } from './batches.service';

@Controller('batches')
export class BatchesController {
    constructor(
        private readonly batchService: BatchesService
    ){}

    @Post()
    create(@Body() CreateBatchDto: CreateBatchDto){
        return this.batchService.create(CreateBatchDto);
    }
}
