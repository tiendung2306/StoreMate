import { IsNumber, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateProductDto {
    @IsString()
    name: string;

    @IsNumber()
    category_id: number;

    @IsNumber()
    price: number;

    @IsOptional()
    @IsUrl()
    image?: string;

    @IsOptional()
    @IsString()
    descripton?: string;
}
