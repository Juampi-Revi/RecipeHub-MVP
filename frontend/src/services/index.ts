// API Client
export { apiClient, type ApiError, type ApiResponse } from './api';

// Services
export { authService, AuthService, type AuthResponse, type RefreshTokenResponse } from './authService';
export { recipeService, RecipeService, type RecipeSearchParams, type RecipeListResponse } from './recipeService';

// Re-export commonly used types
export type {
  User,
  Recipe,
  Category,
  Ingredient,
  CreateRecipeRequest,
  UpdateRecipeRequest,
  LoginRequest,
  CreateUserRequest,
  PaginatedResponse,
} from '../types';