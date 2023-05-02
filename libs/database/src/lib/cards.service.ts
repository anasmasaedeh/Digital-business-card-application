import {  Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Card, User } from '@my-proj/models';
import { CreateCardDto, UpdateCardDto } from '@my-proj/dtos';

@Injectable()
export class CardService {
  constructor(
    @InjectModel('Card') private cardModel: Model<Card>,
    @InjectModel('User') private userModel: Model<User>,

    // Add JwtService
  ) {}

  async createCard(card: CreateCardDto, userId: string): Promise<Card> {
    // Find the user with the given ID
    const user = await this.userModel.findById(userId).exec();

    // Set the userId property on the card
    card.userId = user._id;

    // Save the card to the database
    const createdCard = new this.cardModel(card);
    return createdCard.save();
  }
    
  async getAllCards(userId: string): Promise<Card[]> {
    const cards = await this.cardModel.find({ userId: new mongoose.Types.ObjectId(userId) }).exec();
    return cards;
  }
  async updateCard(cardId: string, updatedCard: UpdateCardDto, userId:string): Promise<Card> {
    const user = await this.userModel.findById(userId).exec();
    const card = await this.cardModel.findById(cardId).exec();
    card.userId = user._id;

    if (!card) {
      throw new NotFoundException('Card not found');
    }
  
    card.fullName = updatedCard.fullName || card.fullName;
    card.profilePicture = updatedCard.profilePicture || card.profilePicture;
    card.coverPhoto = updatedCard.coverPhoto || card.coverPhoto;
    card.default = updatedCard.default ?? card.default;
    card.position = updatedCard.position || card.position;
    card.address = updatedCard.address || card.address;
    card.company = updatedCard.company || card.company;
    card.cardColor = updatedCard.cardColor || card.cardColor;
    card.socialLinks = updatedCard.socialLinks || card.socialLinks;
    card.bio = updatedCard.bio || card.bio;
  
    return card.save();
  }
      
    async deleteCard(cardId: string, userId: string): Promise<void> {
    const card = await this.cardModel.findById(cardId).exec();
    if (!card) {
      throw new NotFoundException('Card not found');
    }
    if (card.userId.toString() !== userId) {
      throw new UnauthorizedException('Unauthorized access to card');
    }
    await card.remove();
  }
  
      }
