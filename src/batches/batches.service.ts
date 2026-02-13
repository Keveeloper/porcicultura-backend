import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Batch } from './entities/batch.entity';
import { Repository } from 'typeorm';
import { CreateBatchDto } from './dtos/create-batch.dto';

@Injectable()
export class BatchesService {
    constructor(
        @InjectRepository(Batch)
        private readonly batchRepository: Repository<Batch>
    ){}

    async create(createBatchDto: CreateBatchDto) {
        const { batch_number, companyId } = createBatchDto;
        const existingBatch = await this.batchRepository.findOne({
            where: {
                batch_number,
                company: { id: companyId }
            }
        });
        if (existingBatch) {
            throw new BadRequestException(`The batch ${batch_number} already exists.`);
        }
        try {
            const newBatch = this.batchRepository.create({
                ...createBatchDto,
                company: { id: companyId }
            });
            return await this.batchRepository.save(newBatch);
        } catch (error) {
            throw new InternalServerErrorException('Error creating batch: ', error.message);
        }
    }
}
