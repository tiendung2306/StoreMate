import { Controller, Post, UseGuards, Body, Req, Get } from '@nestjs/common';
import { Request } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { UserRole } from 'src/user/dtos/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private userService: UserService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req) {
    return req.user;
  }

  @Get('/logout')
  logout(@Req() request: Request) {
    const req = request as Request & {
      isAuthenticated: () => boolean;
      user: any;
      session: any;
    };
    if (req.isAuthenticated()) {
      req.session.destroy((err: any) => {
        if (err) {
          console.log('Session destruction error:', err);
        }
      });
      return { msg: 'The user session has ended' };
    } else {
      return { msg: 'No active session found' };
    }
  }

  @Post('register')
  async register(
    @Body('password') userPassword: string,
    @Body('phone') phone: string,
  ) {
    // Implement registration logic here
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(userPassword, saltOrRounds);
    const result = await this.userService.createUser({
      name: phone,
      role: UserRole.CUSTOMER,
      phone,
      password: hashedPassword,
    });
    return {
      msg: 'User successfully registered',
      userId: result.id,
      name: result.name,
      phone: result.phone,
      role: result.role,
    };
  }
}
