import { model, Schema, Types } from 'mongoose';
import { IProducts, IProductsModules } from './products.interface';

const productsSchema = new Schema<IProducts>(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: Types.ObjectId,
      ref: 'Categories',
      required: true,
    },
    author: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      match: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i,
      required: true,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Products = model<IProducts, IProductsModules>('Products', productsSchema);
export default Products;
