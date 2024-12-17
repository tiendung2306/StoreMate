import { IsOptional, IsString, IsUrl } from "class-validator";

export class CreateCategoryDto {
    @IsString()
    title: string;

    @IsOptional()
    @IsUrl()
    image: string;

    @IsOptional()
    @IsString()
    description: string;
}
