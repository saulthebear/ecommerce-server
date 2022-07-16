import { Schema, model } from 'mongoose';
import IProduct, { IReviewDocument } from '../interfaces/product';

const ReviewSchema = new Schema<IReviewDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  rating: {
    type: Number,
    required: true,
  },
  comment: String,
});

const ProductSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    image_url: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
    reviews: [ReviewSchema],
  },
  {
    timestamps: true,
  }
);

export default model<IProduct>('Product', ProductSchema);
