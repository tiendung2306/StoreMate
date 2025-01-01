import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { UserRole } from 'src/user/dtos/create-user.dto';

@Controller('auth')
export class AuthController {

  constructor(private userService: UserService) { }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return req.user;
  }

  @Post('/logout')
  logout(@Request() req): any {
    req.session.destroy();
    return { msg: 'The user session has ended' }
  }

  @Post('register')
  async register(@Body('password') userPassword: string,
    @Body('phone') phone: string,) {
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
