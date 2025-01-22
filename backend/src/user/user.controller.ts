import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { RemovePasswordInterceptor } from './interceptors/remove-password.interceptor';
import { AddCustomerDto } from './dtos/add-customer.dto';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { UpdateUserPasswordDto } from './dtos/update-user-password.dto';

@UseInterceptors(RemovePasswordInterceptor)
@Controller('users')
export class UserController {
  private readonly userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  @Get('status')
  async getStatus(@Req() request: Request) {
    const req = request as Request & {
      isAuthenticated: () => boolean;
      user: any;
      session: any;
    };
    if (req.isAuthenticated()) {
      const user = await this.userService.getUserById(req.user.id);
      return {
        status: 'authenticated',
        user: user,
        session: req.session,
        cookie: req.cookies,
      };
    } else {
      return {
        status: 'not authenticated',
      };
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserById(id);
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Post('add-customer')
  addCustomer(@Body() addCustomerDto: AddCustomerDto) {
    return this.userService.addCustomer(addCustomerDto);
  }

  @Patch(':id')
  updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUserById(id, updateUserDto);
  }

  @Patch(':id/password')
  updateUserPasswordById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserPasswordDto: UpdateUserPasswordDto,
  ) {
    return this.userService.updateUserPasswordById(id, updateUserPasswordDto);
  }

  @Delete(':id')
  deleteUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUserById(id);
  }
}
