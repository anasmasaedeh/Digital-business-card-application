import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import Redis from "ioredis/built/Redis";
import {AuthGuard} from '@nestjs/passport'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly redisClient: Redis,
    private readonly jwtService:JwtService) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const token = req.headers.authorization?.split(' ')[1];
    
    if (token) {
      try {
        const decoded = this.jwtService.decode(token);
        
        
        const storedToken = await this.redisClient.get(decoded.sub);
        
        if (storedToken && storedToken === token) {
          
          req.user = decoded;
          return true;
        }
      } catch (err) {
        throw new UnauthorizedException('Invalid token');
      }
    }
    throw new UnauthorizedException('Token not found');
  }
}
