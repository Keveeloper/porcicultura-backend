import { Controller, Post, Body, UseGuards, Get, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
import { BatchStagesService } from './batch_stages.service';
import { CreateBatchStageDto } from './dto/create-batch_stage.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { DailyMealsService } from 'src/daily_meals/daily_meals.service';

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

  // @Get('/batch/:batchId/batch-stage/:batchStageId')
  // async getOneBatchStage(
  //   @Param('batchId') batchId: string,
  //   @Param('batchStageId') batchStageId: string,
  //   @Res() res: Response // <--- Inyectamos la respuesta nativa
  // ): Promise<any> {
  //   // Llamamos al servicio que calcula las métricas
  //   const data = await this.dailyMealsService.getBatchStageMetrics(batchId, batchStageId);

  //   // IMPORTANTE: res.json() envía el objeto "crudo" al navegador
  //   // Esto ignora el ClassSerializerInterceptor por completo
  //   return res.status(200).json(data);
  // }

  @Get('/batch/:batchId')
  getAllBatchStages(@Param('batchId') batchId: string){
    return this.batchStagesService.getBatchStagesByBatchId(batchId);
  }

  @Post()
  create(@Body() createBatchStageDto: CreateBatchStageDto) {
    return this.batchStagesService.create(createBatchStageDto);
  }

}
