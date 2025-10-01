// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  statistics?: {
    recipesCreated: number;
    recipesFavorited: number;
    commentsLeft: number;
  };
}

export interface CreateUserRequest {
  email: string;
  name: string;
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

// Recipe types - Consolidated enums
export const RecipeLevel = {
  EASY: 'EASY',
  MEDIUM: 'MEDIUM',
  HARD: 'HARD',
} as const;

export type RecipeLevelType = typeof RecipeLevel[keyof typeof RecipeLevel];

export const FlavorType = {
  SWEET: 'SWEET',
  SAVORY: 'SAVORY',
} as const;

export type FlavorTypeEnum = typeof FlavorType[keyof typeof FlavorType];

export const MealType = {
  BREAKFAST: 'BREAKFAST',
  LUNCH: 'LUNCH',
  SNACK: 'SNACK',
  DINNER: 'DINNER',
} as const;

export type MealTypeEnum = typeof MealType[keyof typeof MealType];

// Simplified Recipe interface
export interface Recipe {
  id: string;
  title: string;
  description: string;
  instructions: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: RecipeLevelType;
  complexity: RecipeLevelType;
  flavorType: FlavorTypeEnum;
  mealType: MealTypeEnum;
  isLowCalorie: boolean;
  isPublished: boolean;
  imageUrl?: string;
  estimatedCalories?: number;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  author: User;
  categories: RecipeCategory[];
  ingredients: RecipeIngredient[];
  steps?: RecipeStep[];
  ratings: Rating[];
  averageRating?: number;
  totalRatings?: number;
  _count?: RecipeStats;
  isLikedByUser?: boolean;
}

// Simplified nested types
export interface RecipeCategory {
  id: string;
  category: {
    id: string;
    name: string;
    type: string;
    color?: string;
  };
}

export interface RecipeStats {
  likes: number;
  comments: number;
  ratings: number;
}

export interface CreateRecipeRequest {
  title: string;
  description?: string;
  instructions: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: RecipeLevelType;
  complexity: RecipeLevelType;
  flavorType: FlavorTypeEnum;
  mealType: MealTypeEnum;
  isLowCalorie: boolean;
  imageUrl?: string;
  estimatedCalories?: number;
  isPublished?: boolean;
  categoryIds: string[];
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

// Recipe Step types
export interface RecipeStep {
  id: string;
  stepNumber: number;
  instruction: string;
  imageUrl?: string;
  duration?: number;
  recipeId: string;
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

// Simplified filters
export interface RecipeFilters {
  category?: string;
  difficulty?: RecipeLevelType;
  complexity?: RecipeLevelType;
  flavorType?: FlavorTypeEnum;
  mealType?: MealTypeEnum;
  isLowCalorie?: boolean;
  isPublished?: boolean;
  prepTimeMax?: number;
  cookTimeMax?: number;
  caloriesMax?: number;
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

// Legacy type aliases for backward compatibility
export type DifficultyType = RecipeLevelType;
export type ComplexityType = RecipeLevelType;
export const Difficulty = RecipeLevel;
export const Complexity = RecipeLevel;