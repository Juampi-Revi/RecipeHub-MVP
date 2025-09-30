import { Request, Response } from 'express';
import { z } from 'zod';
import recipeService from '../services/recipeService';
import { 
  createRecipeSchema, 
  updateRecipeSchema, 
  recipeIdSchema,
  paginationSchema,
  searchSchema,
  recipeFiltersSchema,
  recipeSortSchema
} from '../utils/validation';
import { 
  sendSuccessResponse, 
  sendErrorResponse, 
  handleZodError, 
  ValidationError,
  NotFoundError,
  AuthorizationError,
  asyncHandler 
} from '../utils/errors';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export const createRecipe = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validatedData = createRecipeSchema.parse(req.body);
    const userId = req.user?.id;

    if (!userId) {
      throw new AuthorizationError('User not authenticated');
    }

    const recipe = await recipeService.createRecipe(validatedData, userId);
    
    sendSuccessResponse(res, recipe, 'Recipe created successfully', 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationError = handleZodError(error);
      sendErrorResponse(res, validationError);
    } else {
      sendErrorResponse(res, error as Error);
    }
  }
});

export const getRecipes = asyncHandler(async (req: Request, res: Response) => {
  try {
    const pagination = paginationSchema.parse(req.query);
    const sort = recipeSortSchema.parse(req.query);
    
    const filters: any = {};
    
    if (req.query.search) filters.search = req.query.search;
    if (req.query.categoryIds) {
      filters.categoryIds = Array.isArray(req.query.categoryIds) 
        ? req.query.categoryIds 
        : [req.query.categoryIds];
    }
    if (req.query.difficulty) filters.difficulty = req.query.difficulty;
    // New categorization filters
    if (req.query.complexity) filters.complexity = req.query.complexity;
    if (req.query.flavorType) filters.flavorType = req.query.flavorType;
    if (req.query.mealType) filters.mealType = req.query.mealType;
    if (req.query.isLowCalorie !== undefined) filters.isLowCalorie = req.query.isLowCalorie === 'true';
    if (req.query.maxPrepTime) filters.maxPrepTime = parseInt(req.query.maxPrepTime as string);
    if (req.query.maxCookTime) filters.maxCookTime = parseInt(req.query.maxCookTime as string);
    if (req.query.maxCalories) filters.maxCalories = parseInt(req.query.maxCalories as string);
    if (req.query.minRating) filters.minRating = parseFloat(req.query.minRating as string);
    if (req.query.authorId) filters.authorId = req.query.authorId;
    if (req.query.isPublished !== undefined) filters.isPublished = req.query.isPublished === 'true';
    if (req.query.hasIngredients) {
      filters.hasIngredients = Array.isArray(req.query.hasIngredients) 
        ? req.query.hasIngredients 
        : [req.query.hasIngredients];
    }

    const validatedFilters = recipeFiltersSchema.parse(filters);
    
    const result = await recipeService.getRecipes(validatedFilters, pagination, sort);
    
    sendSuccessResponse(res, result, 'Recipes retrieved successfully');
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationError = handleZodError(error);
      sendErrorResponse(res, validationError);
    } else {
      sendErrorResponse(res, error as Error);
    }
  }
});

export const getRecipeById = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { recipeId } = recipeIdSchema.parse(req.params);
    
    const recipe = await recipeService.getRecipeById(recipeId);
    
    if (!recipe) {
      throw new NotFoundError('Recipe not found');
    }
    
    sendSuccessResponse(res, recipe, 'Recipe retrieved successfully');
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationError = handleZodError(error);
      sendErrorResponse(res, validationError);
    } else {
      sendErrorResponse(res, error as Error);
    }
  }
});

export const updateRecipe = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { recipeId } = recipeIdSchema.parse(req.params);
    const validatedData = updateRecipeSchema.parse(req.body);
    const userId = req.user?.id;

    if (!userId) {
      throw new AuthorizationError('User not authenticated');
    }

    const recipe = await recipeService.updateRecipe(recipeId, validatedData, userId);
    
    sendSuccessResponse(res, recipe, 'Recipe updated successfully');
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationError = handleZodError(error);
      sendErrorResponse(res, validationError);
    } else {
      sendErrorResponse(res, error as Error);
    }
  }
});

