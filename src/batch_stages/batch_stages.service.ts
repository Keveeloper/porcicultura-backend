import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateBatchStageDto } from './dto/create-batch_stage.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BatchStage } from './entities/batch_stage.entity';
import { Repository } from 'typeorm';
import { BatchStageStatus } from './entities/types';
import { ShowMetricsDto } from './dto/show-metrics.dto';

@Injectable()
export class BatchStagesService {
  constructor(
    @InjectRepository(BatchStage)
    private readonly batchStageRepository: Repository<BatchStage>,
    // private showMetricsDto: ShowMetricsDto
  ) {}

  async getBatchStagesByBatchId(batchId: string) {
    const batcheStages = await this.batchStageRepository.find({where: {batch: { id: batchId }}});
    return batcheStages;
  }

  async getOneBatchStage(batchId: string, batchStageId: string) {
    const batcheStages = await this.batchStageRepository.findOne({
      where: {
        batch: { id: batchId },
        id: batchStageId
      },
      relations: ['dailyMeals', 'batch']
    });
    return batcheStages;
  }

  async getBatchStageMetrics(batchId: string, batchStageId: string) {
    // Obtenemos la etapa con todos sus registros históricos
    const batchStage = await this.getOneBatchStage(batchId, batchStageId)

    if (batchStage) {

      // Cálculos de acumulados (Como en tu imagen de Excel)
      const totals = batchStage.dailyMeals.reduce((acc, curr) => {
        acc.feed += Number(curr.feed_kg);
        acc.deaths += curr.mortality;
        return acc;
      }, { feed: 0, deaths: 0 });
      const currentPigs = batchStage.initial_pigs - totals.deaths;
      // Peso total ganado (Simulación: asumiendo que el peso final se actualiza en la etapa)
      const weightGain = batchStage.final_batch_weight
        ? Number(batchStage.final_batch_weight) - Number(batchStage.initial_batch_weight)
        : 0;
      const cumulative_feed_pig = (Number(totals.feed.toFixed(2)) / currentPigs);
      const metrics = new ShowMetricsDto(
        totals.feed.toFixed(2),
        totals.deaths,
        ((totals.deaths / batchStage.initial_pigs) * 100).toFixed(2),
        cumulative_feed_pig.toFixed(2),
        currentPigs,
        weightGain > 0 ? (totals.feed / weightGain).toFixed(2) : "0.00"
      );

        return {
          ...batchStage,
          metrics
          // metrics: {
          //   cumulative_feed: totals.feed.toFixed(2),
          //   cumulative_mortality: totals.deaths,
          //   mortality_percentage: ((totals.deaths / batchStage.initial_pigs) * 100).toFixed(2),
          //   current_pig_balance: currentPigs,
          //   // FCR = Alimento total / Ganancia de peso
          //   fcr: weightGain > 0 ? (totals.feed / weightGain).toFixed(2) : "0.00"
          // }
        };
    }
    throw new BadRequestException('Batch stage does not exists');
  }

  async create(createBatchStageDto: CreateBatchStageDto) {
    const { batchId, stage_type } = createBatchStageDto;

    const existingBatchStage = await this.batchStageRepository.findOne({
      where: {
        batch: { id: batchId },
        stage_type: stage_type,
      },
    });

    if (existingBatchStage) {
      throw new BadRequestException(
        `The stage ${stage_type} has already been created for this batch.`,
      );
    }

    try {
      const start_date = new Date(createBatchStageDto.start_date);
      const number_of_weeks = createBatchStageDto.number_of_weeks;
      const end_date = new Date(
        start_date.getTime() + number_of_weeks * 7 * 24 * 60 * 60 * 1000,
      );
      createBatchStageDto['end_date'] = end_date;
      const newBatchStage = this.batchStageRepository.create({
        ...createBatchStageDto,
        end_date: end_date,
        batch: { id: batchId }
      });

      return await this.batchStageRepository.save(newBatchStage);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getBatchStageById(id: string){
    const existingBatchStage = await this.batchStageRepository.findOne({
      where: {id},
    });
    if (!existingBatchStage) {
      throw new NotFoundException(`BatchStage with ID ${id} not found`);
    }
    return existingBatchStage;
  }

  async updateStatus(id: string, status: BatchStageStatus){
    const batchStage = await this.getBatchStageById(id);
    try {
      batchStage.status = status;
      return await this.batchStageRepository.save(batchStage);
    } catch (error) {
      throw new InternalServerErrorException( error.message);
    }
  }

}
