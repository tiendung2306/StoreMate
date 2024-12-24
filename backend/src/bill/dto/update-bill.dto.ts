import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Status } from "../enums/status.enum";

export class UpdateBillDto {
    @IsOptional()
    @IsNumber()
    admin_id?: number;

    @IsOptional()
    @IsNumber()
    customer_id?: number;

    @IsOptional()
    @IsDateString()
    date?: Date;

    @IsOptional()
    @IsString()
    notes?: string;

    @IsOptional()
    @IsEnum(Status)
    status?: string;
}
