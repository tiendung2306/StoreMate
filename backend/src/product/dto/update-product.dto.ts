import { IsNumber, IsOptional, IsString, IsUrl } from "class-validator";

export class UpdateProductDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsNumber()
    category_id: number;

    @IsOptional()
    @IsNumber()
    price?: number;

    @IsOptional()
    @IsUrl()
    image?: string;

    @IsOptional()
    @IsString()
    descripton?: string;
}