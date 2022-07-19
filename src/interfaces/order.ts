import { Date, Document, Types } from 'mongoose';

export interface IOrderProduct extends Document {
  product: Types.ObjectId;
  quantity: number;
  price: number;
}

// export interface IPayment extends Document {
//   amount: number;
//   date: Date;
// }

export default interface IOrder extends Document {
  userId: Types.ObjectId;
  products: IOrderProduct[];
  stripeSessionId: string;
  // payment: IPayment;
}
