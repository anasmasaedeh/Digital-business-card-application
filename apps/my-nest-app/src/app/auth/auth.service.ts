import { Injectable,UnauthorizedException  } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import mongoose from 'mongoose';
import { User } from '@my-proj/models';
import { LoginDto } from '@my-proj/dtos';
import { UserService } from '@my-proj/database';
import Redis from 'ioredis';

@Injectable()
export class AuthService {
  private readonly redisClient: Redis;
  private readonly expiresIn = 86400; // 1200 seconds


  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {
    this.redisClient = new Redis();
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userService.findOne({ email: email });
    if (user && await this.userService.comparePassword({ _id: user._id, password: password })) {
      const payload = {
        email: user.email,
        sub: user._id.toString(),
        role: user.role
      };
        
      const access_token = this.jwtService.sign(payload);
      
      await this.redisClient.set(user._id,access_token, 'EX', this.expiresIn);
      delete user.password
      return {
        access_token,
        user
      };
      
    }
    else {
      throw new UnauthorizedException('Incorrect email or password');
    }
  }

  async validateUser(email: string, password: string): Promise<mongoose.LeanDocument<User> | null> {
    const user = await this.userService.findOne({ email });
    
    if (user && await this.userService.comparePassword({_id:user._id, password})) {
      return user;
    }
    return null;
  }

  
  
}
