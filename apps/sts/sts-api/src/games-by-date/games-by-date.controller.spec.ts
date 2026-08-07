import { Test, TestingModule } from '@nestjs/testing';
import { GamesByDateController } from './games-by-date.controller';
import { GamesByDateService } from './games-by-date.service';

describe('GamesByDateController', () => {
  let controller: GamesByDateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GamesByDateController],
      providers: [GamesByDateService],
    }).compile();

    controller = module.get<GamesByDateController>(GamesByDateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
