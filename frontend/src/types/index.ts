// User types
export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Recipe types
export const Difficulty = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
} as const;

export type DifficultyType = typeof Difficulty[keyof typeof Difficulty];

export interface Recipe {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  servings: number;
  difficulty: DifficultyType;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  author: User;
  categoryId: string;
  category: Category;
  ingredients: RecipeIngredient[];
  ratings: Rating[];
  averageRating?: number;
  totalRatings?: number;
}

export interface CreateRecipeRequest {
  title: string;
  description?: string;
  instructions: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: DifficultyType;
  categoryId: string;
  ingredients: CreateRecipeIngredientRequest[];
}

export interface UpdateRecipeRequest extends Partial<CreateRecipeRequest> {
  isPublished?: boolean;
}

// Category types
export interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Ingredient types
export interface Ingredient {
  id: string;
  name: string;
  unit?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecipeIngredient {
  id: string;
  quantity: number;
  unit?: string;
  notes?: string;
  recipeId: string;
  ingredientId: string;
  ingredient: Ingredient;
}

export interface CreateRecipeIngredientRequest {
  ingredientId: string;
  quantity: number;
  unit?: string;
  notes?: string;
}

// Rating types
export interface Rating {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  recipeId: string;
  user: User;
}

export interface CreateRatingRequest {
  rating: number;
  comment?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    statusCode?: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Query parameters
export interface RecipeFilters {
  category?: string;
  difficulty?: DifficultyType;
  prepTimeMax?: number;
  cookTimeMax?: number;
  search?: string;
  author?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SortParams {
  sortBy?: 'createdAt' | 'title' | 'prepTime' | 'cookTime' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

export type RecipeQueryParams = RecipeFilters & PaginationParams & SortParams;