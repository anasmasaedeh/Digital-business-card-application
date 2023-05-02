import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User,Notification} from '@my-proj/schemas';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<Notification>,
  ) {}

  async getNotificationsForUser(user: User): Promise<Notification[]> {
    return this.notificationModel.find({ user: user }).sort('-createdAt').exec();
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await this.notificationModel.updateOne({ _id: id }, { isRead: true }).exec();
  }
}
