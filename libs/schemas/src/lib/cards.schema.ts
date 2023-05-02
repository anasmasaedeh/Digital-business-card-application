import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';


@Schema({ timestamps: true })
export class Card extends Document {
    @Prop({
        type: Types.ObjectId,
        ref: 'User',
        required: true,
      })
      userId: Types.ObjectId;
    
      @Prop({ required: false })
    fullName: string;
    @Prop({ required: false })
    profilePicture: string;
    @Prop({ required: false })
    coverPhoto: string;

    @Prop({required:false})
    default:boolean;
    @Prop({ required: false })
    position: string;
    @Prop({ required: false })
    address: string;
    @Prop({ required: false })
    company:string;
    @Prop({ required: false })
    cardColor:string;

    @Prop({
        type: [{
            category:{
            categoryName: { type: String, required: false },
            items: [{
                itemName: { type: String, required: true },
                username: { type: String, required: true },
                title: { type: String, required: true },
                _id: { type: MongooseSchema.Types.ObjectId, auto: false },

            }],
            _id: { type: MongooseSchema.Types.ObjectId, auto: false },
        }}],
    
        required: false,
    
    })

    socialLinks: {
        category:{
        categoryName: string;
        items: {
            itemName: string;
            username: string;
            title: string;
        }[];
    }[];
    }
    @Prop({ required: false })
    bio: string;
  
}
export const CardSchema = SchemaFactory.createForClass(Card);
