import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProductService {
  isNumeric(str: string) {
    if (typeof str != 'string') return false; // we only process strings!
    return (
      !isNaN(Number(str)) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
      !isNaN(parseFloat(str))
    ); // ...and ensure strings of whitespace fail
  }

  constructor(private prisma: PrismaService) {}

  create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({ data: createProductDto });
  }

  async getMaxPrice() {
    const res = await this.prisma.product.findMany({
      orderBy: { price: 'desc' },
      take: 1,
      select: { price: true },
    });
    return res.length > 0 ? res[0].price : null;
  }

  async findAll(
    searchContent = '',
    priceFrom = -1,
    priceTo = -1,
    page?: number,
    take?: number,
  ) {
    //search o tab product
    const takeValue = take ? take : undefined;
    const skip = page ? page * take : undefined;
    if (priceTo === -1) {
      priceTo = undefined;
    }
    const res = await this.prisma.product.findMany({
      where: {
        name: { contains: searchContent },
        price: {
          gte: priceFrom,
          lte: priceTo,
        },
      },
      skip,
      take: takeValue,
      orderBy: { id: 'desc' },
    });
    const res_id = this.isNumeric(searchContent)
      ? await this.prisma.product.findMany({
          where: { id: { equals: Number(searchContent) } },
        })
      : [];

    return [...res_id, ...res];
  }

  async search(searchContent: string) {
    //search o tab bill
    console.log(searchContent);
    const res_id = this.isNumeric(searchContent)
      ? await this.prisma.product.findMany({
          where: { id: { equals: Number(searchContent) } },
        })
      : [];
    const results = [
      ...res_id,
      ...(await this.prisma.product.findMany({
        where: { name: { contains: searchContent } },
        take: 10,
      })),
    ];

    return results;
  }

  findOne(id: number) {
    return this.prisma.product.findUnique({ where: { id } });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  remove(id: number) {
    return this.prisma.product.delete({ where: { id } });
  }
}
