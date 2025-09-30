// JWT utilities
export * from './jwt';

// Password utilities
export * from './password';

// Validation schemas
export * from './validation';

// Error handling utilities
export * from './errors';

// Re-export commonly used utilities with aliases for convenience
export {
  generateAccessToken,
  generateRefreshToken,
  generateTokenPair,
  verifyAccessToken,
  verifyRefreshToken,
  refreshAccessToken,
  extractTokenFromHeader,
  decodeToken,
} from './jwt';

export {
  hashPassword,
  verifyPassword,
  validatePasswordStrength,
  generateRandomPassword,
  needsRehash,
} from './password';

export {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  changePasswordSchema,
  updateUserSchema,
  createRecipeSchema,
  updateRecipeSchema,
  createCategorySchema,
  updateCategorySchema,
  createIngredientSchema,
  updateIngredientSchema,
  createCommentSchema,
  createRatingSchema,
  paginationSchema,
  searchSchema,
} from './validation';

export {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  DatabaseError,
  ExternalServiceError,
  sendErrorResponse,
  sendSuccessResponse,
  handleZodError,
  handlePrismaError,
  asyncHandler,
  createPaginationMeta,
  validateEnvVars,
} from './errors';