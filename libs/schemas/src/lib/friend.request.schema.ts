import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from './user.schema';


@Schema({ timestamps: true })
export class Friends extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  requester: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  recipient: User;

  @Prop({ required: true })
  message: string;

  @Prop({ required: false, enum: ['pending', 'accepted', 'rejected', 'blocked'], default: 'pending' })
  status: 'pending' | 'accepted' | 'rejected' | 'blocked';}


export const FriendRequestSchema = SchemaFactory.createForClass(Friends);
