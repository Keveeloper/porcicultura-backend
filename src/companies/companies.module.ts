import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Company]), forwardRef(() => UsersModule)],
  exports: [CompaniesService, TypeOrmModule],
  controllers: [CompaniesController],
  providers: [CompaniesService],
})
export class CompaniesModule {}