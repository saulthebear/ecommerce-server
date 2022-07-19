import { Document } from 'mongoose';

export enum UserRoles {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
}
export interface ICartItem {
  product: string;
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
  role: UserRoles;
}
export default interface IUserDocument extends IUser, Document {}
