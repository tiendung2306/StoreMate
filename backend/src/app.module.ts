import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { BillModule } from './bill/bill.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { BillProductService } from './bill-product/bill-product.service';
import { BillProductModule } from './bill-product/bill-product.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, BillModule, ProductModule, CategoryModule, BillProductModule, UploadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }