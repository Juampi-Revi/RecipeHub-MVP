import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import {
  hashPassword,
  verifyPassword,
  generateTokenPair,
  verifyRefreshToken,
  refreshAccessToken,
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  ValidationError,
  AuthenticationError,
  ConflictError,
  sendSuccessResponse,
  sendErrorResponse,
  asyncHandler,
} from '../utils';

const prisma = new PrismaClient();

interface RefreshTokenStore {
  [userId: string]: string;
}

const refreshTokens: RefreshTokenStore = {};

export const register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const validatedData = registerSchema.parse(req.body);
  const { name, email, password } = validatedData;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ConflictError('User with this email already exists');
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: 'USER',
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };
  
  const { accessToken, refreshToken } = generateTokenPair(payload);
  refreshTokens[user.id] = refreshToken;

  sendSuccessResponse(res, {
    user,
    tokens: {
      accessToken,
      refreshToken,
    },
  }, 'User registered successfully', 201);
});

export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const validatedData = loginSchema.parse(req.body);
  const { email, password } = validatedData;

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new AuthenticationError('Invalid email or password');
  }

  const isPasswordValid = await verifyPassword(password, user.password);

  if (!isPasswordValid) {
    throw new AuthenticationError('Invalid email or password');
  }

  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };
  
  const { accessToken, refreshToken } = generateTokenPair(payload);
  refreshTokens[user.id] = refreshToken;

  const { password: _, ...userWithoutPassword } = user;

  sendSuccessResponse(res, {
    message: 'Login successful',
    data: {
      user: userWithoutPassword,
      tokens: {
        accessToken,
        refreshToken,
      },
    },
  });
});

export const refresh = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const validatedData = refreshTokenSchema.parse(req.body);
  const { refreshToken } = validatedData;

  try {
    const decoded = verifyRefreshToken(refreshToken);
    const userId = decoded.userId;

    if (!refreshTokens[userId] || refreshTokens[userId] !== refreshToken) {
      throw new AuthenticationError('Invalid refresh token');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      throw new AuthenticationError('User not found');
    }

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
    
    const newAccessToken = refreshAccessToken(refreshToken);
    const { accessToken, refreshToken: newRefreshToken } = generateTokenPair(payload);
    
    refreshTokens[userId] = newRefreshToken;

    sendSuccessResponse(res, {
      message: 'Token refreshed successfully',
      data: {
        tokens: {
          accessToken,
          refreshToken: newRefreshToken,
        },
      },
    });
  } catch (error) {
    delete refreshTokens[req.body.userId];
    throw new AuthenticationError('Invalid or expired refresh token');
  }
});

export const logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const validatedData = refreshTokenSchema.parse(req.body);
  const { refreshToken } = validatedData;

  try {
    const decoded = verifyRefreshToken(refreshToken);
    const userId = decoded.userId;
    
    delete refreshTokens[userId];

    sendSuccessResponse(res, {
      message: 'Logout successful',
      data: null,
    });
  } catch (error) {
    sendSuccessResponse(res, {
      message: 'Logout successful',
      data: null,
    });
  }
});

export const logoutAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const validatedData = refreshTokenSchema.parse(req.body);
  const { refreshToken } = validatedData;

  try {
    const decoded = verifyRefreshToken(refreshToken);
    const userId = decoded.userId;
    
    Object.keys(refreshTokens).forEach(key => {
      if (key === userId) {
        delete refreshTokens[key];
      }
    });

    sendSuccessResponse(res, {
      message: 'Logged out from all devices successfully',
      data: null,
    });
  } catch (error) {
    throw new AuthenticationError('Invalid refresh token');
  }
});

export const getProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user?.id;

  if (!userId) {
    throw new AuthenticationError('User not authenticated');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AuthenticationError('User not found');
  }

  sendSuccessResponse(res, {
    message: 'Profile retrieved successfully',
    data: { user },
  });
});