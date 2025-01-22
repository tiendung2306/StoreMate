import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  // eslint-disable-next-line prettier/prettier
  constructor(private userService: UserService) { }

  async validateUser(phone: string, pass: string): Promise<any> {
    const user = await this.userService.findUserByPhone(phone);
    if (!user) {
      console.log('User not found');
      return null;
    }
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user; // eslint-disable-line @typescript-eslint/no-unused-vars
      return result;
    }
    return null;
  }
}
