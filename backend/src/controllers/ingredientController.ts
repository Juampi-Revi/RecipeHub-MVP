import { Request, Response } from 'express';
import { asyncHandler, sendSuccessResponse } from '../utils';
import { ingredientService } from '../services/ingredientService';

export const getIngredients = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { search, category } = req.query;
  
  const ingredients = await ingredientService.getAllIngredients({
    search: search as string,
    category: category as string,
  });

  sendSuccessResponse(res, ingredients, 'Ingredients retrieved successfully');
});

export const getIngredientById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const ingredient = await ingredientService.getIngredientById(id);

  sendSuccessResponse(res, {
    message: 'Ingredient retrieved successfully',
    data: { ingredient },
  });
});