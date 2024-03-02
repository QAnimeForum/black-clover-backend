import { Test, TestingModule } from '@nestjs/testing';
import { HomeService } from './home.service';
import { ConfigModule } from '@nestjs/config';

describe('HomeService', () => {
  let service: HomeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [HomeService],
    }).compile();

    service = module.get<HomeService>(HomeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
