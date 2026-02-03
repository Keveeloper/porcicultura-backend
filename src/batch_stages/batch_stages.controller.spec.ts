import { Test, TestingModule } from '@nestjs/testing';
import { BatchStagesController } from './batch_stages.controller';
import { BatchStagesService } from './batch_stages.service';

describe('BatchStagesController', () => {
  let controller: BatchStagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BatchStagesController],
      providers: [BatchStagesService],
    }).compile();

    controller = module.get<BatchStagesController>(BatchStagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
