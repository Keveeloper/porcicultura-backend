import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateBatchDto } from './dtos/create-batch.dto';
import { BatchesService } from './batches.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('batches')
@UseGuards(JwtAuthGuard)
export class BatchesController {
    constructor(
        private readonly batchService: BatchesService
    ){}

    @Post()
    create(
      @Body() CreateBatchDto: CreateBatchDto,
      @CurrentUser() user: User
    ){
        return this.batchService.create(CreateBatchDto, user.id);
    }

    @Get()
    getAllBatches(
      @CurrentUser() user: User
    ) {
      console.log('User logged: ', user);

      return this.batchService.getAllBatches(user.id);
    }
}
