
/**
 * Enhanced input sanitization utilities for security
 */

// Sanitize HTML content to prevent XSS attacks
export const sanitizeHtml = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

// Sanitize user input for database queries
export const sanitizeUserInput = (input: string): string => {
  return input
    .replace(/['"\\]/g, '') // Remove quotes and backslashes
    .replace(/[;\-]{2,}/g, '') // Remove SQL injection patterns
    .trim()
    .substring(0, 1000); // Limit length
};

// Sanitize file names
export const sanitizeFileName = (fileName: string): string => {
  return fileName
    .replace(/[^a-zA-Z0-9.\-]/g, '_') // Replace special chars with underscore
    .replace(/\.{2,}/g, '.') // Replace multiple dots with single dot
    .substring(0, 255); // Limit length
};

// Validate and sanitize email
export const sanitizeEmail = (email: string): string => {
  return email
    .toLowerCase()
    .trim()
    .substring(0, 254); // RFC 5321 limit
};

// Sanitize phone numbers
export const sanitizePhoneNumber = (phone: string): string => {
  return phone
    .replace(/[^\d+\-() ]/g, '') // Only allow digits, +, -, (, ), space
    .trim()
    .substring(0, 20);
};

// Validate URL and ensure it's safe
export const validateAndSanitizeUrl = (url: string): string | null => {
  try {
    const sanitized = url.trim();
    
    // Only allow http and https protocols
    if (!sanitized.match(/^https?:\/\//)) {
      return null;
    }
    
    const urlObj = new URL(sanitized);
    
    // Block suspicious domains or IPs
    if (urlObj.hostname === 'localhost' || 
        urlObj.hostname.match(/^\d+\.\d+\.\d+\.\d+$/)) {
      return null;
    }
    
    return urlObj.toString();
  } catch {
    return null;
  }
};

// Rate limiting helper
export const createRateLimiter = (maxAttempts: number, windowMs: number) => {
  const attempts = new Map<string, { count: number; resetTime: number }>();
  
  return (identifier: string): boolean => {
    const now = Date.now();
    const userAttempts = attempts.get(identifier);
    
    if (!userAttempts || now > userAttempts.resetTime) {
      attempts.set(identifier, { count: 1, resetTime: now + windowMs });
      return true;
    }
    
    if (userAttempts.count >= maxAttempts) {
      return false;
    }
    
    userAttempts.count++;
    return true;
  };
};
