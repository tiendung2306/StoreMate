import { Injectable } from '@nestjs/common';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { PrismaService } from 'src/prisma.service';
import { BillProductService } from 'src/bill-product/bill-product.service';

@Injectable()
export class BillService {

  constructor(private prisma: PrismaService, private billProduct: BillProductService) { }

  async create(createBillDto: CreateBillDto) {
    const admin = await this.prisma.user.findUnique({ where: { id: +createBillDto.admin_id, role: 'ADMIN' } });
    const customer = await this.prisma.user.findUnique({ where: { id: +createBillDto.customer_id, role: 'CUSTOMER' } });
    if (!admin || !customer) {
      throw new Error('Admin or customer not found');
    }
    return this.prisma.bill.create({ data: createBillDto });
  }

  findAll() {
    return this.prisma.bill.findMany();
  }

  findOne(id: number) {
    return this.prisma.bill.findUnique({ where: { id } });
  }

  async update(id: number, updateBillDto: UpdateBillDto) {
    const admin = !!updateBillDto.admin_id && await this.prisma.user.findUnique({ where: { id: +updateBillDto.admin_id, role: 'ADMIN' } });
    const customer = !!updateBillDto.customer_id && await this.prisma.user.findUnique({ where: { id: +updateBillDto.customer_id, role: 'CUSTOMER' } });
    if ((!!updateBillDto.admin_id && !admin) || (!!updateBillDto.customer_id && !customer)) {
      throw new Error('Admin or customer not found');
    }
    return this.prisma.bill.update({ where: { id }, data: updateBillDto });
  }

  remove(id: number) {
    return this.prisma.bill.delete({ where: { id } });
  }

  addProductToBill(bill_id: number, product_id: number, quantity: number) {
    return this.billProduct.addProductToBill(bill_id, product_id, quantity);
  }

  removeProductFromBill(bill_id: number, product_id: number, quantity: number) {
    return this.billProduct.removeProductFromBill(bill_id, product_id, quantity);
  }

  async calculateNumberOfProduct(bill_id: number) {
    const result = await this.prisma.billProduct.aggregate({
      where: { bill_id },
      _sum: { quantity: true }
    });
    return result._sum.quantity;
  }

  async calculateTotalPrice(bill_id: number) {
    const billProducts = await this.prisma.billProduct.findMany({ where: { bill_id } });
    let total = 0;
    for (const billProduct of billProducts) {
      const product = await this.prisma.product.findUnique({ where: { id: billProduct.product_id } });
      total += billProduct.quantity * product.price;
    }
    return total;
  }
}
