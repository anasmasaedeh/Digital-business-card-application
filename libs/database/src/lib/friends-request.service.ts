import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from '@my-proj/models';
import { Friends } from '@my-proj/schemas';
import { MailService } from '@my-proj/mailer';

@Injectable()
export class FriendRequestService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Friends') private readonly friendRequestModel: Model<Friends>,
    private readonly mailService: MailService,
  ) {}

  async sendFriendRequest(requesterEmail: string, recipientEmail: string, message: string): Promise<Friends> {
    const requester = await this.userModel.findOne({ email: requesterEmail });
    const recipient = await this.userModel.findOne({ email: recipientEmail });

    if (!requester || !recipient) {
      throw new Error('Invalid requester or recipient email');
    }

    const friendRequest = new this.friendRequestModel({
      requester: requester._id,
      recipient: recipient._id,
      message,
    });
    const mailContent = {
      from: 'Your App <noreply@yourapp.com>',
      to: recipient.email,
      subject: 'You received a new friend request!',
      html: `Hi ${recipient.fullName},<br><br>You have received a new friend request from ${requester.fullName}.<br><br>Please log in to your account to respond.<br><br>Best regards,<br>Your App Team`
    };
  
    await this.mailService.sendMail(mailContent);
  

    return friendRequest.save();
  }
  async acceptFriendRequest(requestId: string, userId: string): Promise<Friends> {
    const friendRequest = await this.friendRequestModel.findById(requestId);
  
    if (!friendRequest) {
      throw new NotFoundException('Friend request not found');
    }
  
    if (friendRequest.status !== 'pending') {
      throw new BadRequestException('Friend request has already been responded to');
    }
  
    if (friendRequest.recipient.toString() !== userId.valueOf()) {
      console.log(friendRequest.recipient.toString());
    console.log(userId.valueOf());
    
      
      throw new ForbiddenException('You do not have permission to accept this friend request');
    }
  
    friendRequest.status = 'accepted';
    await friendRequest.save();
  
    return friendRequest;
  }
  
  async rejectFriendRequest(requestId: string, userId: string): Promise<Friends> {
    const friendRequest = await this.friendRequestModel.findById(requestId);
  
    if (!friendRequest) {
      throw new NotFoundException('Friend request not found');
    }
  
    if (friendRequest.status !== 'pending') {
      throw new BadRequestException('Friend request has already been responded to');
    }
  
    if (friendRequest.recipient.toString() !== userId) {
      throw new ForbiddenException('You do not have permission to reject this friend request');
    }
  
    friendRequest.status = 'rejected';
    await friendRequest.save();
  
    return friendRequest;
  }
  async getPendingFriendRequests(userId: string): Promise<Friends[]> {
    const pendingRequests = await this.friendRequestModel.find({
      recipient: new mongoose.Types.ObjectId(userId),
      status: 'pending',
    }).exec();

    return pendingRequests;
  }
  async getFriendList(userId: string): Promise<Pick<User, 'fullName' | 'email'>[]> {
    const user = await this.userModel.findById(userId);
  
    const friendRequests = await this.friendRequestModel.find({
      $or: [
        { requester: user, status: 'accepted' },
        { recipient: user, status: 'accepted' },
      ],
    });
  
    const friendIds = friendRequests.map((request) => {
      if (request.requester.toString() == userId.valueOf()) {
        return request.recipient;
      } else {
        return request.requester;
      }
    });
  
    const friends = await this.userModel.find({ _id: { $in: friendIds } }, {
      name: 1,
      email: 1,
      address: 1,
      company: 1,
      position: 1,
      _id: 0,
    });
  
    return friends;
  }
  async blockUser(userId: string, blockedUserId: string): Promise<void> {
    await this.friendRequestModel.updateOne(
      {
        $or: [
          { requester: userId, recipient: blockedUserId },
          { requester: blockedUserId, recipient: userId },
        ],
        status: { $ne: 'blocked' },
      },
      { status: 'blocked' },
    );
  }

  async unblockUser(userId: string, unblockedUserId: string): Promise<void> {
    await this.friendRequestModel.updateOne(
      {
        $or: [
          { requester: userId, recipient: unblockedUserId },
          { requester: unblockedUserId, recipient: userId },
        ],
        status: 'blocked',
      },
      { status: 'pending' },
    );
  }

  async getBlockedUsers(userId: string): Promise<User[]> {
    const blockedFriends = await this.friendRequestModel.find({ requester: userId, status: 'blocked' })
      .populate('recipient', 'fullName email profilePicture');
    return blockedFriends.map(friend => friend.recipient);
  }
 
}