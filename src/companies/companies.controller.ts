import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
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
    @CurrentUser() user: { userId: string },
    // @Body('userId') userId: string, // En una app real, esto vendría del JWT decodificado
  ) {
    return this.companiesService.createAndAssignUser(user.userId, createCompanyDto);
  }
}