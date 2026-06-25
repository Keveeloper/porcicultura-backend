import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Batch } from './entities/batch.entity';
import { DailyMeal } from 'src/daily_meals/entities/daily_meal.entity';
import { Repository } from 'typeorm';
import { CreateBatchDto } from './dtos/create-batch.dto';
import { FinalReportDto } from './dtos/final-report.dto';
import { UsersService } from 'src/users/users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Injectable()
@UseGuards(JwtAuthGuard)
export class BatchesService {
    constructor(
        @InjectRepository(Batch)
        private readonly batchRepository: Repository<Batch>,
        @InjectRepository(DailyMeal)
        private readonly dailyMealRepository: Repository<DailyMeal>,
        private readonly userService: UsersService
    ){}

    async create(createBatchDto: CreateBatchDto, userId: string) {
      const user = await this.userService.getUserById(userId);
      if (!user.company) {
          throw new BadRequestException('The user does not have a related company');
      }
      const { batch_number } = createBatchDto;
      const existingBatch = await this.batchRepository.findOne({
          where: {
              batch_number,
              company: { id: user.company.id }
          }
      });
      if (existingBatch) {
          throw new BadRequestException(`The batch ${batch_number} already exists.`);
      }
      try {
          const newBatch = this.batchRepository.create({
              ...createBatchDto,
              company: user.company
          });
          return await this.batchRepository.save(newBatch);
      } catch (error) {
          throw new InternalServerErrorException('Error creating batch: ', error.message);
      }
    }

    async getAllBatches(userId: string) {
      const user = await this.userService.getUserById(userId);
      if (!user.company) {
          throw new BadRequestException('The user does not have a related company');
      }
      const batches = await this.batchRepository.find({
        where: {
          company: { id: user.company.id }
        },
        order: { createdAt: 'DESC' }
      });

      return batches;
  }

  // Informe final del lote (RESULTADO FINAL LOTE PORCINO).
  // Por ahora devuelve solo granja y número de lote; se irá ampliando paso a paso.
  async getFinalReport(batchId: string, userId: string): Promise<FinalReportDto> {
    const user = await this.userService.getUserById(userId);
    if (!user.company) {
      throw new BadRequestException('The user does not have a related company');
    }
    const batch = await this.batchRepository.findOne({
      where: {
        id: batchId,
        company: { id: user.company.id },
      },
      relations: ['company'],
    });
    if (!batch) {
      throw new NotFoundException(`Batch with ID ${batchId} not found`);
    }

    // Fecha de ingreso (F-INGRESO) = primer día de alimentación del lote = MIN(date)
    // Fecha de salida   (F-SALIDA)  = último día de alimentación del lote  = MAX(date)
    // Se calcula sobre los daily_meals de TODAS las etapas del lote en una sola consulta agregada.
    const dates = await this.dailyMealRepository
      .createQueryBuilder('dm')
      .innerJoin('dm.batchStage', 'stage')
      .where('stage.batch_id = :batchId', { batchId })
      .select('MIN(dm.date)', 'entry_date')
      .addSelect('MAX(dm.date)', 'exit_date')
      .getRawOne<{ entry_date: string | null; exit_date: string | null }>();

    return {
      farm_name: batch.company?.name ?? null,
      batch_number: batch.batch_number,
      entry_date: dates?.entry_date ?? null,
      exit_date: dates?.exit_date ?? null,
    };
  }

}
