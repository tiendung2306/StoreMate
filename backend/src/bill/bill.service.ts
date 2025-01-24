import { Injectable } from '@nestjs/common';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { PrismaService } from 'src/prisma.service';
import { BillProductService } from 'src/bill-product/bill-product.service';
import { AddBillDto } from './dto/add-bill.dto';
import { Prisma } from '@prisma/client';
import { Status } from './enums/status.enum';
import { UpdateAddBillDto } from './dto/update-add-bill.dto';
import { omit } from 'lodash';

@Injectable()
export class BillService {
  constructor(
    private prisma: PrismaService,
    private billProduct: BillProductService,
    // eslint-disable-next-line prettier/prettier
  ) { }

  async create(createBillDto: CreateBillDto) {
    // Validate admin and customer roles
    const admin = await this.prisma.user.findUnique({
      where: { id: +createBillDto.admin_id },
    });

    const customer = await this.prisma.user.findUnique({
      where: { id: +createBillDto.customer_id },
    });

    if (!admin || admin.role !== 'ADMIN') {
      throw new Error('Admin not found or invalid role');
    }

    if (!customer || customer.role !== 'CUSTOMER') {
      throw new Error('Customer not found or invalid role');
    }

    const data: Prisma.BillCreateInput = {
      admin: { connect: { id: createBillDto.admin_id } },
      customer: { connect: { id: createBillDto.customer_id } },
      date: createBillDto.date,
      notes: createBillDto.notes,
      status: createBillDto.status as Status, // Cast to Status enum
    };

    return this.prisma.bill.create({ data });
  }

  findAll() {
    return this.prisma.bill.findMany({ orderBy: { date: 'desc' } });
  }

  findOne(id: number) {
    return this.prisma.bill.findUnique({ where: { id } });
  }

  getBillsByUserId(user_id: number, page: number, take: number) {
    const takeValue = take ? take : undefined;
    const skip = page ? page * take : undefined;
    console.log(takeValue, skip);
    return this.prisma.bill.findMany({
      where: { customer_id: user_id },
      skip,
      take: takeValue,
      orderBy: { date: 'desc' },
    });
  }

  async addBill(addBillDto: AddBillDto) {
    console.log(addBillDto);
    const bill = await this.create(omit(addBillDto, 'products'));
    for (const product of addBillDto.products) {
      await this.addProductToBill(
        bill.id,
        product.product_id,
        product.quantity,
      );
    }
    return {
      bill: await this.findOne(bill.id),
      products: await this.billProduct.getBillProductsByBillId(bill.id),
    };
  }

  async getProductsByBillId(bill_id: number) {
    return {
      bill: await this.findOne(bill_id),
      products: await this.billProduct.getBillProductsByBillId(bill_id),
    };
  }

  async updateBill(updateAddBillDto: UpdateAddBillDto) {
    for (const product of updateAddBillDto.products) {
      await this.addProductToBill(
        updateAddBillDto.id,
        product.product_id,
        product.quantity,
      );
    }
  }

  async update(id: number, updateBillDto: UpdateBillDto) {
    const admin =
      !!updateBillDto.admin_id &&
      (await this.prisma.user.findUnique({
        where: { id: +updateBillDto.admin_id, role: 'ADMIN' },
      }));
    const customer =
      !!updateBillDto.customer_id &&
      (await this.prisma.user.findUnique({
        where: { id: +updateBillDto.customer_id, role: 'CUSTOMER' },
      }));
    if (
      (!!updateBillDto.admin_id && !admin) ||
      (!!updateBillDto.customer_id && !customer)
    ) {
      throw new Error('Admin or customer not found');
    }

    const data: Prisma.BillCreateInput = {
      admin: { connect: { id: updateBillDto.admin_id } },
      customer: { connect: { id: updateBillDto.customer_id } },
      date: updateBillDto.date,
      notes: updateBillDto.notes,
      status: updateBillDto.status as Status, // Cast to Status enum
    };

    return this.prisma.bill.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.bill.delete({ where: { id } });
  }

  addProductToBill(bill_id: number, product_id: number, quantity: number) {
    return this.billProduct.addProductToBill(bill_id, product_id, quantity);
  }

  removeProductFromBill(bill_id: number, product_id: number, quantity: number) {
    return this.billProduct.removeProductFromBill(
      bill_id,
      product_id,
      quantity,
    );
  }

  async calculateNumberOfProduct(bill_id: number) {
    const result = await this.prisma.billProduct.aggregate({
      where: { bill_id },
      _sum: { quantity: true },
    });
    return result._sum.quantity;
  }

  async calculateTotalPrice(bill_id: number) {
    const billProducts = await this.prisma.billProduct.findMany({
      where: { bill_id },
    });
    let total = 0;
    for (const billProduct of billProducts) {
      const product = await this.prisma.product.findUnique({
        where: { id: billProduct.product_id },
      });
      total += billProduct.quantity * product.price;
    }
    return total;
  }
}
