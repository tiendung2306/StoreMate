import { Body, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { AddCustomerDto } from './dtos/add-customer.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserPasswordDto } from './dtos/update-user-password.dto';


enum UserRole {
    ADMIN = 'ADMIN',
    CUSTOMER = 'CUSTOMER'
}

@Injectable()
export class UserService {

    constructor(private prisma: PrismaService) { }

    getAllUsers() {
        return this.prisma.user.findMany();
    }

    async getUserById(id: number) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        return user;
    }

    findUserByPhone(phone: string) {
        return this.prisma.user.findFirst({ where: { phone } });
    }

    createUser(userBody: CreateUserDto) {
        return this.prisma.user.create({ data: userBody });
    }

    async addCustomer(addCustomerDto: AddCustomerDto) {
        const customer = await this.prisma.user.findFirst({ where: { phone: addCustomerDto.phone, role: 'CUSTOMER' } });
        const saltOrRounds = 10;
        const hashedPassword = await bcrypt.hash(addCustomerDto.password || "123", saltOrRounds);
        if (!customer) {
            const data = {
                name: addCustomerDto.name || addCustomerDto.phone,
                phone: addCustomerDto.phone,
                role: UserRole.CUSTOMER,
                password: hashedPassword,
            }
            return this.prisma.user.create({ data: data });
        }
        return customer;
    }

    updateUserById(id: number, updateUserBody: UpdateUserDto) {
        return this.prisma.user.update({ where: { id }, data: updateUserBody });
    }

    async checkUserPassword(id: number, password: string) {
        const user = await this.prisma.user.findFirst({ where: { id } });
        if (!user) {
            return false;
        }
        return bcrypt.compare(password, user.password);
    }

    async updateUserPasswordById(id: number, updateUserPasswordDto: UpdateUserPasswordDto) {
        console.log(updateUserPasswordDto);
        if (! await this.checkUserPassword(id, updateUserPasswordDto.currentPassword)) {
            throw new Error('Current password is incorrect');
        }
        const hashedPassword = bcrypt.hashSync(updateUserPasswordDto.newPassword, 10);
        return this.prisma.user.update({ where: { id }, data: { password: hashedPassword } });
    }

    deleteUserById(id: number) {
        return this.prisma.user.delete({ where: { id } });
    }
}
