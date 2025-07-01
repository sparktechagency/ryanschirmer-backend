import httpStatus from 'http-status';
import { IProducts } from './products.interface';
import Products from './products.models';
import QueryBuilder from '../../class/builder/QueryBuilder';
import AppError from '../../error/AppError';
import { uploadToS3 } from '../../utils/s3';
import { generateImageCode } from '../../utils/generateCryptoString';

const createProducts = async (payload: IProducts, file: any) => {
  if (file) {
    payload.image = (await uploadToS3({
      file: file,
      fileName: `images/service/images/${generateImageCode(6)}`,
    })) as string;
  }

  const result = await Products.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create products');
  }
  return result;
};

const getAllProducts = async (query: Record<string, any>) => {
  const { priceRange, ...queries } = query;
  const productsModel = new QueryBuilder(
    Products.find({ isDeleted: false }).populate([
      {
        path: 'author',
        select: 'name email phoneNumber profile _id designation',
      },
      { path: 'category' },
    ]),
    queries,
  )
    .search(['title'])
    .filter()
    .rangeFilter('price', priceRange)
    .paginate()
    .sort()
    .fields();

  const data = await productsModel.modelQuery;
  const meta = await productsModel.countTotal();

  return {
    data,
    meta,
  };
};

const getProductsById = async (id: string) => {
  const result = await Products.findById(id).populate([
    {
      path: 'author',
      select: 'name email phoneNumber profile _id designation',
    },
    { path: 'category' },
  ]);
  if (!result || result?.isDeleted) {
    throw new Error('Products not found!');
  }
  return result;
};

const updateProducts = async (
  id: string,
  payload: Partial<IProducts>,
  file: any,
) => {
  if (file) {
    payload.image = (await uploadToS3({
      file: file,
      fileName: `images/service/images/${generateImageCode(6)}`,
    })) as string;
  }
  const result = await Products.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error('Failed to update Products');
  }
  return result;
};

const deleteProducts = async (id: string) => {
  const result = await Products.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete products');
  }

  // if (data?.image) {
  //   await deleteFromS3(data?.image);
  // }
  return result;
};

export const productsService = {
  createProducts,
  getAllProducts,
  getProductsById,
  updateProducts,
  deleteProducts,
};
