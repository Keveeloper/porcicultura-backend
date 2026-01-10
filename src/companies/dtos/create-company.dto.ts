import { IsString, IsNotEmpty, IsOptional, Length } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  nit: string;

  @IsString()
  @IsOptional()
  address?: string;
}