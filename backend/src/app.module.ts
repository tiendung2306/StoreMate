import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { BillModule } from './bill/bill.module';
import { ProductModule } from './product/product.module';
import { BillProductService } from './bill-product/bill-product.service';
import { BillProductModule } from './bill-product/bill-product.module';
import { UploadModule } from './upload/upload.module';
import { AuthModule } from './auth/auth.module';
import { LocalStrategy } from './auth/strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, BillModule, ProductModule, BillProductModule, UploadModule, AuthModule, PassportModule],
  controllers: [AppController],
  providers: [AppService, LocalStrategy, AuthService, UserService, PrismaService],
})
export class AppModule { }