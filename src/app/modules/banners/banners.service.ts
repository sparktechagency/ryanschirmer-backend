import httpStatus from 'http-status';
import { IBanners } from './banners.interface';
import Banners from './banners.models';
import QueryBuilder from '../../class/builder/QueryBuilder';
import AppError from '../../error/AppError';
import { deleteFromS3, uploadToS3 } from './../../utils/s3';
import { generateImageCode } from '../../utils/generateCryptoString';

const createBanners = async (payload: IBanners, file: any) => {
  const isExist = await Banners.isExistByCategory(payload?.category);
  if (isExist) {
    throw new AppError(
      httpStatus.BAD_GATEWAY,
      'This type of banner already exist',
    );
  }
  if (file) {
    payload.image = (await uploadToS3({
      file,
      fileName: generateImageCode(5),
    })) as string;
  }

  const result = await Banners.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create banners');
  }
  return result;
};

const getAllBanners = async (query: Record<string, any>) => {
  const bannersModel = new QueryBuilder(Banners.find(), query)
    .search(['category'])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await bannersModel.modelQuery;
  const meta = await bannersModel.countTotal();

  return {
    data,
    meta,
  };
};

const getBannersById = async (id: string) => {
  const result = await Banners.findById(id);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Banners not found!');
  }
  return result;
};

const updateBanners = async (
  id: string,
  payload: Partial<IBanners>,
  file: any,
) => {
  if (file) {
    payload.image = (await uploadToS3({
      file,
      fileName: generateImageCode(5),
    })) as string;
  }

  const result = await Banners.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update Banners');
  }
  return result;
};

const deleteBanners = async (id: string) => {
  const data = await Banners.findById(id);
  if (data?.image) {
    await deleteFromS3(data?.image);
  }
  const result = await Banners.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete banners');
  }
  return result;
};

export const bannersService = {
  createBanners,
  getAllBanners,
  getBannersById,
  updateBanners,
  deleteBanners,
};
