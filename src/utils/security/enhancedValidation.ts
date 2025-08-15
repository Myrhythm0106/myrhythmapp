/**
 * Enhanced validation utilities for comprehensive input security
 */

import { InputValidator } from './inputValidator';

export class EnhancedValidation {
  /**
   * Validates and sanitizes all form inputs with comprehensive security checks
   */
  static validateFormInput(
    input: string,
    type: 'text' | 'email' | 'password' | 'phone' | 'url' | 'html',
    maxLength: number = 1000
  ): { isValid: boolean; sanitized: string; errors: string[] } {
    const errors: string[] = [];
    let sanitized = input;

    // Basic sanitization first
    sanitized = InputValidator.sanitizeText(input, maxLength);

    // Type-specific validation
    switch (type) {
      case 'email':
        if (!InputValidator.isValidEmail(sanitized)) {
          errors.push('Invalid email format');
        }
        break;
      case 'password':
        const passwordResult = InputValidator.validatePassword(sanitized);
        if (!passwordResult.isValid) {
          errors.push(...passwordResult.errors);
        }
        break;
      case 'phone':
        sanitized = this.sanitizePhoneNumber(sanitized);
        break;
      case 'url':
        if (!InputValidator.validateUrl(sanitized)) {
          errors.push('Invalid URL format');
        }
        break;
      case 'html':
        sanitized = InputValidator.sanitizeHtml(sanitized);
        break;
      default:
        // Additional text validation
        if (this.containsSuspiciousPatterns(sanitized)) {
          errors.push('Input contains suspicious patterns');
        }
    }

    return {
      isValid: errors.length === 0,
      sanitized,
      errors
    };
  }

  /**
   * Checks for suspicious patterns that could indicate malicious input
   */
  private static containsSuspiciousPatterns(input: string): boolean {
    const suspiciousPatterns = [
      // Script injection attempts
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      // SQL injection patterns
      /(\bUNION\b|\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b)/gi,
      // XSS attempts
      /javascript:/gi,
      /vbscript:/gi,
      /on\w+\s*=/gi,
      // Path traversal
      /\.\.\//g,
      // Command injection
      /[;&|`$()]/g
    ];

    return suspiciousPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Sanitizes phone numbers with enhanced security
   */
  private static sanitizePhoneNumber(phone: string): string {
    return phone
      .replace(/[^\d+\-() ]/g, '') // Only allow digits, +, -, (, ), space
      .trim()
      .substring(0, 20); // Limit length
  }

  /**
   * Rate-limited validation for sensitive operations
   */
  static validateWithRateLimit(
    identifier: string,
    input: string,
    type: 'text' | 'email' | 'password' | 'phone' | 'url' | 'html',
    maxAttempts: number = 5,
    windowMs: number = 60000
  ): { isValid: boolean; sanitized: string; errors: string[]; rateLimited: boolean } {
    // Check rate limit first
    const rateLimitPassed = InputValidator.checkRateLimit(identifier, maxAttempts, windowMs);
    
    if (!rateLimitPassed) {
      return {
        isValid: false,
        sanitized: '',
        errors: ['Rate limit exceeded'],
        rateLimited: true
      };
    }

    const validationResult = this.validateFormInput(input, type);
    
    return {
      ...validationResult,
      rateLimited: false
    };
  }

  /**
   * Validates file uploads with enhanced security
   */
  static validateSecureFileUpload(
    file: File,
    allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/gif'],
    maxSizeMB: number = 5
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Use existing file validator as base
    const baseValidation = InputValidator.validateFileUpload(file, allowedTypes, maxSizeMB * 1024 * 1024);
    
    if (!baseValidation) {
      errors.push('File validation failed');
    }

    // Additional security checks
    if (this.hasDoubleExtension(file.name)) {
      errors.push('Files with double extensions are not allowed');
    }

    if (this.hasExecutableExtension(file.name)) {
      errors.push('Executable files are not allowed');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Checks for double file extensions (potential security risk)
   */
  private static hasDoubleExtension(filename: string): boolean {
    const parts = filename.split('.');
    return parts.length > 2;
  }

  /**
   * Checks for executable file extensions
   */
  private static hasExecutableExtension(filename: string): boolean {
    const executableExtensions = [
      'exe', 'bat', 'cmd', 'com', 'pif', 'scr', 'vbs', 'js', 'jar', 'app', 'deb', 'pkg', 'dmg'
    ];
    
    const extension = filename.split('.').pop()?.toLowerCase();
    return extension ? executableExtensions.includes(extension) : false;
  }
}