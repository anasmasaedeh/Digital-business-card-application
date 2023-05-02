import { Controller, Post, Body, UnauthorizedException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import {  LoginDto } from '@my-proj/dtos';
import { User } from '@my-proj/models';
import { LeanDocument } from 'mongoose';

@Controller('auth')

export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('login/admin')
  async loginAdmin(@Body() loginDto: LoginDto): Promise<{message:string, data:unknown ,statusCode:number}> {
    const user: LeanDocument <User> = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user){
      throw new UnauthorizedException('invalid email or password')
    }

    else if (user.role !== 'admin') {
      throw new UnauthorizedException('Clients are not authorized to sign in here.');
    }
    const log= await this.authService.login(loginDto);
    return {
      message: 'Admin logged in successfully',
      data: log,
      statusCode: HttpStatus.OK
    }
  }

  @Post('login/user')
  async loginUser(@Body() loginDto: LoginDto): Promise<{message:string, data:unknown ,statusCode:number}> {
    const user: LeanDocument <User> = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user){
      throw new UnauthorizedException('invalid email or password')
    }
    
    const log= await this.authService.login(loginDto);
    console.log(log);
    return {
      message: 'User logged in successfully',
      data: log,
      statusCode: HttpStatus.OK
    }
  }


}
