import { IsString, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateBatchDto {
  @IsString()
  @IsNotEmpty()
  batch_number: string;

  @IsNumber()
  @IsNotEmpty()
  initialTotalWeight: number;

  @IsNumber()
  @IsNotEmpty()
  initialPigWeight: number;

  @IsUUID()
  @IsNotEmpty()
  companyId: string; // Recibimos el UUID de la empresa
}