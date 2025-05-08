import { Model, ObjectId } from 'mongoose';

export interface IArts {
  title: string;
  author: ObjectId;
  price: number;
  category: ObjectId;
  description: string;
  image: string;
  isDeleted:boolean
}

export type IArtsModules = Model<IArts, Record<string, unknown>>;
