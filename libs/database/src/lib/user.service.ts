import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LeanDocument, Model } from 'mongoose';
import {  Friends, User } from '@my-proj/models';
import { ComparePasswordDto, CreateUserDto, ResetPasswordDto, UpdateUserDto, UserQueryDTO, ForgotPasswordDto } from '@my-proj/dtos'
import * as bcrypt from 'bcrypt';
import { BadRequestException, HttpException, NotFoundException } from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken';
import * as Redis from 'ioredis';
import { generateOTPCode,MailService } from '@my-proj/mailer'

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>,
  @InjectModel('Friends') private readonly friendRequestModel: Model<Friends>,
  private readonly redis: Redis.Redis,
  private readonly jwtService: JwtService,
  private readonly mailService: MailService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    const otpCode = generateOTPCode();

    await this.redis.set(`otp:${createUserDto.email}`, otpCode, 'EX', 300);

    const createdUser = new this.userModel({
      ...createUserDto,
      isValid: false,
    });

    await createdUser.save();

    await this.mailService.sendVerificationCode(createUserDto.email, otpCode);
    
    return createdUser;
  }


  async findOne(query: UserQueryDTO): Promise<LeanDocument<User>> {
    return this.userModel.findOne(query).lean().exec();
  }
    
  async findAll(): Promise<LeanDocument<User[]>> {
    return this.userModel.find().lean().exec();
  }
  async findById(id: string): Promise<Partial<User>> {
    const projection = {
      name: 1,
      email: 1,
      address: 1,
      company: 1,
      position: 1,
    };
    return this.userModel.findById(id)
      .select(projection)
      .lean()
      .exec();
  }
    async findByEmail(email: string): Promise<LeanDocument<User>> {
    return this.userModel.findOne({email}).lean().exec();
  }
  async comparePassword(dto:ComparePasswordDto): Promise<boolean> {
    const user = await this.userModel.findById(dto._id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    console.log('Hashed password:', user.password);

    const isMatch = await bcrypt.compare(dto.password, user.password);
    return isMatch;
  }
  async update(id: string, updateUserDto: UpdateUserDto): Promise<LeanDocument<User>> {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).lean();
    return updatedUser;
  }
  async delete(id: string): Promise<void> {
    return this.userModel.findByIdAndRemove(id);
  }
  async verifyToken(token: string): Promise<JwtPayload> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      return payload;
    } catch (err) {
      throw new UnauthorizedException('Invalid authorization token');
    }
  }
  async updateUserValidity(email: string, isValid: boolean): Promise<void> {
    const result = await this.userModel.updateOne({ email }, { isValid });
    if (result.modifiedCount !== 1) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
  }
  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    const user = await this.userModel.findById(dto._id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isMatch = await bcrypt.compare(dto.oldPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Old password is incorrect');
    }
    user.password=dto.newPassword
    await user.save();
    throw new HttpException('Password changed successfully', HttpStatus.CREATED);

  }

async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
  const { email } = forgotPasswordDto;

  const user = await this.userModel.findOne({ email }).exec();
  if (!user) {
    throw new Error('User not found');
  }

  const otpCode = generateOTPCode(); 
  await this.redis.set(`otp:${email}`, otpCode, 'EX', 300);

  await this.mailService.sendVerificationCode(email, otpCode);
}

async resetPasswordd(email: string, otpCode: string, newPassword: string): Promise<void> {
  const storedOtpCode = await this.redis.get(`otp:${email}`);
  if (otpCode !== storedOtpCode) {
    throw new Error('Invalid OTP code');
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const user = await this.userModel.findOneAndUpdate({ email }, { password: hashedPassword }).exec();
  if (!user) {
    throw new Error('User not found');
  }

  await this.redis.del(`otp:${email}`);
}
async searchUsers(query: string): Promise<User[]> {
  const regexQuery = new RegExp(query, 'i');
  const users = await this.userModel
    .find({
      $and: [
        { $or: [{ fullName: regexQuery }, { email: regexQuery }, { company: regexQuery }] },
        { role: 'user' },
      ],
    })
    .select('fullName email company gender birthDate position')
    .exec();
  return users;
}


}




