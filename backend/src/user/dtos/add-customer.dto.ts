import { IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class AddCustomerDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    password?: string;

    @IsString()
    @IsPhoneNumber('VN')
    phone: string;
}