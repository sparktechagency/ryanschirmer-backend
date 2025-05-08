import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { artsService } from './arts.service';
import sendResponse from '../../utils/sendResponse';
import { uploadToS3 } from '../../utils/s3';
import generateCryptoString from '../../utils/generateCryptoString';

const createArts = catchAsync(async (req: Request, res: Response) => {
  req.body.author = req.user.userId;
  if (req.file) {
    req.body.image = await uploadToS3({
      file: req.file,
      fileName: generateCryptoString(6),
    });
  }
  const result = await artsService.createArts(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Arts created successfully',
    data: result,
  });
});

const getAllArts = catchAsync(async (req: Request, res: Response) => {
  const result = await artsService.getAllArts(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All arts fetched successfully',
    data: result,
  });
});

const getMyArts = catchAsync(async (req: Request, res: Response) => {
  req.query['author'] = req.user.userId;
  const result = await artsService.getAllArts(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'My arts fetched successfully',
    data: result,
  });
});

const getArtsById = catchAsync(async (req: Request, res: Response) => {
  const result = await artsService.getArtsById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Arts fetched successfully',
    data: result,
  });
});
const updateArts = catchAsync(async (req: Request, res: Response) => {
  if (req.file) {
    req.body.image = await uploadToS3({
      file: req.file,
      fileName: generateCryptoString(6),
    });
  }
  const result = await artsService.updateArts(req.params.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Arts updated successfully',
    data: result,
  });
});

const deleteArts = catchAsync(async (req: Request, res: Response) => {
  const result = await artsService.deleteArts(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Arts deleted successfully',
    data: result,
  });
});

export const artsController = {
  createArts,
  getAllArts,
  getArtsById,
  updateArts,
  deleteArts,
  getMyArts,
};
