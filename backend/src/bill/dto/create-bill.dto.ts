import { IsDateString, IsNumber } from "class-validator";

export class CreateBillDto {
    @IsNumber()
    admin_id: number;
    @IsNumber()
    customer_id: number;

    @IsDateString()
    date: Date;
}
