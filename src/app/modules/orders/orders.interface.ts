import { Model, ObjectId } from 'mongoose';

export interface IItems {
  product: ObjectId;
  quantity: number;
  price: number;
}

export interface IOrders {
  user: ObjectId;
  author: ObjectId;
  totalPrice: number;
  items: IItems[];
  isPaid: boolean;
  tranId: string;
  isDeleted: boolean;
}

export type IOrdersModules = Model<IOrders, Record<string, unknown>>;
