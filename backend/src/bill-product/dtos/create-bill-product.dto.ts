import { IsNumber } from "class-validator";

export class CreateBillProductDto {
    @IsNumber()
    bill_id: number;

    @IsNumber()
    product_id: number;

    @IsNumber()
    quantity: number;
}