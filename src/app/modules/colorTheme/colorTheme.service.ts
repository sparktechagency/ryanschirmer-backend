
import httpStatus from 'http-status';
import { IColorTheme } from './colorTheme.interface';
import ColorTheme from './colorTheme.models';
import QueryBuilder from '../../class/builder/QueryBuilder';
import AppError from '../../error/AppError';

const createColorTheme = async (payload: IColorTheme) => {
  const result = await ColorTheme.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create colorTheme');
  }
  return result;
};

const getAllColorTheme = async (query: Record<string, any>) => {
query["isDeleted"] = false;
  const colorThemeModel = new QueryBuilder(ColorTheme.find({isDeleted: false}), query)
    .search([""])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await colorThemeModel.modelQuery;
  const meta = await colorThemeModel.countTotal();

  return {
    data,
    meta,
  };
};

const getColorThemeById = async (id: string) => {
  const result = await ColorTheme.findById(id);
  if (!result || result?.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST,'ColorTheme not found!');
  }
  return result;
};

const updateColorTheme = async (id: string, payload: Partial<IColorTheme>) => {
  const result = await ColorTheme.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST,'Failed to update ColorTheme');
  }
  return result;
};

const deleteColorTheme = async (id: string) => {
  const result = await ColorTheme.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete colorTheme');
  }
  return result;
};

export const colorThemeService = {
  createColorTheme,
  getAllColorTheme,
  getColorThemeById,
  updateColorTheme,
  deleteColorTheme,
};