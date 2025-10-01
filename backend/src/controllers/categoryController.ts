import { Request, Response } from 'express';
import { asyncHandler, sendSuccessResponse } from '../utils';
import { categoryService } from '../services/categoryService';

export const getCategories = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const categories = await categoryService.getAllCategories();
  sendSuccessResponse(res, categories, 'Categories retrieved successfully');
});

export const getCategoryById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const category = await categoryService.getCategoryById(id);
  
  sendSuccessResponse(res, {
    message: 'Category retrieved successfully',
    data: { category },
  });
});