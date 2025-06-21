
import { useCallback } from 'react';
import { errorHandler, ErrorLevel, AppError } from '@/utils/errorHandler';

export function useErrorHandler() {
  const handleError = useCallback((
    error: Error | string,
    level: ErrorLevel = 'error',
    code?: string,
    context?: Record<string, any>,
    showToast: boolean = true
  ) => {
    const appError = typeof error === 'string' 
      ? errorHandler.createError(error, level, code, context)
      : error as AppError;
    
    errorHandler.handleError(appError, showToast);
  }, []);

  const handleAsyncError = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    fallbackValue?: T,
    errorMessage?: string
  ): Promise<T | undefined> => {
    try {
      return await asyncFn();
    } catch (error) {
      handleError(
        error instanceof Error ? error : new Error(errorMessage || 'Async operation failed'),
        'error',
        'ASYNC_ERROR'
      );
      return fallbackValue;
    }
  }, [handleError]);

  return {
    handleError,
    handleAsyncError,
    getErrorLog: errorHandler.getErrorLog.bind(errorHandler),
    clearErrorLog: errorHandler.clearErrorLog.bind(errorHandler)
  };
}
