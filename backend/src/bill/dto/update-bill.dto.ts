import { IsDateString, IsNumber, IsOptional } from "class-validator";

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
}
