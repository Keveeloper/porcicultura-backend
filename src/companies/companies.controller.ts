import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dtos/create-company.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  async completeRegistration(
    @Body() createCompanyDto: CreateCompanyDto,
    @Body('userId') userId: string, // En una app real, esto vendría del JWT decodificado
  ) {
    return this.companiesService.createAndAssign(userId, createCompanyDto);
  }
}