import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateBatchStageDto } from './dto/create-batch_stage.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BatchStage } from './entities/batch_stage.entity';
import { Repository } from 'typeorm';
import { BatchStageStatus } from './entities/types';

@Injectable()
export class BatchStagesService {
  constructor(
    @InjectRepository(BatchStage)
    private readonly batchStageRepository: Repository<BatchStage>,
  ) {}

  async getBatchStagesByBatchId(batchId: string) {
    const batcheStages = await this.batchStageRepository.find({where: {batch: { id: batchId }}});
    return batcheStages;
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
