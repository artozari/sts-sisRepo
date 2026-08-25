import { Test, TestingModule } from '@nestjs/testing';
import { GamesByDateService } from './games-by-date.service';

describe('GamesByDateService', () => {
  let service: GamesByDateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GamesByDateService],
    }).compile();

    service = module.get<GamesByDateService>(GamesByDateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
