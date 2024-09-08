import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop()
    name: string;

    @Prop()
    email: string;

    @Prop()
    password: string;

    @Prop()
    phone: string;

    @Prop()
    address: string;

    @Prop()
    image: string;

    @Prop({default: "USERS"})
    role: string;

    @Prop({default: "LOCAL"})
    accountType: string;

    @Prop({default: false})
    isActive: boolean;

    @Prop()
    codeId: string;

    @Prop()
    codeExpired: Date;


    @Prop([{ 
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: Number,
        colors: { type: [mongoose.Schema.Types.ObjectId], ref: 'Color' },
        price: Number,
        discount: Number,
        thumb: String,
        title: String,
    }])
    cart: {
        product: mongoose.Schema.Types.ObjectId;
        quantity: number;
        colors?: mongoose.Schema.Types.ObjectId[];
        price: number;
        discount?: number;
        thumb?: string;
        title?: string;
    }[];

    @Prop([{ type: [mongoose.Schema.Types.ObjectId], ref: 'Product' }])
    wishlist: mongoose.Schema.Types.ObjectId[];

}



export const UserSchema = SchemaFactory.createForClass(User);
