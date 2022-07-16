import { Document, Types } from 'mongoose';

export interface IReview {
  userId: Types.ObjectId;
  rating: number;
  comment: string;
}

export interface IReviewDocument extends IReview, Types.Subdocument {}

export interface IProduct {
  title: string;
  price: number;
  description: string;
  image_url: string;
  category: string;
  reviews: Types.DocumentArray<IReviewDocument>;
}
export default interface IProductDocument extends IProduct, Document {}
