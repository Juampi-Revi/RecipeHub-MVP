import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { 
  verifyAccessToken, 
  extractTokenFromHeader,
  AuthenticationError,
  AuthorizationError,
  sendErrorResponse 
} from '../utils';
import { createLogger } from '../config/logger';

const prisma = new PrismaClient();
const logger = createLogger();

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    logger.info(`🔐 Auth middleware - ${req.method} ${req.path}`, {
      hasAuthHeader: !!req.headers.authorization,
      userAgent: req.get('User-Agent'),
    });

    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      logger.warn('🚫 No token provided');
      throw new AuthenticationError('Access token is required');
    }

    logger.info('🔍 Verifying token...');
    const decoded = verifyAccessToken(token);
    logger.info('✅ Token verified successfully', { userId: decoded.userId });
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      logger.warn('🚫 User not found in database', { userId: decoded.userId });
      throw new AuthenticationError('User not found');
    }

    logger.info('✅ User found and authenticated', { userId: user.id, email: user.email });
    req.user = user;
    next();
  } catch (error) {
    logger.error('❌ Authentication failed', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      path: req.path,
      method: req.method 
    });
    
    if (error instanceof AuthenticationError) {
      sendErrorResponse(res, error);
    } else {
      sendErrorResponse(res, new AuthenticationError('Invalid or expired token'));
    }
  }
};

export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      return next();
    }

    const decoded = verifyAccessToken(token);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (user) {
      req.user = user;
    }

    next();
  } catch (error) {
    next();
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return sendErrorResponse(res, new AuthenticationError('Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendErrorResponse(res, new AuthorizationError('Insufficient permissions'));
    }

    next();
  };
};

export const requireAdmin = requireRole(['ADMIN']);
export const requireChef = requireRole(['CHEF', 'ADMIN']);
export const requireUser = requireRole(['USER', 'CHEF', 'ADMIN']);