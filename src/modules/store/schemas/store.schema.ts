import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StoreDocument = HydratedDocument<Store>;

@Schema({ timestamps: true })
export class Store {
    @Prop({ required: true })
    name: string;

    @Prop()
    image: string;

    @Prop({ required: true })
    phone: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    address: string;

    @Prop({ required: false })
    link?: string;

    @Prop({ required: false })
    iframe?: string;
}

export const StoreSchema = SchemaFactory.createForClass(Store);
