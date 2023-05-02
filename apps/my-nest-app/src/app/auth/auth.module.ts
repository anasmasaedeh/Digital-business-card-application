import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt-strategy';
import { DatabaseModule } from '@my-proj/database';
import { MailModule } from '@my-proj/mailer';
@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    
    }),
    DatabaseModule,
    MailModule,

  ],
  providers: [AuthService, JwtStrategy,],
  controllers: [AuthController],
})
export class AuthModule {}
