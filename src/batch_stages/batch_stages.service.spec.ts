import { Test, TestingModule } from '@nestjs/testing';
import { BatchStagesService } from './batch_stages.service';

describe('BatchStagesService', () => {
  let service: BatchStagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BatchStagesService],
    }).compile();

    service = module.get<BatchStagesService>(BatchStagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
