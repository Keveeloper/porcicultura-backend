import { PartialType } from '@nestjs/mapped-types';
import { CreateBatchStageDto } from './create-batch_stage.dto';

export class UpdateBatchStageDto extends PartialType(CreateBatchStageDto) {}
