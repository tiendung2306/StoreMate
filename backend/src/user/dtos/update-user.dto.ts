import { IsNotEmpty, IsOptional, IsPhoneNumber, IsEnum } from 'class-validator';

export enum UserRole {
    ADMIN = 'ADMIN',
    CUSTOMER = 'CUSTOMER'
}

export class UpdateUserDto {
    @IsOptional()
    name?: string;

    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;

    @IsOptional()
    @IsPhoneNumber('VN')
    phone?: string;
}
