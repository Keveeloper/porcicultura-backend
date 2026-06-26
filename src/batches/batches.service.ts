import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Batch } from './entities/batch.entity';
import { DailyMeal } from 'src/daily_meals/entities/daily_meal.entity';
import { Repository } from 'typeorm';
import { CreateBatchDto } from './dtos/create-batch.dto';
import { FinalReportDto, FeedConsumptionRow } from './dtos/final-report.dto';
import { BatchStageType } from 'src/batch_stages/entities/types';
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
      relations: ['company', 'stages'],
    });
    if (!batch) {
      throw new NotFoundException(`Batch with ID ${batchId} not found`);
    }

    // Fecha de ingreso (F-INGRESO) = primer día de alimentación del lote = MIN(date)
    // Fecha de salida   (F-SALIDA)  = último día de alimentación del lote  = MAX(date)
    // Mortalidad total = SUM(mortality) de todos los daily_meals del lote.
    // Todo en una sola consulta agregada sobre los daily_meals de TODAS las etapas del lote.
    const aggregates = await this.dailyMealRepository
      .createQueryBuilder('dm')
      .innerJoin('dm.batchStage', 'stage')
      .where('stage.batch_id = :batchId', { batchId })
      .select('MIN(dm.date)', 'entry_date')
      .addSelect('MAX(dm.date)', 'exit_date')
      .addSelect('COALESCE(SUM(dm.mortality), 0)', 'total_mortality')
      .getRawOne<{ entry_date: string | null; exit_date: string | null; total_mortality: string }>();

    const entry_date = aggregates?.entry_date ?? null;
    const exit_date = aggregates?.exit_date ?? null;

    // DIAS = exit_date - entry_date (en días). Las fechas son 'YYYY-MM-DD' (UTC),
    // por lo que la diferencia en milisegundos / 86400000 da días enteros exactos.
    const days =
      entry_date && exit_date
        ? Math.round(
            (new Date(exit_date).getTime() - new Date(entry_date).getTime()) /
              (1000 * 60 * 60 * 24),
          )
        : null;

    // No INICIAL DE CERDOS = initial_pigs de la primera etapa del lote (menor start_date, normalmente PRE-NURSERY).
    const firstStage = [...(batch.stages ?? [])].sort(
      (a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime(),
    )[0];
    const initial_pigs = firstStage ? firstStage.initial_pigs : null;

    // MORTALIDAD = total de cerdos muertos = SUM(daily_meals.mortality).
    const mortality = Number(aggregates?.total_mortality ?? 0);

    // No FINAL DE CERDOS = inicial - mortalidad total acumulada.
    const final_pigs = initial_pigs !== null ? initial_pigs - mortality : null;

    // % MORTALIDAD LOTE = mortalidad / inicial * 100 (redondeado a 2 decimales).
    const mortality_percentage =
      initial_pigs && initial_pigs > 0
        ? Math.round((mortality / initial_pigs) * 100 * 100) / 100
        : null;

    // CONSUMO ALIMENTO por etapa, en orden: PRE-NURSERY, GROWING, FINISHING.
    // DIAS    = número de días con registro de alimentación en la etapa = COUNT de daily_meals.
    // KILOS   = consumo total de alimento de la etapa = SUM(feed_kg).
    // C/CERDO = kilos de la etapa / cerdos finales del lote.
    // C/DIA   = consumo por cerdo / días de la etapa.
    const feed_consumption: FeedConsumptionRow[] = [];
    const stageOrder = [
      BatchStageType.PRE_NURSERY,
      BatchStageType.GROWING,
      BatchStageType.FINISHING,
    ];
    for (const stageType of stageOrder) {
      const stage = batch.stages?.find((s) => s.stage_type === stageType);
      if (!stage) continue;

      const consumption = await this.dailyMealRepository
        .createQueryBuilder('dm')
        .where('dm.batch_stage_id = :stageId', { stageId: stage.id })
        .select('COUNT(*)', 'days')
        .addSelect('COALESCE(SUM(dm.feed_kg), 0)', 'kilos')
        .getRawOne<{ days: string; kilos: string }>();

      const days = Number(consumption?.days ?? 0);
      const kilos = Number(consumption?.kilos ?? 0);

      const feed_per_pig =
        final_pigs && final_pigs > 0
          ? Math.round((kilos / final_pigs) * 100) / 100
          : null;

      const feed_per_day =
        feed_per_pig !== null && days > 0
          ? Math.round((feed_per_pig / days) * 100) / 100
          : null;

      feed_consumption.push({
        stage: stageType,
        days,
        kilos,
        feed_per_pig,
        feed_per_day,
      });
    }

    return {
      farm_name: batch.company?.name ?? null,
      batch_number: batch.batch_number,
      entry_date,
      exit_date,
      days,
      initial_pigs,
      final_pigs,
      mortality,
      mortality_percentage,
      feed_consumption,
    };
  }

}
