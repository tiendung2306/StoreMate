import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Put, Query } from '@nestjs/common';
import { BillService } from './bill.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { AddBillDto } from './dto/add-bill.dto';
import { UpdateAddBillDto } from './dto/update-add-bill.dto';

@Controller('bill')
export class BillController {
  constructor(private readonly billService: BillService) { }

  @Post()
  create(@Body() createBillDto: CreateBillDto) {
    return this.billService.create(createBillDto);
  }

  @Post('add-bill')
  addBill(@Body() addBillDto: AddBillDto) {
    return this.billService.addBill(addBillDto);
  }

  @Put('update-bill')
  updateBill(@Body() updateAddBillDto: UpdateAddBillDto) {
    return this.billService.updateBill(updateAddBillDto);
  }

  @Get()
  findAll() {
    return this.billService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.billService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateBillDto: UpdateBillDto) {
    return this.billService.update(id, updateBillDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.billService.remove(id);
  }

  @Get(':bill_id/get-products')
  getProductsByBillId(@Param('bill_id', ParseIntPipe) bill_id: number) {
    return this.billService.getProductsByBillId(bill_id);
  }

  @Patch(':bill_id/add-product/:product_id')
  addProductToBill(@Param('bill_id', ParseIntPipe) bill_id: number, @Param('product_id', ParseIntPipe) product_id: number, @Body('quantity', ParseIntPipe) quantity: number) {
    return this.billService.addProductToBill(bill_id, product_id, quantity);
  }

  @Patch(':bill_id/remove-product/:product_id')
  removeProductFromBill(@Param('bill_id', ParseIntPipe) bill_id: number, @Param('product_id', ParseIntPipe) product_id: number, @Body('quantity', ParseIntPipe) quantity: number) {
    return this.billService.removeProductFromBill(bill_id, product_id, quantity);
  }

  @Get(':bill_id/number-of-products')
  calculateNumberOfProduct(@Param('bill_id', ParseIntPipe) bill_id: number) {
    return this.billService.calculateNumberOfProduct(bill_id);
  }

  @Get(':bill_id/total-price')
  calculateTotalPrice(@Param('bill_id', ParseIntPipe) bill_id: number) {
    return this.billService.calculateTotalPrice(bill_id);
  }

  @Get(':user_id/get-bills')
  getBillsByUserId(@Param('user_id', ParseIntPipe) user_id: number, @Query('page') page?: string, @Query('limit') take?: string) {
    if (!!page && !take) {
      throw new Error('You must provide the "take" query parameter if you provide the "page" query parameter');
    }
    console.log(user_id, page, take);
    return this.billService.getBillsByUserId(user_id, +page, + take);
  }
}
