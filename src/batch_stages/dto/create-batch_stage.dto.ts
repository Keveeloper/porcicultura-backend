import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsUUID } from "class-validator";
import { BatchStageType } from "../entities/types";

export class CreateBatchStageDto {

  @IsUUID()
  @IsNotEmpty()
  batchId: string;

  @IsEnum(BatchStageType)
  stage_type: BatchStageType;

  @IsDate()
  @IsNotEmpty()
  start_date: Date;

  @IsNumber()
  @IsNotEmpty()
  number_of_weeks: number;

  @IsNumber()
  @IsNotEmpty()
  initial_pigs: number;

  @IsNumber()
  @IsNotEmpty()
  initial_batch_weight: number;

  @IsNumber()
  @IsNotEmpty()
  initial_pig_weight: number;

}
