import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {Block} from '@my-proj/models';

@Injectable()
export class BlockService {
  constructor(
    @InjectModel('Block') private blockModel: Model<Block>,
  ) {}

  async blockUser(blockerId: string, blockedId: string): Promise<void> {
    const existingBlock = await this.blockModel.findOne({
      blocker: blockerId,
      blocked: blockedId,
    });

    if (existingBlock) {
      throw new Error('User is already blocked');
    }

    const block = new this.blockModel({
      blocker: blockerId,
      blocked: blockedId,
    });

    await block.save();
  }

  async unblockUser(blockerId: string, blockedId: string): Promise<void> {
    const existingBlock = await this.blockModel.findOne({
      blocker: blockerId,
      blocked: blockedId,
    });

    if (!existingBlock) {
      throw new Error('User is not blocked');
    }

    await this.blockModel.deleteOne({
      blocker: blockerId,
      blocked: blockedId,
    });
  }

  async getBlockedUsers(blockerId: string): Promise<Block[]> {
    const blocks = await this.blockModel.find({ blocker: blockerId }).populate('blocked');

    return blocks;
  }
}
