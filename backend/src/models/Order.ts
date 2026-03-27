import mongoose, { Document, Schema, Types } from 'mongoose';

export type OrderStatus = 'pending' | 'paid' | 'canceled';

export interface IOrderItem {
  product: Types.ObjectId;
  qty: number;
  price: number;
  name: string;
}

export interface IOrder extends Document {
  user: Types.ObjectId;
  items: IOrderItem[];
  total: number;
  status: OrderStatus;
  paymentMethod: 'vnpay';
  paymentRef?: string;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    qty: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    name: { type: String, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [OrderItemSchema],
    total: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['pending', 'paid', 'canceled'], default: 'pending' },
    paymentMethod: { type: String, enum: ['vnpay'], default: 'vnpay' },
    paymentRef: { type: String },
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
