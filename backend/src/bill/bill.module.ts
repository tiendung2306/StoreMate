import { Module } from '@nestjs/common';
import { BillService } from './bill.service';
import { BillController } from './bill.controller';
import { PrismaService } from '../prisma.service';
import { BillProductModule } from 'src/bill-product/bill-product.module';
import { BillProductService } from 'src/bill-product/bill-product.service';

@Module({
  imports: [BillProductModule],
  controllers: [BillController],
  providers: [PrismaService, BillService, BillProductService],
})
export class BillModule {}
