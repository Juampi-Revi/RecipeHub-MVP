import jwt, { JwtPayload as JwtLibPayload, SignOptions, VerifyOptions } from 'jsonwebtoken';
import { createLogger } from '../config/logger';

const logger = createLogger();

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export const generateAccessToken = (payload: JwtPayload): string => {
  try {
    const options: SignOptions = {
      expiresIn: JWT_EXPIRES_IN as any,
      issuer: 'recipehub-api',
      audience: 'recipehub-client',
    };
    
    return jwt.sign(payload, JWT_SECRET, options);
  } catch (error) {
    logger.error('Error generating access token:', error);
    throw new Error('Failed to generate access token');
  }
};

export const generateRefreshToken = (payload: JwtPayload): string => {
  try {
    const options: SignOptions = {
      expiresIn: JWT_REFRESH_EXPIRES_IN as any,
      issuer: 'recipehub-api',
      audience: 'recipehub-client',
    };
    
    return jwt.sign(payload, JWT_REFRESH_SECRET, options);
  } catch (error) {
    logger.error('Error generating refresh token:', error);
    throw new Error('Failed to generate refresh token');
  }
};

/**
 * Generate both access and refresh tokens
 */
export const generateTokenPair = (payload: JwtPayload): TokenPair => {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};

/**
 * Verify access token
 */
export const verifyAccessToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'recipehub-api',
      audience: 'recipehub-client',
    }) as JwtPayload;
    
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Access token expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid access token');
    }
    logger.error('Error verifying access token:', error);
    throw new Error('Token verification failed');
  }
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET, {
      issuer: 'recipehub-api',
      audience: 'recipehub-client',
    }) as JwtPayload;
    
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Refresh token expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid refresh token');
    }
    logger.error('Error verifying refresh token:', error);
    throw new Error('Refresh token verification failed');
  }
};

/**
 * Refresh access token using refresh token
 */
export const refreshAccessToken = (refreshToken: string): string => {
  try {
    const decoded = verifyRefreshToken(refreshToken);
    
    const newPayload: JwtPayload = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };
    
    return generateAccessToken(newPayload);
  } catch (error) {
    logger.error('Error refreshing access token:', error);
    throw error;
  }
};

/**
 * Extract token from Authorization header
 */
export const extractTokenFromHeader = (authHeader: string | undefined): string | null => {
  if (!authHeader) {
    return null;
  }
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  
  return parts[1];
};

/**
 * Decode token without verification (for debugging)
 */
export const decodeToken = (token: string): any => {
  try {
    return jwt.decode(token);
  } catch (error) {
    logger.error('Error decoding token:', error);
    return null;
  }
};