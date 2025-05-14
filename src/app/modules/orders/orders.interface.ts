import { Model, ObjectId } from 'mongoose';

interface IItems {
  product: ObjectId;
  quantity: number;
  price: number;
}

export interface IOrders {
  user: ObjectId;
  author: ObjectId;
  totalPrice: number;
  items: IItems[];
}

export type IOrdersModules = Model<IOrders, Record<string, unknown>>;
