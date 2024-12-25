import { Body, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { AddCustomerDto } from './dtos/add-customer.dto';

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

    createUser(userBody: CreateUserDto) {
        return this.prisma.user.create({ data: userBody });
    }

    async addCustomer(addCustomerDto: AddCustomerDto) {
        const customer = await this.prisma.user.findFirst({ where: { phone: addCustomerDto.phone, role: 'CUSTOMER' } });
        if (!customer) {
            const data = {
                name: addCustomerDto.name || addCustomerDto.phone,
                phone: addCustomerDto.phone,
                role: UserRole.CUSTOMER,
                password: addCustomerDto.password || "123",
            }
            return this.prisma.user.create({ data: data });
        }
        return customer;
    }

    updateUserById(id: number, updateUserBody: UpdateUserDto) {
        return this.prisma.user.update({ where: { id }, data: updateUserBody });
    }

    deleteUserById(id: number) {
        return this.prisma.user.delete({ where: { id } });
    }
}
