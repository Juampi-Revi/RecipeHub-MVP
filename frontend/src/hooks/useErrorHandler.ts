import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export interface AppError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: unknown;
}

export function useErrorHandler() {
  const { t } = useTranslation();

  const handleError = useCallback((error: unknown): AppError => {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        message: t('error.network.message'),
        code: 'NETWORK_ERROR',
        statusCode: 0,
        details: error
      };
    }

    if (error && typeof error === 'object' && 'status' in error) {
      const httpError = error as { status: number; message?: string };
      
      switch (httpError.status) {
        case 400:
          return {
            message: t('error.badRequest'),
            code: 'BAD_REQUEST',
            statusCode: 400,
            details: error
          };
        case 401:
          return {
            message: t('error.unauthorized'),
            code: 'UNAUTHORIZED',
            statusCode: 401,
            details: error
          };
        case 403:
          return {
            message: t('error.forbidden'),
            code: 'FORBIDDEN',
            statusCode: 403,
            details: error
          };
        case 404:
          return {
            message: t('error.notFound.message'),
            code: 'NOT_FOUND',
            statusCode: 404,
            details: error
          };
        case 422:
          return {
            message: t('error.validation'),
            code: 'VALIDATION_ERROR',
            statusCode: 422,
            details: error
          };
        case 429:
          return {
            message: t('error.tooManyRequests'),
            code: 'TOO_MANY_REQUESTS',
            statusCode: 429,
            details: error
          };
        case 500:
          return {
            message: t('error.serverError'),
            code: 'SERVER_ERROR',
            statusCode: 500,
            details: error
          };
        default:
          return {
            message: httpError.message || t('error.unknown'),
            code: 'HTTP_ERROR',
            statusCode: httpError.status,
            details: error
          };
      }
    }

    // JavaScript errors
    if (error instanceof Error) {
      return {
        message: error.message,
        code: 'JAVASCRIPT_ERROR',
        details: error
      };
    }

    // String errors
    if (typeof error === 'string') {
      return {
        message: error,
        code: 'STRING_ERROR'
      };
    }

    // Unknown errors
    return {
      message: t('error.unknown'),
      code: 'UNKNOWN_ERROR',
      details: error
    };
  }, [t]);

  const isNetworkError = useCallback((error: AppError): boolean => {
    return error.code === 'NETWORK_ERROR' || error.statusCode === 0;
  }, []);

  const isAuthError = useCallback((error: AppError): boolean => {
    return error.statusCode === 401 || error.statusCode === 403;
  }, []);

  const isValidationError = useCallback((error: AppError): boolean => {
    return error.statusCode === 422 || error.code === 'VALIDATION_ERROR';
  }, []);

  const isServerError = useCallback((error: AppError): boolean => {
    return error.statusCode ? error.statusCode >= 500 : false;
  }, []);

  return {
    handleError,
    isNetworkError,
    isAuthError,
    isValidationError,
    isServerError,
  };
}