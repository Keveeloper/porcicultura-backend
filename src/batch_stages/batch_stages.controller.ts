import { Controller, Post, Body } from '@nestjs/common';
import { BatchStagesService } from './batch_stages.service';
import { CreateBatchStageDto } from './dto/create-batch_stage.dto';

@Controller('batch-stages')
export class BatchStagesController {
  constructor(private readonly batchStagesService: BatchStagesService) {}

  @Post()
  create(@Body() createBatchStageDto: CreateBatchStageDto) {
    return this.batchStagesService.create(createBatchStageDto);
  }

}
