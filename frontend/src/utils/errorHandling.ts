import type { ApiError } from '../services/api';

export interface AuthErrorInfo {
  message: string;
  translationKey: string;
  type: 'validation' | 'authentication' | 'network' | 'server' | 'unknown';
}

export function getAuthErrorInfo(error: unknown): AuthErrorInfo {
  // Handle API errors
  if (error && typeof error === 'object' && 'message' in error) {
    const apiError = error as ApiError;
    
    // Check for specific authentication errors
    if (apiError.message.toLowerCase().includes('invalid email or password')) {
      return {
        message: 'Invalid email or password',
        translationKey: 'auth.errors.invalidCredentials',
        type: 'authentication'
      };
    }
    
    if (apiError.message.toLowerCase().includes('user not found')) {
      return {
        message: 'User not found',
        translationKey: 'auth.errors.userNotFound',
        type: 'authentication'
      };
    }
    
    if (apiError.message.toLowerCase().includes('email already exists')) {
      return {
        message: 'Email already exists',
        translationKey: 'auth.errors.emailExists',
        type: 'validation'
      };
    }
    
    if (apiError.message.toLowerCase().includes('password')) {
      return {
        message: 'Password requirements not met',
        translationKey: 'auth.errors.passwordRequirements',
        type: 'validation'
      };
    }
    
    // Network errors
    if (apiError.status === 0 || apiError.code === 'NETWORK_ERROR') {
      return {
        message: 'Network connection error',
        translationKey: 'auth.errors.networkError',
        type: 'network'
      };
    }
    
    // Server errors
    if (apiError.status >= 500) {
      return {
        message: 'Server error, please try again later',
        translationKey: 'auth.errors.serverError',
        type: 'server'
      };
    }
    
    // Return the original message for other API errors
    return {
      message: apiError.message,
      translationKey: 'auth.errors.generic',
      type: 'unknown'
    };
  }
  
  // Handle regular Error objects
  if (error instanceof Error) {
    return {
      message: error.message,
      translationKey: 'auth.errors.generic',
      type: 'unknown'
    };
  }
  
  // Fallback for unknown errors
  return {
    message: 'An unexpected error occurred',
    translationKey: 'auth.errors.unexpected',
    type: 'unknown'
  };
}

export function getErrorIcon(type: AuthErrorInfo['type']): string {
  switch (type) {
    case 'validation':
      return '⚠️';
    case 'authentication':
      return '🔒';
    case 'network':
      return '🌐';
    case 'server':
      return '🔧';
    default:
      return '❌';
  }
}