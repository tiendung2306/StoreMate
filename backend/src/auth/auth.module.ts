import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { PrismaService } from 'src/prisma.service';
import { SessionSerializer } from './serializers/session.serializer';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule, PassportModule.register({ session: true })],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, PrismaService, SessionSerializer],
})
export class AuthModule {}
