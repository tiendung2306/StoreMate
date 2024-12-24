import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }


  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll(@Query('searchContent') searchContent?: string, @Query('priceFrom', ParseIntPipe) priceFrom?: number, @Query('priceTo', ParseIntPipe) priceTo?: number, @Query('page') page?: string, @Query('limit') take?: string) {
    if (searchContent === undefined) searchContent = "";
    if (!!page && !take) {
      throw new Error('You must provide the "take" query parameter if you provide the "page" query parameter');
    }
    return this.productService.findAll(searchContent, priceFrom, priceTo, +page, +take);
  }

  @Get('search')
  search(@Query('searchContent') searchContent: string) {
    return this.productService.search(searchContent);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }


}
