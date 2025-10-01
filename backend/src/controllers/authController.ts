import { Request, Response } from 'express';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  logoutSchema,
  sendSuccessResponse,
  asyncHandler,
} from '../utils';
import authService from '../services/authService';
import { AuthenticatedRequest } from '../middleware/auth';

export const register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const validatedData = registerSchema.parse(req.body);
  const result = await authService.register(validatedData);

  sendSuccessResponse(res, {
    user: result.user,
    tokens: {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    },
  }, 'User registered successfully', 201);
});

export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const validatedData = loginSchema.parse(req.body);
  const result = await authService.login(validatedData);

  sendSuccessResponse(res, {
    user: result.user,
    tokens: {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    },
  }, 'Login successful');
});

export const refresh = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const validatedData = refreshTokenSchema.parse(req.body);
  const { refreshToken } = validatedData;
  
  const result = await authService.refreshToken(refreshToken);

  sendSuccessResponse(res, {
    tokens: result,
  }, 'Token refreshed successfully');
});

export const logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const validatedData = logoutSchema.parse(req.body);
  const { refreshToken } = validatedData;

  if (refreshToken) {
    await authService.logout(refreshToken);
  }

  sendSuccessResponse(res, null, 'Logout successful');
});

export const logoutAll = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  
  if (!userId) {
    res.status(401).json({
      success: false,
      error: {
        message: 'Unauthorized',
        statusCode: 401,
      },
    });
    return;
  }

  await authService.logoutAll(userId);

  sendSuccessResponse(res, null, 'All sessions logged out successfully');
});

export const getProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  
  if (!userId) {
    res.status(401).json({
      success: false,
      error: {
        message: 'Unauthorized',
        statusCode: 401,
      },
    });
    return;
  }

  const profile = await authService.getProfile(userId);

  sendSuccessResponse(res, { profile }, 'Profile retrieved successfully');
});

export const getStatistics = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  
  if (!userId) {
    res.status(401).json({
      success: false,
      error: {
        message: 'Unauthorized',
        statusCode: 401,
      },
    });
    return;
  }

  const statistics = await authService.getStatistics(userId);

  sendSuccessResponse(res, { statistics }, 'Statistics retrieved successfully');
});