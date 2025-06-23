import { Model, ObjectId } from 'mongoose'; 
import { IUser } from './../user/user.interface';
import { IOrders } from '../orders/orders.interface';

export interface IPayments {
  _id?: string;
  user: ObjectId | IUser;
  author: ObjectId | IUser;
  order: ObjectId | IOrders;
  amount: number;
  status: string;
  paymentIntentId: string;
  paymentMethod: 'stripe';
  tranId: string;
  adminAmount: number;
  sellerAmount: number;
  isTransfer: boolean;
  isDeleted: boolean;
}

export type IPaymentsModules = Model<IPayments, Record<string, unknown>>;
