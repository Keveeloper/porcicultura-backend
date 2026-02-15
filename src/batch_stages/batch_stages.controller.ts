import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { BatchStagesService } from './batch_stages.service';
import { CreateBatchStageDto } from './dto/create-batch_stage.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('batch-stages')
@UseGuards(JwtAuthGuard)
export class BatchStagesController {
  constructor(private readonly batchStagesService: BatchStagesService) {}

  @Post()
  create(@Body() createBatchStageDto: CreateBatchStageDto) {
    return this.batchStagesService.create(createBatchStageDto);
  }

}
