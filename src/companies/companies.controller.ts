import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async completeRegistration(
    @Body() createCompanyDto: CreateCompanyDto,
    @CurrentUser() user: { id: string },
  ) {
    return await this.companiesService.createAndAssignUser(user.id, createCompanyDto);
  }
}
