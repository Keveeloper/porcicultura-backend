import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateBatchDto {
  @IsString()
  @IsNotEmpty()
  batch_number: string;

  @IsUUID()
  @IsNotEmpty()
  companyId: string; // Recibimos el UUID de la empresa
}
