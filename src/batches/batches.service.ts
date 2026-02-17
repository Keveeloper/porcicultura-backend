import { BadRequestException, Injectable, InternalServerErrorException, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Batch } from './entities/batch.entity';
import { Repository } from 'typeorm';
import { CreateBatchDto } from './dtos/create-batch.dto';
import { UsersService } from 'src/users/users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Injectable()
@UseGuards(JwtAuthGuard)
export class BatchesService {
    constructor(
        @InjectRepository(Batch)
        private readonly batchRepository: Repository<Batch>,
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

}
