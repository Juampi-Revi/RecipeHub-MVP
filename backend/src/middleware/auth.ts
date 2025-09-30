import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { 
  verifyAccessToken, 
  extractTokenFromHeader,
  AuthenticationError,
  AuthorizationError,
  sendErrorResponse 
} from '../utils';

const prisma = new PrismaClient();

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
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      throw new AuthenticationError('Access token is required');
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

    if (!user) {
      throw new AuthenticationError('User not found');
    }

    req.user = user;
    next();
  } catch (error) {
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