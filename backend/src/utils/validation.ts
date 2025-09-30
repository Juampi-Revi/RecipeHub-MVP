import { z } from 'zod';

// Common validation patterns
export const emailSchema = z.string().email('Invalid email format');
export const passwordSchema = z.string().min(8, 'Password must be at least 8 characters long');
export const nameSchema = z.string().min(2, 'Name must be at least 2 characters long').max(50, 'Name must be less than 50 characters');
export const roleSchema = z.enum(['USER', 'CHEF', 'ADMIN']);

const idSchema = z.string().cuid('Invalid ID format');

// Auth validation schemas
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
  role: z.enum(['USER', 'CHEF', 'ADMIN']).optional().default('USER'),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: passwordSchema,
});

// User validation schemas
export const updateUserSchema = z.object({
  name: nameSchema.optional(),
  email: emailSchema.optional(),
  role: roleSchema.optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
});

export const userIdSchema = z.object({
  userId: idSchema,
});

// Recipe validation schemas
export const createRecipeSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters long')
    .max(100, 'Title must be less than 100 characters long'),
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  instructions: z.string()
    .min(10, 'Instructions must be at least 10 characters long')
    .max(5000, 'Instructions must be less than 5000 characters'),
  prepTime: z.number()
    .int('Prep time must be an integer')
    .min(1, 'Prep time must be at least 1 minute')
    .max(1440, 'Prep time cannot exceed 24 hours'),
  cookTime: z.number()
    .int('Cook time must be an integer')
    .min(0, 'Cook time cannot be negative')
    .max(1440, 'Cook time cannot exceed 24 hours'),
  servings: z.number()
    .int('Servings must be an integer')
    .min(1, 'Servings must be at least 1')
    .max(50, 'Servings cannot exceed 50'),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).default('MEDIUM'),
  imageUrl: z.string().url('Invalid image URL').optional(),
  estimatedCalories: z.number()
    .int('Calories must be an integer')
    .min(1, 'Calories must be positive')
    .max(10000, 'Calories seem unrealistic')
    .optional(),
  categoryIds: z.array(idSchema).min(1, 'At least one category is required'),
  ingredients: z.array(z.object({
    ingredientId: idSchema,
    quantity: z.number().positive('Quantity must be positive'),
    unit: z.string().max(20, 'Unit must be less than 20 characters').optional(),
    notes: z.string().max(100, 'Notes must be less than 100 characters').optional(),
  })).min(1, 'At least one ingredient is required'),
});

export const updateRecipeSchema = createRecipeSchema.partial().extend({
  isPublished: z.boolean().optional(),
});

export const recipeIdSchema = z.object({
  recipeId: idSchema,
});

// Category validation schemas
export const createCategorySchema = z.object({
  name: z.string()
    .min(2, 'Category name must be at least 2 characters long')
    .max(30, 'Category name must be less than 30 characters long'),
  description: z.string()
    .max(200, 'Description must be less than 200 characters')
    .optional(),
  type: z.enum(['DIFFICULTY', 'MEAL_TYPE', 'CUISINE', 'DIETARY', 'FLAVOR', 'CALORIES', 'OCCASION']),
  color: z.string()
    .regex(/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color')
    .optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

export const categoryIdSchema = z.object({
  categoryId: idSchema,
});

// Ingredient validation schemas
export const createIngredientSchema = z.object({
  name: z.string()
    .min(2, 'Ingredient name must be at least 2 characters long')
    .max(50, 'Ingredient name must be less than 50 characters long'),
  category: z.enum(['PROTEIN', 'VEGETABLE', 'FRUIT', 'GRAIN', 'DAIRY', 'SPICE', 'HERB', 'SAUCE', 'OTHER']),
  unit: z.string()
    .min(1, 'Unit is required')
    .max(20, 'Unit must be less than 20 characters'),
});

export const updateIngredientSchema = createIngredientSchema.partial();

export const ingredientIdSchema = z.object({
  ingredientId: idSchema,
});

// Comment validation schemas
export const createCommentSchema = z.object({
  content: z.string()
    .min(1, 'Comment cannot be empty')
    .max(1000, 'Comment must be less than 1000 characters'),
  recipeId: idSchema,
});

export const updateCommentSchema = z.object({
  content: z.string()
    .min(1, 'Comment cannot be empty')
    .max(1000, 'Comment must be less than 1000 characters'),
});

export const commentIdSchema = z.object({
  commentId: idSchema,
});

// Rating validation schemas
export const createRatingSchema = z.object({
  rating: z.number()
    .int('Rating must be an integer')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot exceed 5'),
  comment: z.string()
    .max(500, 'Rating comment must be less than 500 characters')
    .optional(),
  recipeId: idSchema,
});

export const updateRatingSchema = createRatingSchema.omit({ recipeId: true });

// Query parameter validation schemas
export const paginationSchema = z.object({
  page: z.string().transform(val => parseInt(val, 10)).refine(val => val > 0, 'Page must be greater than 0').optional(),
  limit: z.string().transform(val => parseInt(val, 10)).refine(val => val > 0 && val <= 100, 'Limit must be between 1 and 100').optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const searchSchema = z.object({
  q: z.string().min(1, 'Search query is required'),
  category: z.string().uuid('Invalid category ID').optional(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).optional(),
  maxPrepTime: z.string().transform(val => parseInt(val, 10)).refine(val => val > 0, 'Max prep time must be positive').optional(),
});

// Type exports for TypeScript
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateRecipeInput = z.infer<typeof createRecipeSchema>;
export type UpdateRecipeInput = z.infer<typeof updateRecipeSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CreateIngredientInput = z.infer<typeof createIngredientSchema>;
export type UpdateIngredientInput = z.infer<typeof updateIngredientSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
export type CreateRatingInput = z.infer<typeof createRatingSchema>;
export type UpdateRatingInput = z.infer<typeof updateRatingSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type SearchInput = z.infer<typeof searchSchema>;