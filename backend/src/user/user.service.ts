import { Body, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

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

    updateUserById(id: number, updateUserBody: UpdateUserDto) {
        return this.prisma.user.update({ where: { id }, data: updateUserBody });
    }

    deleteUserById(id: number) {
        return this.prisma.user.delete({ where: { id } });
    }
}
