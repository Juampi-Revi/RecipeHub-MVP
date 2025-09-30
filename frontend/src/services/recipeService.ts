import { apiClient } from './api';
import type {
  Recipe,
  CreateRecipeRequest,
  UpdateRecipeRequest,
  PaginatedResponse,
  Category,
  Ingredient,
  Rating,
} from '../types';

export interface RecipeSearchParams {
  search?: string;
  categoryIds?: string[];
  difficulty?: string;
  // New categorization filters
  complexity?: string;
  flavorType?: string;
  mealType?: string;
  isLowCalorie?: boolean;
  maxPrepTime?: number;
  maxCookTime?: number;
  maxCalories?: number;
  authorId?: string;
  isPublished?: boolean;
  hasIngredients?: string[];
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface RecipeListResponse {
  recipes: Recipe[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export class RecipeService {
  async getRecipes(params?: RecipeSearchParams): Promise<RecipeListResponse> {
    const queryParams = params ? this.buildQueryParams(params) : undefined;
    return apiClient.get<RecipeListResponse>('/recipes', queryParams);
  }

  async getRecipeById(id: string): Promise<Recipe> {
    return apiClient.get<Recipe>(`/recipes/${id}`);
  }

  async createRecipe(recipeData: CreateRecipeRequest): Promise<Recipe> {
    return apiClient.post<Recipe>('/recipes', recipeData);
  }

  async updateRecipe(id: string, recipeData: UpdateRecipeRequest): Promise<Recipe> {
    return apiClient.put<Recipe>(`/recipes/${id}`, recipeData);
  }

  async deleteRecipe(id: string): Promise<void> {
    await apiClient.delete(`/recipes/${id}`);
  }

  async searchRecipes(params: RecipeSearchParams): Promise<RecipeListResponse> {
    const queryParams = this.buildQueryParams(params);
    return apiClient.get<RecipeListResponse>('/recipes/search', queryParams);
  }

  async getMyRecipes(params?: RecipeSearchParams): Promise<RecipeListResponse> {
    const queryParams = params ? this.buildQueryParams(params) : undefined;
    return apiClient.get<RecipeListResponse>('/recipes/my', queryParams);
  }

  async getRecipesByAuthor(authorId: string, params?: RecipeSearchParams): Promise<RecipeListResponse> {
    const queryParams = params ? this.buildQueryParams(params) : undefined;
    return apiClient.get<RecipeListResponse>(`/recipes/author/${authorId}`, queryParams);
  }

  async toggleLike(recipeId: string): Promise<{ liked: boolean; likesCount: number }> {
    return apiClient.post<{ liked: boolean; likesCount: number }>(`/recipes/${recipeId}/like`);
  }

  async publishRecipe(recipeId: string): Promise<Recipe> {
    return apiClient.patch<Recipe>(`/recipes/${recipeId}/publish`);
  }

  async unpublishRecipe(recipeId: string): Promise<Recipe> {
    return apiClient.patch<Recipe>(`/recipes/${recipeId}/unpublish`);
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return apiClient.get<Category[]>('/categories');
  }

  async getCategoryById(id: string): Promise<Category> {
    return apiClient.get<Category>(`/categories/${id}`);
  }

  // Ingredients
  async getIngredients(search?: string): Promise<Ingredient[]> {
    const params = search ? { search } : undefined;
    return apiClient.get<Ingredient[]>('/ingredients', params);
  }

  async getIngredientById(id: string): Promise<Ingredient> {
    return apiClient.get<Ingredient>(`/ingredients/${id}`);
  }

  async createIngredient(name: string, unit?: string): Promise<Ingredient> {
    return apiClient.post<Ingredient>('/ingredients', { name, unit });
  }

  // Recipe ratings
  async rateRecipe(recipeId: string, rating: number, comment?: string): Promise<void> {
    await apiClient.post(`/recipes/${recipeId}/ratings`, {
      rating,
      comment,
    });
  }

  async getRecipeRatings(recipeId: string, page = 1, limit = 10): Promise<PaginatedResponse<Rating>> {
    return apiClient.get<PaginatedResponse<Rating>>(`/recipes/${recipeId}/ratings`, {
      page,
      limit,
    });
  }

  // Utility methods for building query parameters
  buildQueryParams(params: RecipeSearchParams): Record<string, unknown> {
    const queryParams: Record<string, unknown> = {};

    if (params.search) queryParams.search = params.search;
    if (params.categoryIds?.length) queryParams.categoryIds = params.categoryIds.join(',');
    if (params.difficulty) queryParams.difficulty = params.difficulty;
    // New categorization filters
    if (params.complexity) queryParams.complexity = params.complexity;
    if (params.flavorType) queryParams.flavorType = params.flavorType;
    if (params.mealType) queryParams.mealType = params.mealType;
    if (params.isLowCalorie !== undefined) queryParams.isLowCalorie = params.isLowCalorie;
    if (params.maxPrepTime) queryParams.maxPrepTime = params.maxPrepTime;
    if (params.maxCookTime) queryParams.maxCookTime = params.maxCookTime;
    if (params.maxCalories) queryParams.maxCalories = params.maxCalories;
    if (params.authorId) queryParams.authorId = params.authorId;
    if (params.isPublished !== undefined) queryParams.isPublished = params.isPublished;
    if (params.hasIngredients?.length) queryParams.hasIngredients = params.hasIngredients.join(',');
    if (params.page) queryParams.page = params.page;
    if (params.limit) queryParams.limit = params.limit;
    if (params.sortBy) queryParams.sortBy = params.sortBy;
    if (params.sortOrder) queryParams.sortOrder = params.sortOrder;

    return queryParams;
  }
}

export const recipeService = new RecipeService();
export default recipeService;