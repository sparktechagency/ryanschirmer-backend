import httpStatus from 'http-status';
import { IArts } from './arts.interface';
import Arts from './arts.models';
import AppError from '../../error/AppError';
import QueryBuilder from '../../class/builder/QueryBuilder';

const createArts = async (payload: IArts) => {
  const result = await Arts.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create arts');
  }
  return result;
};

const getAllArts = async (query: Record<string, any>) => {
  const artsModel = new QueryBuilder(Arts.find({ isDeleted: false }), query)
    .search(['title'])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await artsModel.modelQuery;
  const meta = await artsModel.countTotal();

  return {
    data,
    meta,
  };
};

const getArtsById = async (id: string) => {
  const result = await Arts.findById(id);
  if (!result || result?.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Arts not found!');
  }
  return result;
};

const updateArts = async (id: string, payload: Partial<IArts>) => {
  const result = await Arts.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST,'Failed to update Arts');
  }
  return result;
};

const deleteArts = async (id: string) => {
  const result = await Arts.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete arts');
  }
  return result;
};

export const artsService = {
  createArts,
  getAllArts,
  getArtsById,
  updateArts,
  deleteArts,
};
