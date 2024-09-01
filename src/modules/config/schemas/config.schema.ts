import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ConfigDocument = HydratedDocument<Config>;

@Schema({ timestamps: true })
export class Config {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    phone: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    address: string;

    @Prop({ required: false })
    facebook?: string;

    @Prop({ required: false })
    zalo?: string;

    @Prop({ required: false })
    instagram?: string;

    @Prop({ required: false })
    tiktok?: string;

    @Prop({ required: false })
    youtube?: string;

    @Prop({ required: false })
    messenger?: string;

    @Prop({ required: false })
    logo?: string; // URL or path to the logo image

    @Prop({ required: false })
    favicon?: string; // URL or path to the favicon image
}

export const ConfigSchema = SchemaFactory.createForClass(Config);
