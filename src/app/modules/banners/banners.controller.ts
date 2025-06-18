import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { bannersService } from './banners.service';
import sendResponse from '../../utils/sendResponse';

const createBanners = catchAsync(async (req: Request, res: Response) => {
  const result = await bannersService.createBanners(req.body, req.file);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Banners created successfully',
    data: result,
  });
});

const getAllBanners = catchAsync(async (req: Request, res: Response) => {
  const result = await bannersService.getAllBanners(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All banners fetched successfully',
    data: result,
  });
});

const getBannersById = catchAsync(async (req: Request, res: Response) => {
  const result = await bannersService.getBannersById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Banners fetched successfully',
    data: result,
  });
});
const updateBanners = catchAsync(async (req: Request, res: Response) => {
  const result = await bannersService.updateBanners(
    req.params.id,
    req.body,
    req.file,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Banners updated successfully',
    data: result,
  });
});

const deleteBanners = catchAsync(async (req: Request, res: Response) => {
  const result = await bannersService.deleteBanners(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Banners deleted successfully',
    data: result,
  });
});

export const bannersController = {
  createBanners,
  getAllBanners,
  getBannersById,
  updateBanners,
  deleteBanners,
};
