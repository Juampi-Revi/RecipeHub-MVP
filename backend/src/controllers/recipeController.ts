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
    // Parse pagination with defaults
    const pagination = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? Math.min(parseInt(req.query.limit as string), 50) : 20
    };
    
    const sort = recipeSortSchema.parse(req.query);
    
    // Build filters object with only the specific filters we need
    const filters: any = {};
    
    // Search by recipe name/title
    if (req.query.search) {
      filters.search = req.query.search;
    }
    
    // Filter by category
    if (req.query.category) {
      filters.categoryIds = Array.isArray(req.query.category) 
        ? req.query.category 
        : [req.query.category];
    }
    
    // Filter by complexity
    if (req.query.complexity) {
      filters.complexity = req.query.complexity;
    }
    
    // Filter by meal type
    if (req.query.mealType) {
      filters.mealType = req.query.mealType;
    }
    
    // Always show only published recipes for public endpoint
    filters.isPublished = true;

    const validatedFilters = recipeFiltersSchema.parse(filters);
    
    // Get userId from request if user is authenticated
    const userId = (req as AuthenticatedRequest).user?.id;
    
    const result = await recipeService.getRecipes(validatedFilters, pagination, sort, userId);
    
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
    
    // Get userId from request if user is authenticated
    const userId = (req as AuthenticatedRequest).user?.id;
    
    const recipe = await recipeService.getRecipeById(recipeId, userId);
    
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
    
    // Get userId from request if user is authenticated
    const userId = (req as AuthenticatedRequest).user?.id;
    
    const result = await recipeService.searchRecipes(searchParams.q, validatedFilters, pagination, sort, userId);
    
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
    
    // Get userId from request if user is authenticated
    const userId = (req as AuthenticatedRequest).user?.id;
    
    const result = await recipeService.getRecipesByAuthor(authorId, pagination, sort, userId);
    
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

export const getFavoriteRecipes = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new AuthorizationError('User not authenticated');
    }

    const pagination = paginationSchema.parse(req.query);
    const sort = recipeSortSchema.parse(req.query);
    
    const result = await recipeService.getFavoriteRecipes(userId, pagination, sort);
    
    sendSuccessResponse(res, result, 'Favorite recipes retrieved successfully');
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationError = handleZodError(error);
      sendErrorResponse(res, validationError);
    } else {
      sendErrorResponse(res, error as Error);
    }
  }
});