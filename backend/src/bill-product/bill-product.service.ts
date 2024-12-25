import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateBillProductDto } from './dtos/create-bill-product.dto';

@Injectable()
export class BillProductService {

    constructor(private prisma: PrismaService) { }

    getAllBillProducts() {
        return this.prisma.billProduct.findMany();
    }

    getBillProductsById(id: number) {
        return this.prisma.billProduct.findUnique({ where: { id } });
    }

    getBillProductsByBillId(bill_id: number) {
        return this.prisma.billProduct.findMany({ where: { bill_id } });
    }

    createBillProduct(createBillProductDto: CreateBillProductDto) {
        return this.prisma.billProduct.create({ data: createBillProductDto });
    }

    async addProductToBill(bill_id: number, product_id: number, quantity: number) {
        const billProduct = await this.prisma.billProduct.findFirst({ where: { bill_id, product_id } });
        if (!billProduct) {
            const newBillProduct = await this.createBillProduct({ bill_id, product_id, quantity });
            return newBillProduct;
        }
        return this.prisma.billProduct.update({ where: { id: billProduct.id }, data: { quantity: quantity } });
    }

    async removeProductFromBill(bill_id: number, product_id: number, quantity: number) {
        const billProduct = await this.prisma.billProduct.findFirst({ where: { bill_id, product_id } });
        billProduct.quantity -= quantity;
        if (billProduct.quantity <= 0) {
            return this.prisma.billProduct.deleteMany({ where: { bill_id, product_id } });
        }
        return this.prisma.billProduct.update({ where: { id: billProduct.id }, data: { quantity: billProduct.quantity } });
    }
}
