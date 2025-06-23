import { model, Schema, Types } from 'mongoose';
import { IOrders, IItems, IOrdersModules } from './orders.interface';

const ItemSchema = new Schema<IItems>({
  product: { type: Schema.Types.ObjectId, ref: 'Products', required: true }, 
  price: { type: Number, required: true, min: 0 },
});

const ordersSchema = new Schema<IOrders>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    totalPrice: { type: Number, required: true, min: 0 },
    items: { type: [ItemSchema], required: true },
    isPaid: { type: Boolean, required: true, default: false },
    tranId: { type: String },
    isDeleted: { type: 'boolean', default: false },
  },
  {
    timestamps: true,
  },
);

const Orders = model<IOrders, IOrdersModules>('Orders', ordersSchema);
export default Orders;
