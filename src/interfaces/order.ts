import { Date, Document } from 'mongoose';

export interface IOrderProduct extends Document {
  productId: string;
  quantity: number;
  price: number;
}

export interface IPayment extends Document {
  amount: number;
  date: Date;
}

export default interface IOrder extends Document {
  userId: string;
  products: IOrderProduct[];
  payment: IPayment;
}
