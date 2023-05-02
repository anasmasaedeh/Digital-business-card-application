import { Controller, Get, Post, Patch, UseGuards, Body, Req } from '@nestjs/common';
import { JwtAuthGuard } from '@my-proj/my-guards-library';
import { BlockService } from '@my-proj/database';

@Controller('block')
export class BlockController {
  constructor(private readonly blockService: BlockService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async blockUser(@Body() body: { blockedUserId: string }, @Req() req) : Promise<{ message: string }>  {
    const userId = req.user.sub;
    const { blockedUserId } = body;
    await this.blockService.blockUser(userId, blockedUserId);
    return { message: 'User has been blocked successfully' };

  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  async unblockUser(@Body() body: { unblockedUserId: string }, @Req() req): Promise<{ message: string }> {
    const userId = req.user.sub;
    const { unblockedUserId } = body;
    await this.blockService.unblockUser(userId, unblockedUserId);
    return { message: 'User has been unblocked successfully' };

  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getBlockedUsers(@Req() req) {
    const userId = req.user.sub;
    return this.blockService.getBlockedUsers(userId);
  }
}



