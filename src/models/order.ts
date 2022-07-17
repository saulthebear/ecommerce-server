import { Schema, model } from 'mongoose';
import IOrder, { IOrderProduct, IPayment } from '../interfaces/order';

const orderProductSchema = new Schema<IOrderProduct>({
  productId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Product',
  },
  quantity: Number,
  price: Number,
});

const paymentSchema = new Schema<IPayment>({
  amount: Number,
  date: Date,
});

const orderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    products: [orderProductSchema],
    payment: paymentSchema,
  },
  { timestamps: true }
);

export default model<IOrder>('Order', orderSchema);
