import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsString,
} from 'class-validator';
import { Status } from '../enums/status.enum';

class Product {
  @IsNumber()
  product_id: number;
  @IsNumber()
  quantity: number;
}

export class AddBillDto {
  @IsNumber()
  admin_id: number;
  @IsNumber()
  customer_id: number;

  @IsDateString()
  date: Date;

  @IsString()
  notes: string;

  @IsEnum(Status)
  status: string;

  @IsArray()
  products: Product[];
}
