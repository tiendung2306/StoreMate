import { IsNumber, IsOptional, IsString, IsUrl } from "class-validator";

export class UpdateProductDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsNumber()
    price?: number;

    @IsOptional()
    @IsUrl({ require_tld: false })
    image?: string;

    @IsOptional()
    @IsString()
    descripton?: string;
}