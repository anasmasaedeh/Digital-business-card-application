import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from './user.schema';
import { Friends } from './friend.request.schema';

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ type: User, required: true, index: true, ref: 'User' })
  user: User;

  @Prop({ type: Friends, required: true, index: true, ref: 'FriendRequest' })
  friendRequest: Friends;

  @Prop({ required: true })
  message: string;

  @Prop({ default: false })
  isRead: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
