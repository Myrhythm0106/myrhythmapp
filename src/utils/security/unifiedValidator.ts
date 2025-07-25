import { SecureLogger } from './secureLogger';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedValue?: any;
}

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  customValidator?: (value: any) => boolean;
  sanitizer?: (value: any) => any;
}

export class UnifiedValidator {
  // Email validation with comprehensive checks
  static validateEmail(email: string): ValidationResult {
    const errors: string[] = [];
    
    if (!email) {
      return { isValid: false, errors: ['Email is required'] };
    }
    
    // Comprehensive email regex
    const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    if (!emailPattern.test(email)) {
      errors.push('Invalid email format');
    }
    
    if (email.length > 254) {
      errors.push('Email too long');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: email.toLowerCase().trim()
    };
  }
  
  // Password validation with comprehensive security checks
  static validatePassword(password: string): ValidationResult {
    const errors: string[] = [];
    let score = 0;
    
    if (!password) {
      return { isValid: false, errors: ['Password is required'] };
    }
    
    // Length requirements
    if (password.length < 8) {
      errors.push("Must be at least 8 characters long");
    } else {
      score += 1;
    }
    
    if (password.length >= 12) {
      score += 1;
    }
    
    // Character requirements
    if (!/[a-z]/.test(password)) {
      errors.push("Must contain at least one lowercase letter");
    } else {
      score += 1;
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push("Must contain at least one uppercase letter");
    } else {
      score += 1;
    }
    
    if (!/\d/.test(password)) {
      errors.push("Must contain at least one number");
    } else {
      score += 1;
    }
    
    if (!/[@$!%*?&]/.test(password)) {
      errors.push("Must contain at least one special character (@$!%*?&)");
    } else {
      score += 1;
    }

    // Security patterns to avoid
    if (/(.)\1{2,}/.test(password)) {
      errors.push("Cannot contain more than 2 repeated characters");
      score -= 1;
    }
    
    // Common patterns check
    const commonPatterns = [
      /123/i, /abc/i, /password/i, /qwerty/i, /admin/i, 
      /login/i, /welcome/i, /monkey/i, /dragon/i
    ];
    
    if (commonPatterns.some(pattern => pattern.test(password))) {
      errors.push("Cannot contain common patterns or dictionary words");
      score -= 1;
    }
    
    // Sequential characters
    if (/(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(password)) {
      errors.push("Cannot contain sequential characters");
      score -= 1;
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: password // Don't sanitize passwords
    };
  }
  
  // General input validation
  static validateInput(value: any, rules: ValidationRule): ValidationResult {
    const errors: string[] = [];
    let sanitizedValue = value;
    
    // Apply sanitizer first if provided
    if (rules.sanitizer) {
      sanitizedValue = rules.sanitizer(value);
    }
    
    // Required check
    if (rules.required && (!sanitizedValue || sanitizedValue.toString().trim() === '')) {
      errors.push('This field is required');
      return { isValid: false, errors, sanitizedValue };
    }
    
    // Skip other validations if not required and empty
    if (!rules.required && (!sanitizedValue || sanitizedValue.toString().trim() === '')) {
      return { isValid: true, errors: [], sanitizedValue };
    }
    
    const stringValue = sanitizedValue.toString();
    
    // Length validations
    if (rules.minLength && stringValue.length < rules.minLength) {
      errors.push(`Must be at least ${rules.minLength} characters long`);
    }
    
    if (rules.maxLength && stringValue.length > rules.maxLength) {
      errors.push(`Must be no more than ${rules.maxLength} characters long`);
    }
    
    // Pattern validation
    if (rules.pattern && !rules.pattern.test(stringValue)) {
      errors.push('Invalid format');
    }
    
    // Custom validation
    if (rules.customValidator && !rules.customValidator(sanitizedValue)) {
      errors.push('Invalid value');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue
    };
  }
  
  // HTML sanitization
  static sanitizeHtml(input: string): string {
    if (!input) return input;
    
    return input
      .replace(/[<>\"']/g, (match) => {
        const escapeMap: { [key: string]: string } = {
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;'
        };
        return escapeMap[match];
      });
  }
  
  // URL validation
  static validateUrl(url: string): ValidationResult {
    const errors: string[] = [];
    
    if (!url) {
      return { isValid: false, errors: ['URL is required'] };
    }
    
    try {
      const urlObj = new URL(url);
      
      // Only allow http and https protocols
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        errors.push('Only HTTP and HTTPS URLs are allowed');
      }
      
      // Prevent localhost and private IPs in production
      if (import.meta.env.PROD && (
        urlObj.hostname === 'localhost' ||
        urlObj.hostname.startsWith('127.') ||
        urlObj.hostname.startsWith('192.168.') ||
        urlObj.hostname.startsWith('10.') ||
        (urlObj.hostname.startsWith('172.') && 
         parseInt(urlObj.hostname.split('.')[1]) >= 16 && 
         parseInt(urlObj.hostname.split('.')[1]) <= 31)
      )) {
        errors.push('Private network URLs are not allowed');
      }
      
    } catch (error) {
      errors.push('Invalid URL format');
      SecureLogger.warn('URL validation failed', { url: url.substring(0, 50), error });
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: url.trim()
    };
  }
  
  // Phone number validation
  static validatePhoneNumber(phone: string): ValidationResult {
    const errors: string[] = [];
    
    if (!phone) {
      return { isValid: false, errors: ['Phone number is required'] };
    }
    
    // Remove all non-digit characters for validation
    const digitsOnly = phone.replace(/\D/g, '');
    
    if (digitsOnly.length < 10) {
      errors.push('Phone number must be at least 10 digits');
    }
    
    if (digitsOnly.length > 15) {
      errors.push('Phone number must be no more than 15 digits');
    }
    
    // Basic international format check
    const phonePattern = /^\+?[1-9]\d{1,14}$/;
    if (!phonePattern.test(digitsOnly)) {
      errors.push('Invalid phone number format');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: phone.trim()
    };
  }
  
  // File upload validation
  static validateFile(file: File, allowedTypes: string[], maxSizeMB: number): ValidationResult {
    const errors: string[] = [];
    
    if (!file) {
      return { isValid: false, errors: ['File is required'] };
    }
    
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      errors.push(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
    }
    
    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      errors.push(`File size must be less than ${maxSizeMB}MB`);
    }
    
    // Check for potentially dangerous extensions
    const dangerousExtensions = ['.exe', '.bat', '.com', '.scr', '.pif', '.vbs', '.js'];
    const fileName = file.name.toLowerCase();
    if (dangerousExtensions.some(ext => fileName.endsWith(ext))) {
      errors.push('File type not allowed for security reasons');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: file
    };
  }
}