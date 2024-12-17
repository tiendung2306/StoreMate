import { Test, TestingModule } from '@nestjs/testing';
import { BillProductService } from './bill-product.service';

describe('BillProductService', () => {
  let service: BillProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BillProductService],
    }).compile();

    service = module.get<BillProductService>(BillProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
