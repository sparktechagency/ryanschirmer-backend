import { Model, ObjectId } from 'mongoose';
import { ICategory } from '../category/category.interface';
import { IUser } from '../user/user.interface';

export interface IProducts {
  title: string;
  price: number;
  author: ObjectId | IUser;
  category: ObjectId | ICategory;
  description: string;
  image: string;
  isDeleted: boolean;
}

export type IProductsModules = Model<IProducts, Record<string, unknown>>;
