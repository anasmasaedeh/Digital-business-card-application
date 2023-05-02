import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { SessionService } from './redis.service';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get(':key')
  async getSession(@Param('key') key: string) {
    return this.sessionService.get(key);
  }

  @Post(':key')
  async setSession(@Param('key') key: string, @Body() body: { token: string, expire: number }) {
    const { token, expire } = body;
    return this.sessionService.set(key, token, expire);
  }

  @Delete(':key')
  async deleteSession(@Param('key') key: string) {
    return this.sessionService.delete(key);
  }
}
