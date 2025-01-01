import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as session from 'express-session';
import * as passport from "passport"

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('v1');
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({ credentials: true, origin: process.env.FRONTEND_URL });

  app.use(
    session({
      secret: 'wCoJSyeNWf4cIppK5l062ek6fbqGOc2B', // Đặt khóa bí mật cho session
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 3600000 }, // Cookie tồn tại trong 1 giờ
    }),
  );

  app.use(passport.initialize())
  app.use(passport.session())

  // Serve static files from the "public" directory
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/public/',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
