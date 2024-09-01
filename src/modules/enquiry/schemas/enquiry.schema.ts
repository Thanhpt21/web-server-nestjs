import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EnquiryDocument = HydratedDocument<Enquiry>;

@Schema({ timestamps: true })
export class Enquiry {
    @Prop({ required: true })
    name: string; 

    @Prop({ required: true })
    phone: string; 

    @Prop({ required: true })
    email: string; 

    @Prop()
    comment: string; 

    @Prop({
        type: Number,
        enum: [1,2,3], 
        default: 1
    })
    status: Number; 
}

export const EnquirySchema = SchemaFactory.createForClass(Enquiry);
