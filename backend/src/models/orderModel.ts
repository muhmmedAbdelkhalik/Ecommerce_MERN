import mongoose, { Schema, Document, type ObjectId } from "mongoose";

export enum OrderStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
}

export interface IOrderItem {
    productName: string;
    productImage: string;
    productPrice: number;
    productQuantity: number;
}

export interface IOrder extends Document {
    userId: ObjectId | string;
    items: IOrderItem[];
    totalPrice: number;
    address: string;
    status: OrderStatus;
    createdAt: Date;
    updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>({
    productName: { type: String, required: true },
    productImage: { type: String, required: true },
    productPrice: { type: Number, required: true },
    productQuantity: { type: Number, required: true, default: 1, min: 1 },
});

const orderSchema = new Schema<IOrder>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    totalPrice: { type: Number, required: true, default: 0 },
    address: { type: String, required: true },
    status: { type: String, required: true, enum: OrderStatus, default: OrderStatus.PENDING },
}, {
    timestamps: true,
});

export default mongoose.model<IOrder>('Order', orderSchema);