import { Document } from 'mongoose';

export interface ICategory {
  title: string;
  description: string;
}

export default interface ICategoryDocument extends ICategory, Document {}
