import { Module } from '@nestjs/common';
import { RedisSessionModule } from './redis/redis.module';
@Module({
  imports: [RedisSessionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