export const deleteRecipe = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { recipeId } = recipeIdSchema.parse(req.params);
    const userId = req.user?.id;

    if (!userId) {
      throw new AuthorizationError('User not authenticated');
    }

    await recipeService.deleteRecipe(recipeId, userId);
    
    sendSuccessResponse(res, null, 'Recipe deleted successfully');
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationError = handleZodError(error);
      sendErrorResponse(res, validationError);
    } else {
      sendErrorResponse(res, error as Error);
    }
  }
});

export const searchRecipes = asyncHandler(async (req: Request, res: Response) => {
  try {
    const searchParams = searchSchema.parse(req.query);
    const pagination = paginationSchema.parse(req.query);
    const sort = recipeSortSchema.parse(req.query);
    
    if (!searchParams.q) {
      throw new ValidationError('Search query is required');
    }

    const filters: any = {};
    if (searchParams.category) filters.categoryIds = [searchParams.category];
    if (searchParams.difficulty) filters.difficulty = searchParams.difficulty;
    if (searchParams.maxPrepTime) filters.maxPrepTime = searchParams.maxPrepTime;
    if (searchParams.maxCookTime) filters.maxCookTime = searchParams.maxCookTime;
    if (searchParams.maxCalories) filters.maxCalories = searchParams.maxCalories;
    if (searchParams.minRating) filters.minRating = searchParams.minRating;
    if (searchParams.authorId) filters.authorId = searchParams.authorId;
    if (searchParams.isPublished !== undefined) filters.isPublished = searchParams.isPublished;

    const validatedFilters = recipeFiltersSchema.parse(filters);
    
    const result = await recipeService.searchRecipes(searchParams.q, validatedFilters, pagination, sort);
    
    sendSuccessResponse(res, result, 'Search completed successfully');
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationError = handleZodError(error);
      sendErrorResponse(res, validationError);
    } else {
      sendErrorResponse(res, error as Error);
    }
  }
});

export const getRecipesByAuthor = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { authorId } = z.object({ authorId: z.string().cuid() }).parse(req.params);
    const pagination = paginationSchema.parse(req.query);
    const sort = recipeSortSchema.parse(req.query);
    
    const result = await recipeService.getRecipesByAuthor(authorId, pagination, sort);
    
    sendSuccessResponse(res, result, 'Author recipes retrieved successfully');
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationError = handleZodError(error);
      sendErrorResponse(res, validationError);
    } else {
      sendErrorResponse(res, error as Error);
    }
  }
});

export const toggleLike = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { recipeId } = recipeIdSchema.parse(req.params);
    const userId = req.user?.id;

    if (!userId) {
      throw new AuthorizationError('User not authenticated');
    }

    const result = await recipeService.toggleLike(recipeId, userId);
    
    sendSuccessResponse(res, result, result.liked ? 'Recipe liked' : 'Recipe unliked');
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationError = handleZodError(error);
      sendErrorResponse(res, validationError);
    } else {
      sendErrorResponse(res, error as Error);
    }
  }
});

export const getMyRecipes = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new AuthorizationError('User not authenticated');
    }

    const pagination = paginationSchema.parse(req.query);
    const sort = recipeSortSchema.parse(req.query);
    
    const result = await recipeService.getRecipesByAuthor(userId, pagination, sort);
    
    sendSuccessResponse(res, result, 'My recipes retrieved successfully');
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationError = handleZodError(error);
      sendErrorResponse(res, validationError);
    } else {
      sendErrorResponse(res, error as Error);
    }
  }
});

export const publishRecipe = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { recipeId } = recipeIdSchema.parse(req.params);
    const userId = req.user?.id;

    if (!userId) {
      throw new AuthorizationError('User not authenticated');
    }

    const recipe = await recipeService.updateRecipe(recipeId, { isPublished: true }, userId);
    
    sendSuccessResponse(res, recipe, 'Recipe published successfully');
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationError = handleZodError(error);
      sendErrorResponse(res, validationError);
    } else {
      sendErrorResponse(res, error as Error);
    }
  }
});

export const unpublishRecipe = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { recipeId } = recipeIdSchema.parse(req.params);
    const userId = req.user?.id;

    if (!userId) {
      throw new AuthorizationError('User not authenticated');
    }

    const recipe = await recipeService.updateRecipe(recipeId, { isPublished: false }, userId);
    
    sendSuccessResponse(res, recipe, 'Recipe unpublished successfully');
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationError = handleZodError(error);
      sendErrorResponse(res, validationError);
    } else {
      sendErrorResponse(res, error as Error);
    }
  }
});