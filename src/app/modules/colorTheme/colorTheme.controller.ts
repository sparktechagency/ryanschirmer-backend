
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';  
import { colorThemeService } from './colorTheme.service';
import sendResponse from '../../utils/sendResponse';
import { storeFile } from '../../utils/fileHelper';
import { uploadToS3 } from '../../utils/s3';

const createColorTheme = catchAsync(async (req: Request, res: Response) => {
 const result = await colorThemeService.createColorTheme(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'ColorTheme created successfully',
    data: result,
  });

});

const getAllColorTheme = catchAsync(async (req: Request, res: Response) => {

 const result = await colorThemeService.getAllColorTheme(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All colorTheme fetched successfully',
    data: result,
  });

});

const getColorThemeById = catchAsync(async (req: Request, res: Response) => {
 const result = await colorThemeService.getColorThemeById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'ColorTheme fetched successfully',
    data: result,
  });

});
const updateColorTheme = catchAsync(async (req: Request, res: Response) => {
const result = await colorThemeService.updateColorTheme(req.params.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'ColorTheme updated successfully',
    data: result,
  });

});


const deleteColorTheme = catchAsync(async (req: Request, res: Response) => {
 const result = await colorThemeService.deleteColorTheme(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'ColorTheme deleted successfully',
    data: result,
  });

});

export const colorThemeController = {
  createColorTheme,
  getAllColorTheme,
  getColorThemeById,
  updateColorTheme,
  deleteColorTheme,
};