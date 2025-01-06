import { IsNotEmpty } from "class-validator";

export class UpdateUserPasswordDto {
    @IsNotEmpty()
    currentPassword: string;
    @IsNotEmpty()
    newPassword: string;
}