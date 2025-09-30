export * from './jwt';
export * from './password';
export * from './validation';
export * from './errors';

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