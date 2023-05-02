import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document  } from 'mongoose';
import * as bcrypt from 'bcrypt';


@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false })
  profilePicture:string;

  @Prop({ required: false })
  role: string;
  
  @Prop({ required: false })
  phoneNumber: number;

  @Prop({ required: false })
  birthDate: Date;

  @Prop({ required: false })
  profileLink : string

 
  @Prop({ required: false })
  gender: string;

  @Prop({ required: false, default: false})
   isValid: boolean 
}
  export const UserSchema = SchemaFactory.createForClass(User);
  UserSchema.index({ fullName: "text", email: "text" });


  UserSchema.pre<User>('save', async function (next) {
    if (this.isModified('password' || 'newPassword') || this.isNew) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      
      this.password = hashedPassword;
    }
    next();
    UserSchema.pre<User>('findOneAndUpdate', async function (next) {
      if (this.isModified('password' || 'newPassword') || this.isNew) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        
        this.password = hashedPassword;
      }
      next();
    });
    
  });
  

