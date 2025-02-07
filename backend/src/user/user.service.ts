import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { AddCustomerDto } from './dtos/add-customer.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserPasswordDto } from './dtos/update-user-password.dto';

enum UserRole {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
}

@Injectable()
export class UserService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  onModuleInit() {
    console.log('The user service has been initialized.');
    this.prisma.user
      .findMany()
      .then(async (users) => {
        if (users.length === 0) {
          await this.createUser({
            name: process.env.DEFAULT_ADMIN_NAME || 'admin',
            phone: process.env.DEFAULT_ADMIN_PHONE || '01234567891',
            role: UserRole.ADMIN,
            password: bcrypt.hashSync(process.env.DEFAULT_ADMIN_PASSWORD, 10),
          });

          await this.createUser({
            name: process.env.DEFAULT_CUSTOMER_NAME || 'customer',
            phone: process.env.DEFAULT_CUSTOMER_PHONE || '01234567892',
            role: UserRole.CUSTOMER,
            password: bcrypt.hashSync(
              process.env.DEFAULT_CUSTOMER_PASSWORD,
              10,
            ),
          });
          console.log('Default admin and default customer have been created.');
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

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
    const customer = await this.prisma.user.findFirst({
      where: { phone: addCustomerDto.phone, role: 'CUSTOMER' },
    });
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(
      addCustomerDto.password || '123',
      saltOrRounds,
    );
    if (!customer) {
      const data = {
        name: addCustomerDto.name || addCustomerDto.phone,
        phone: addCustomerDto.phone,
        role: UserRole.CUSTOMER,
        password: hashedPassword,
      };
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

  async updateUserPasswordById(
    id: number,
    updateUserPasswordDto: UpdateUserPasswordDto,
  ) {
    console.log(updateUserPasswordDto);
    if (
      !(await this.checkUserPassword(id, updateUserPasswordDto.currentPassword))
    ) {
      throw new Error('Current password is incorrect');
    }
    const hashedPassword = bcrypt.hashSync(
      updateUserPasswordDto.newPassword,
      10,
    );
    return this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  deleteUserById(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
