import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@my-proj/database';
import { AuthModule } from './auth/auth.module';
import { UserController } from './user/user.controller';
import { MyGuardsLibraryModule } from '@my-proj/my-guards-library'
import { InterfaceModule } from '@my-proj/interface';
import { JwtService } from '@nestjs/jwt';
import { Redis } from 'ioredis';
import { MailModule } from '@my-proj/mailer';
import { FriendRequestController } from './user/friends-request.controller';
import { CardsController } from './user/card.controller';
import { BlockController } from './user/blocking.controller';
@Module({
  imports: [
    InterfaceModule,
    MyGuardsLibraryModule,
    AuthModule,
    DatabaseModule,
    MailModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    })],
  controllers: [UserController,FriendRequestController,CardsController,BlockController],
  providers: [JwtService,Redis],
})
export class AppModule {}
