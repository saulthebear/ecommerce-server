import { Schema, model } from 'mongoose';
import IUser from '../interfaces/user';

const UserSchema: Schema = new Schema({
  uid: { type: String, unique: true },
  name: { type: String },
});

export default model<IUser>('User', UserSchema);
