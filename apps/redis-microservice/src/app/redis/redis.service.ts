import { Injectable,Inject } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class SessionService {
  constructor(@Inject('session_service')private readonly sessionClient: ClientProxy) {}

  async get(key: string): Promise<string | null> {
    const value$ = this.sessionClient.send<string | null>('get', key);
    const value = await lastValueFrom(value$);
    if (value === null) {
      throw new RpcException(`Session not found for key ${key}`);
    }
    return value;
  }

  async set(key: string, token: string, expire: number): Promise<'OK'> {
    const result$ = this.sessionClient.send<'OK'>('set', { key, token, expire });
    const result = await lastValueFrom(result$);
    return result;
}

  async delete(key: string): Promise<number> {
    const count$ = this.sessionClient.send<number>('del', key);
    const count = await lastValueFrom(count$);
    return count;
  }
}
