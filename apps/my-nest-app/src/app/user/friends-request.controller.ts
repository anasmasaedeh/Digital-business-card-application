import { Controller, Post, Body, Patch,Put, Param, Get, UseGuards, Req } from '@nestjs/common';
import { FriendRequestService } from '@my-proj/database';
import { JwtAuthGuard } from '@my-proj/my-guards-library';
import { User } from '@my-proj/models';

@Controller('friend-request')
export class FriendRequestController {
  constructor(private readonly friendRequestService: FriendRequestService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async sendFriendRequest(
    @Body('requesterEmail') requesterEmail: string,
    @Body('recipientEmail') recipientEmail: string,
    @Body('message') message: string,
    @Req() req,
  ) {
    requesterEmail=req.user.email;
    const friendRequest = await this.friendRequestService.sendFriendRequest(requesterEmail, recipientEmail, message);
    return { friendRequest };
  }
  
  @Put(':id/accept')
  @UseGuards(JwtAuthGuard)

  async acceptFriendRequest(@Param('id') requestId: string,@Req() req): Promise<unknown> {
    const userId=req.user.sub
    const friendRequest = await this.friendRequestService.acceptFriendRequest(requestId,userId);
    return { message: 'Friend request accepted', friendRequest };
  }

  @Put(':id/reject')
  @UseGuards(JwtAuthGuard)

  async rejectFriendRequest(@Param('id') requestId: string,@Req() req): Promise<unknown> {
    const userId=req.user.sub
    const friendRequest = await this.friendRequestService.rejectFriendRequest(requestId,userId);
    return { message: 'Friend request rejected', friendRequest };
  }


  @Get('pending')
  @UseGuards(JwtAuthGuard)

  async getPendingFriendRequests(@Req() req): Promise<unknown> {
    const userId=req.user.sub
    const pendingRequests = await this.friendRequestService.getPendingFriendRequests(userId);

    return pendingRequests;
  }
  @Get('friendsList')
  @UseGuards(JwtAuthGuard)
  async getFriendsList(@Req() req ): Promise<unknown> {
    const userId = req.user.sub;
    const friendsList = await this.friendRequestService.getFriendList(userId);
    return friendsList;
  }
  @Patch('block')
  @UseGuards(JwtAuthGuard)

  async blockUser(
    @Req() req,
    @Body('blockedUserId') blockedUserId:string ,
  ): Promise<{message:string}> {
    const userId  = req.user.sub;

    await this.friendRequestService.blockUser(userId, blockedUserId);
    return { message: 'User has been blocked successfully' };

  }

  @Patch('unblock')
  @UseGuards(JwtAuthGuard)

  async unblockUser(
    @Req() req,
    @Body('unblockedUserId') unblockedUserId,
  ): Promise<{message:string}> {
    const  userId  = req.user.sub;

    await this.friendRequestService.unblockUser(userId, unblockedUserId);
    return { message: 'User has been unblocked successfully' };

  }
  @Get('blocked-users')
  @UseGuards(JwtAuthGuard)
  async getBlockedUsers(@Req() req): Promise<{ blockedUsers: User[] }> {
    const  userId  = req.user.sub;

    const blockedUsers = await this.friendRequestService.getBlockedUsers(userId);

    return { blockedUsers };
  }


}