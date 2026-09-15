import { Test, TestingModule } from '@nestjs/testing';
import { CutoffService } from './cutoff.service';

describe('CutoffService', () => {
  let service: CutoffService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CutoffService],
    }).compile();

    service = module.get<CutoffService>(CutoffService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
