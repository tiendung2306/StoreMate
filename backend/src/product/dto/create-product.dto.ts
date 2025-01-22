import { IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsUrl({ require_tld: false })
  image?: string;

  @IsOptional()
  @IsString()
  descripton?: string;
}
