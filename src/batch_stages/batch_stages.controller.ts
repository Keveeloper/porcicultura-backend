import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { BatchStagesService } from './batch_stages.service';
import { CreateBatchStageDto } from './dto/create-batch_stage.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('batch-stages')
@UseGuards(JwtAuthGuard)
export class BatchStagesController {
  constructor(private readonly batchStagesService: BatchStagesService) {}

  @Get('/batch/:batchId/batch-stage/:batchStageId')
  getOneBatchStage(
    @Param('batchId',) batchId: string,
    @Param('batchStageId',) batchStageId: string,
  ){
    return this.batchStagesService.getOneBatchStage(batchId, batchStageId);
  }

  @Get('/batch/:batchId')
  getAllBatchStages(@Param('batchId') batchId: string){
    return this.batchStagesService.getBatchStagesByBatchId(batchId);
  }

  @Post()
  create(@Body() createBatchStageDto: CreateBatchStageDto) {
    return this.batchStagesService.create(createBatchStageDto);
  }

}
