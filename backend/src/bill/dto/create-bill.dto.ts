import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Status } from "../enums/status.enum";

export class CreateBillDto {
    @IsNumber()
    admin_id: number;

    @IsNumber()
    customer_id: number;

    @IsDateString()
    date: Date;

    @IsOptional()
    @IsString()
    notes?: string;

    @IsEnum(Status)
    status: string;
}
