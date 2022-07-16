import { Schema, model } from 'mongoose';
import IOrder, { IOrderProduct, IPayment } from '../interfaces/order';

const orderProductSchema = new Schema<IOrderProduct>({
  quantity: Number,
  price: Number,
});

const paymentSchema = new Schema<IPayment>({
  amount: Number,
  date: Date,
});

const orderSchema = new Schema<IOrder>(
  {
    products: [orderProductSchema],
    payment: paymentSchema,
  },
  { timestamps: true }
);

export default model<IOrder>('Order', orderSchema);
