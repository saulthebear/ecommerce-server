import { Schema, model } from 'mongoose';
import IOrder, { IOrderProduct } from '../interfaces/order';

const orderProductSchema = new Schema<IOrderProduct>({
  product: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Product',
  },
  quantity: Number,
  price: Number,
});

// const paymentSchema = new Schema<IPayment>({
//   amount: Number,
//   date: Date,
// });

const orderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    products: [orderProductSchema],
    stripeSessionId: String,
    // payment: paymentSchema,
  },
  { timestamps: true }
);

export default model<IOrder>('Order', orderSchema);
