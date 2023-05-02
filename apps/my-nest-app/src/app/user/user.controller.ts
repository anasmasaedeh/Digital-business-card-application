import { UserService } from "@my-proj/database";
import { CreateUserDto,ForgotPasswordDto,ResetDto,ResetPasswordDto,UpdateUserDto, VerifyOtpDto } from "@my-proj/dtos";
import { User } from "@my-proj/models";
import {
  Controller, Get, Patch, Post, Delete, Body, NotFoundException,
  UseGuards, BadRequestException,
  InternalServerErrorException, Query, HttpStatus,
  ConflictException, Req
} from '@nestjs/common';
import {JwtAuthGuard} from '@my-proj/my-guards-library'
import * as mongoose from 'mongoose';
import { RolesGuard } from "@my-proj/my-guards-library";
import { Roles } from "@my-proj/my-guards-library";
import { UserRole } from "@my-proj/shared-data";
import * as Redis from 'ioredis'



@Controller('users')
export class UserController {
  constructor(
  private readonly userService: UserService,
    private readonly redis: Redis.Redis,
    ) {}
    @Post('admin')
    @Roles(UserRole.ADMIN)
    async createAdmin(@Body() createUserDto: CreateUserDto): Promise<{ message: string, data: User }> {
      const newUser = await this.userService.signUp(createUserDto);
      const response = { message: 'Admin created successfully', data: newUser, statusCode: HttpStatus.CREATED };
      return response;
    }
        

    @Post('client')
    @Roles(UserRole.USER)
    async createUser(@Body() createUserDto: CreateUserDto): Promise<{ message: string, data: User }> {
      try {
        const newUser = await this.userService.signUp(createUserDto);
        const response = { message: 'Admin created successfully', data: newUser, statusCode: HttpStatus.CREATED };
        return response;
      } catch (error) {
        if (error.code === 11000 && error.keyValue.email) { // Check for duplicate key error and email field
          throw new ConflictException('Email is already exists');
        } else {
          throw error;
        }
      }
    }
        @Post('reset-password')
    async resetPasswordd(@Body() resetDto: ResetDto): Promise<unknown> {
      const { email, otp, newPassword } = resetDto;
      
      if (!email || !otp || !newPassword) {
        throw new BadRequestException('Email, OTP, and new password are required');
      }
    
      try {
        await this.userService.resetPasswordd(email, otp, newPassword);
      } catch (error) {
        throw new InternalServerErrorException('Failed to reset password');
      } 
    
      return {
        message: 'Password reset successfully',
      };
    }
      
    
    @Post('forgot-password')
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<unknown> {
      const { email } = forgotPasswordDto;

      if (!email) {
        throw new BadRequestException('Invalid email address');
      }
    
      await this.userService.forgotPassword(forgotPasswordDto);
    
    return{
      message: 'an OTP has sent to your email'
    }}
    
      
  @Post('reset')
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<void> {
    await this.userService.resetPassword(dto);
  }
  @Get('search')
  @UseGuards(JwtAuthGuard)

async searchUsers(@Query('query') query: string): Promise<User[]> {
  return this.userService.searchUsers(query);
}


  @Get('all')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN,UserRole.USER)
  async findAll(): Promise<mongoose.LeanDocument<User[]>> {
  console.log();
  
   return this.userService.findAll();  
  }
  @Get()
  @UseGuards(JwtAuthGuard,RolesGuard)
  async findById(@Req()req):  Promise<Partial<User>> {
    const id = req.user.sub
    return this.userService.findById(id);
  }

  @Patch()

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN,UserRole.USER)
  async update(
    @Req() req,
    @Body() updateUserDto: Partial<UpdateUserDto>
  ): Promise<mongoose.LeanDocument<{ message: string, data: User }>> {
    const id=req.user.sub
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Incorrect Id');
    }
    
    const updatedUser = await this.userService.update(id, updateUserDto);
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    const response = { message: 'User updated successfully', data: updatedUser, statusCode: HttpStatus.OK };
    return response;

  }


@Delete()
 @UseGuards(RolesGuard,JwtAuthGuard)  
  async delete(@Req()req): Promise<{message: string, data:unknown, statusCode: number}> {
    const id=req.user.sub
    const deletedUser= this.userService.delete(id)
    return {
      message:'User deleted successfully',
      data:deletedUser,
      statusCode:HttpStatus.OK
    }
  }


@Post('verify-otp')
async verifyOTP(@Body() verifyOtpDto: VerifyOtpDto): Promise<void> {
  const { email, otpCode } = verifyOtpDto;

  const storedOtpCode = await this.redis.get(`otp:${email}`);

  if (otpCode !== storedOtpCode) {
    throw new BadRequestException('Invalid OTP code');
  }

  await this.userService.updateUserValidity(email, true);

  await this.redis.del(`otp:${email}`);
}

}



