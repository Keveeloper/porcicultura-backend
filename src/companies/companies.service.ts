import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createAndAssignUser(userId: string, createCompanyDto: CreateCompanyDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    try {
      const newCompany = this.companyRepository.create(createCompanyDto);
      const savedCompany = await this.companyRepository.save(newCompany);

      user.company = savedCompany;
      await this.userRepository.save(user);

      return {
        message: 'Company created and related successfully',
        company: savedCompany,
      };
    } catch (error) {
      // Capturamos el código de error de Postgres (23505)
      if (error.code === '23505') {
        // ConflictException devuelve un error 409, que es el correcto para duplicados
        throw new ConflictException({
          statusCode: 409,
          message: 'The company name or identifier is already in use',
          error: 'Conflict',
        });
      }

      // Si es cualquier otro error, lanzamos un 500 genérico para no exponer la DB
      throw new InternalServerErrorException('An unexpected error occurred', error.message);
    }
  }

}
