import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BlockSchema, CardSchema, FriendRequestSchema, NotificationSchema, UserSchema } from '@my-proj/schemas'; // import UserSchema from your schemas library
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import * as Redis from 'ioredis'
import { MailModule } from '@my-proj/mailer';
import { FriendRequestService } from './friends-request.service';
import { CardService } from './cards.service';
import { BlockService } from './blocking.service';
@Module({
  imports: [
    MailModule,
    ConfigModule,
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]), 
    MongooseModule.forFeature ([{ name: 'Friends', schema: FriendRequestSchema }]),
    MongooseModule.forFeature ([{ name: 'NotSchema', schema: NotificationSchema }]),
    MongooseModule.forFeature ([{ name: 'Card', schema: CardSchema }]),
    MongooseModule.forFeature ([{ name: 'Block', schema: BlockSchema }])




  ],
  providers: [UserService,JwtService,Redis.Redis,FriendRequestService,CardService,BlockService],
  exports: [UserService,FriendRequestService,CardService,BlockService],
})
export class DatabaseModule {}
