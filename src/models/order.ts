import { Schema, model, Types } from 'mongoose';
import IOrder, { IOrderProduct, IPayment } from '../interfaces/order';

const orderProductSchema = new Schema<IOrderProduct>({
  productId: String,
  quantity: Number,
  price: Number,
});

const paymentSchema = new Schema<IPayment>({
  amount: Number,
  date: Date,
});

const orderSchema = new Schema<IOrder>(
  {
    userId: Types.ObjectId,
    products: [orderProductSchema],
    payment: paymentSchema,
  },
  { timestamps: true }
);

export default model<IOrder>('Order', orderSchema);
