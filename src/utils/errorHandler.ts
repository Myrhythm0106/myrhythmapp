import { toast } from "sonner";

export type ErrorLevel = 'info' | 'warning' | 'error' | 'critical';

export interface AppError extends Error {
  level: ErrorLevel;
  code?: string;
  context?: Record<string, any>;
  timestamp: Date;
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLog: AppError[] = [];

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  createError(
    message: string, 
    level: ErrorLevel = 'error', 
    code?: string, 
    context?: Record<string, any>
  ): AppError {
    const error = new Error(message) as AppError;
    error.level = level;
    error.code = code;
    error.context = context;
    error.timestamp = new Date();
    return error;
  }

  logError(error: AppError | Error): void {
    const appError = this.normalizeError(error);
    
    // Add to local log
    this.errorLog.push(appError);
    
    // Keep only last 100 errors to prevent memory issues
    if (this.errorLog.length > 100) {
      this.errorLog = this.errorLog.slice(-100);
    }

    // Console logging based on level
    switch (appError.level) {
      case 'critical':
        console.error('🔴 CRITICAL ERROR:', appError);
        break;
      case 'error':
        console.error('❌ ERROR:', appError);
        break;
      case 'warning':
        console.warn('⚠️ WARNING:', appError);
        break;
      case 'info':
        console.info('ℹ️ INFO:', appError);
        break;
    }
  }

  handleError(error: AppError | Error, showToast: boolean = true): void {
    const appError = this.normalizeError(error);
    
    this.logError(appError);

    if (showToast) {
      this.showUserError(appError);
    }
  }

  private normalizeError(error: AppError | Error): AppError {
    if ('level' in error) {
      return error;
    }
    
    return this.createError(
      error.message || 'An unexpected error occurred',
      'error',
      'UNKNOWN_ERROR',
      { originalError: error }
    );
  }

  private showUserError(error: AppError): void {
    const userMessage = this.getUserFriendlyMessage(error);
    
    switch (error.level) {
      case 'critical':
      case 'error':
        toast.error(userMessage);
        break;
      case 'warning':
        toast.warning(userMessage);
        break;
      case 'info':
        toast.info(userMessage);
        break;
    }
  }

  private getUserFriendlyMessage(error: AppError): string {
    // Map technical errors to user-friendly messages
    const errorMap: Record<string, string> = {
      'NETWORK_ERROR': 'Unable to connect. Please check your internet connection.',
      'AUTH_ERROR': 'Authentication failed. Please sign in again.',
      'VALIDATION_ERROR': 'Please check your input and try again.',
      'PERMISSION_ERROR': 'You don\'t have permission to perform this action.',
      'NOT_FOUND': 'The requested information could not be found.',
      'SERVER_ERROR': 'Server is temporarily unavailable. Please try again later.',
    };

    return errorMap[error.code || ''] || error.message || 'Something went wrong. Please try again.';
  }

  getErrorLog(): AppError[] {
    return [...this.errorLog];
  }

  clearErrorLog(): void {
    this.errorLog = [];
  }
}

export const errorHandler = ErrorHandler.getInstance();
