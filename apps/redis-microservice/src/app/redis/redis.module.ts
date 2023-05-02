import { Module } from '@nestjs/common';
//import { RedisModule } from 'nestjs-redis';
import { SessionService } from './redis.service';
//import { ModuleRef } from '@nestjs/core';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SessionController } from './redis.controller';

@Module({
  imports: [
    
    ClientsModule.register([
        {
            name: 'session_service',
          transport: Transport.REDIS,
          options: {
            host: 'localhost',
            port: 6379,
            retryAttempts: 5,
            retryDelay: 1000,
        
          }
        },
      ]),
    ],
    controllers:[SessionController],
  providers: [
    SessionService,
  ],
  exports: [SessionService],
})
export class RedisSessionModule {
    
}
