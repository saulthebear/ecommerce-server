import { Document } from 'mongoose';

export interface ICartItem {
  productId: string;
  quantity: number;
}

export interface ICart {
  items: ICartItem[];
}
export interface ICartDocument extends ICart, Document {}

export interface IUser {
  uid: string;
  name: string;
  cart: ICart;
}
export default interface IUserDocument extends IUser, Document {}
