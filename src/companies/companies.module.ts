import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';

@Module({
  imports: [TypeOrmModule.forFeature([Company])],
  exports: [TypeOrmModule],
  controllers: [CompaniesController],
  providers: [CompaniesService], // Exportamos para que otros módulos vean la entidad Company
})
export class CompaniesModule {}