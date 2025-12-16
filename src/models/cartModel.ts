import mongoose, { Schema, Document, type ObjectId } from "mongoose";
import type { IProduct } from "./productModel.js";


export enum CartStatus {
    ACTIVE = 'active',
    COMPLETED = 'completed',
}

export interface ICartItem {
    product: IProduct;
    unitPrice: number;
    quantity: number;
}

export interface ICart extends Document {
    userId: ObjectId | string;
    items: ICartItem[];
    totalPrice: number;
    status: CartStatus;
}

const cartItemSchema = new Schema<ICartItem>({
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    unitPrice: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1, min: 1 },
});

const cartSchema = new Schema<ICart>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [cartItemSchema],
    totalPrice: { type: Number, required: true, default: 0 },
    status: { type: String, required: true, enum: CartStatus, default: CartStatus.ACTIVE },
});

export default mongoose.model<ICart>('Cart', cartSchema);