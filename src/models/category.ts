import { Schema, model } from 'mongoose';
import ICategoryDocument from '../interfaces/category';

const CategorySchema = new Schema<ICategoryDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model<ICategoryDocument>('Category', CategorySchema);
