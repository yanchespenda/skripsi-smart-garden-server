import { Test, TestingModule } from '@nestjs/testing';
import { AppCronService } from './app-cron.service';

describe('AppCronService', () => {
  let service: AppCronService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppCronService],
    }).compile();

    service = module.get<AppCronService>(AppCronService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
