import { IsDateString, IsInt, IsNumber, IsOptional, IsString, IsUUID, Min } from "class-validator";

export class CreateDailyMealDto {
  @IsUUID()
  batch_stage_id: string;

  @IsDateString()
  date: string;

  @IsNumber()
  @Min(0)
  feed_kg: number;

  @IsInt()
  @Min(0)
  mortality: number;

  @IsOptional()
  @IsString()
  observations: string;
}
