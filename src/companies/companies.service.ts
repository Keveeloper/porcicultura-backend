import { Injectable, NotFoundException } from '@nestjs/common';
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

  async createAndAssign(userId: string, createCompanyDto: CreateCompanyDto) {
    // 1. Verificar si el usuario existe
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    // 2. Crear la nueva empresa
    const newCompany = this.companyRepository.create(createCompanyDto);
    const savedCompany = await this.companyRepository.save(newCompany);

    // 3. Vincular la empresa al usuario
    user.company = savedCompany;
    await this.userRepository.save(user);

    return {
      message: 'Compañía creada y vinculada con éxito',
      company: savedCompany,
    };
  }
}