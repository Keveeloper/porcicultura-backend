import { Controller, Post, Body, UseGuards, Get, Param, Patch } from '@nestjs/common';
import { BatchStagesService } from './batch_stages.service';
import { CreateBatchStageDto } from './dto/create-batch_stage.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { DailyMealsService } from 'src/daily_meals/daily_meals.service';
import { UpdateBatchStageDto } from './dto/update-batch_stage.dto';

@Controller('batch-stages')
@UseGuards(JwtAuthGuard)
export class BatchStagesController {
  constructor(
    private readonly batchStagesService: BatchStagesService,
    private readonly dailyMealsService: DailyMealsService
  ) {}

  @Get('/batch/:batchId/batch-stage/:batchStageId')
  getOneBatchStage(
    @Param('batchId',) batchId: string,
    @Param('batchStageId',) batchStageId: string,
  ){
    return this.batchStagesService.getBatchStageMetrics(batchId, batchStageId);
  }

  @Get('/batch/:batchId')
  getAllBatchStages(@Param('batchId') batchId: string){
    return this.batchStagesService.getBatchStagesByBatchId(batchId);
  }

  @Post()
  create(@Body() createBatchStageDto: CreateBatchStageDto) {
    return this.batchStagesService.create(createBatchStageDto);
  }

  @Patch('/batch/:batchId/batch-stage/:stageId/finish-stage')
  finishStage(
    @Param('batchId') batchId: string,
    @Param('stageId') stageId: string,
    @Body() updateBatchStageDto: UpdateBatchStageDto
  ) {
    return this.batchStagesService.finishStage(batchId, stageId, updateBatchStageDto);
  }

}
