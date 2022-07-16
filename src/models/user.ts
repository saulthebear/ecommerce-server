import { Schema, model } from 'mongoose';
import IUser, { ICart } from '../interfaces/user';

const CartSchema = new Schema<ICart>({
  items: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
    },
  ],
});

const UserSchema = new Schema<IUser>({
  uid: { type: String, unique: true },
  name: { type: String },
  cart: CartSchema,
});

export default model<IUser>('User', UserSchema);
