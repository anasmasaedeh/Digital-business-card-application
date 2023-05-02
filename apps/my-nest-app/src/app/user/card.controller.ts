import { Controller,Delete, Post, Body, Get, UseGuards, Req, HttpStatus, Patch, Param } from '@nestjs/common';
import { JwtAuthGuard } from '@my-proj/my-guards-library';
import { CardService } from '@my-proj/database';
import { Card } from '@my-proj/models';
import { CreateCardDto, UpdateCardDto } from '@my-proj/dtos';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardService: CardService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createCard(@Body() card: CreateCardDto, @Req() req: any): Promise<{message : string , data:Card , statusCode: number}>  {
    const userId = req.user.sub; 
    const createdCard = await this.cardService.createCard(card, userId);
    return {message:"Card has been Created successfully!", data:createdCard, statusCode:HttpStatus.CREATED};
  }
  
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllCards(@Req() req: any): Promise<{message : string , data:Card[] | null , statusCode: number}> {
    const userId = req.user.sub;
    const cards = await this.cardService.getAllCards(userId);
    return {message:"Cards has been got successfully!", data:cards, statusCode:HttpStatus.OK};
  }
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateCard(
    @Param('id') id: string,
    @Body() updateCardDto: UpdateCardDto,
    @Req() req: any,
  ): Promise<{ message: string; data: Card | null; statusCode: number }> {
    const userId = req.user.sub;
    const updatedCard = await this.cardService.updateCard(id, updateCardDto,userId);
    if (!updatedCard) {
      return { message: 'Card not found!', data: null, statusCode: HttpStatus.NOT_FOUND };
    }
    return { message: 'Card has been updated successfully!', data: updatedCard, statusCode: HttpStatus.OK };
  }
      
@Delete(':cardId')
@UseGuards(JwtAuthGuard)
async deleteCard(
  @Param('cardId') cardId: string,
  @Req() req: any
): Promise<{ message: string, statusCode: number }> {
  const userId = req.user.sub;
  await this.cardService.deleteCard(cardId, userId);
  return { message: "Card has been deleted successfully!", statusCode: HttpStatus.OK };
}

}
