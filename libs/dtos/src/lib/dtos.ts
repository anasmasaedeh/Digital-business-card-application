export class AuthResponseDto {
    constructor(access_token?: string) {
      this.access_token = access_token;
    }
  
    access_token: string;
  }

  export class ComparePasswordDto {
    _id: string;
    password: string;
  }
  
  export class LoginDto {
    email: string;
    password: string;
  }

  export class UpdateUserDto {
    readonly fullName?: string;
    readonly email?: string;
    readonly profileLink?: string;
    readonly postition?: string;
    readonly company?: string;
  }

  import { ApiProperty } from '@nestjs/swagger';

  export class CreateUserDto {
    @ApiProperty({
      description: 'The email address of the user',
      type: String,
      format: 'email',
    })
    readonly email: string;
  
    @ApiProperty({
      description: 'The password of the user',
      type: String,
      minLength: 8,
    })
    readonly password: string;
  
    @ApiProperty({
      description: 'The role of the user',
      type: String,
      enum: ['USER', 'ADMIN'],
    })
    readonly role: string;
  
    @ApiProperty({
      description: 'Whether the user is valid or not',
      type: Boolean,
      default: true,
    })
    readonly isValid: boolean;
  }
  

  export interface UserQueryDTO {
    fullName?: string;
    email?: string;
  }
  
import { IsString, IsNotEmpty, IsEmail, IsEnum } from 'class-validator';

export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  otpCode: string;
}

export interface CreateCardDto {
   userId: string;
  readonly fullName:string;
  readonly company:string;
  readonly profilePicture:string;
  readonly position:string;
  readonly address:string;
  readonly bio:string;
  readonly socialLinks: {
    category: {
    categoryName: string
      items: {
        itemName: string;
          username: string;
          title: string;
        }[];
      }[];
    };
  };
  export class UpdateCardDto {
    fullName?: string;
    profilePicture?: string;
    coverPhoto?: string;
    default?: boolean;
    position?: string;
    address?: string;
    company?:string;
    cardColor?:string;
    socialLinks?: {
      category:{
        categoryName: string;
        items: {
          itemName: string;
          username: string;
          title: string;
        }[];
      }[];
    };
    bio?: string;
  }
  
export interface ResetPasswordDto {
  readonly _id: string; 
  readonly oldPassword: string; 
  readonly newPassword: string; 
  readonly confirmNewPassword: string; 
}
export interface ForgotPasswordDto{
  readonly email: string;
  readonly newPassword: string; 
  readonly confirmNewPassword: string; 

}
export class SendOtpDto {
  @IsEmail()
  readonly email: string;
}


export interface ResetDto{
  readonly email: string;
  readonly newPassword: string; 
readonly otp: string;
  
}

export class CreateFriendRequestDto {
  @IsNotEmpty()
  fromUser: string;

  @IsNotEmpty()
  toUser: string;

  @IsString()
  message: string;
}

export class FriendRequestDto {
  @IsNotEmpty()
  @IsString()
  toUser: string;

  @IsString()
  message: string;
}

enum FriendRequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export class RespondToFriendRequestDto {
  @IsEnum(FriendRequestStatus)
  status: FriendRequestStatus;

  message: string;
}




