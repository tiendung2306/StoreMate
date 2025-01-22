import { Module } from '@nestjs/common';
import { BillProductService } from './bill-product.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [PrismaService, BillProductService],
})
export class BillProductModule {}
