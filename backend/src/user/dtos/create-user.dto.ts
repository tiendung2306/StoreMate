import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

export enum UserRole {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
}

export class CreateUserDto {
  name: string;
  role: UserRole;
  @IsPhoneNumber('VN')
  phone: string;
  @IsNotEmpty()
  password: string;
}
