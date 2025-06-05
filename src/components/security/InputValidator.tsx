
import React from "react";
import { toast } from "sonner";

// Enhanced input validation utilities with comprehensive security
export class InputValidator {
  // Enhanced HTML sanitization to prevent XSS
  static sanitizeHtml(input: string): string {
    if (!input) return '';
    
    // Create a temporary div to safely parse HTML
    const div = document.createElement('div');
    div.textContent = input;
    
    // Additional XSS protection
    return div.innerHTML
      .replace(/javascript:/gi, '')
      .replace(/vbscript:/gi, '')
      .replace/on\w+\s*=/gi, '')
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  }

  // Enhanced email validation with additional security checks
  static isValidEmail(email: string): boolean {
    if (!email || email.length > 254) return false;
    
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    // Check for valid format
    if (!emailRegex.test(email)) return false;
    
    // Additional security checks
    const parts = email.split('@');
    if (parts.length !== 2) return false;
    
    const [localPart, domain] = parts;
    
    // Check local part length
    if (localPart.length > 64) return false;
    
    // Check for dangerous patterns
    if (localPart.includes('..') || localPart.startsWith('.') || localPart.endsWith('.')) {
      return false;
    }
    
    return true;
  }

  // Enhanced password validation with security best practices
  static validatePassword(password: string): {
    isValid: boolean;
    errors: string[];
    strength: 'weak' | 'medium' | 'strong';
    score: number;
  } {
    const errors: string[] = [];
    let score = 0;
    
    if (!password) {
      return { isValid: false, errors: ['Password is required'], strength: 'weak', score: 0 };
    }
    
    // Length requirements
    if (password.length < 8) {
      errors.push("Must be at least 8 characters long");
    } else if (password.length >= 8) {
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

    const isValid = errors.length === 0;
    
    // Calculate strength based on score
    let strength: 'weak' | 'medium' | 'strong' = 'weak';
    if (score >= 5 && isValid) {
      strength = 'strong';
    } else if (score >= 3 && errors.length <= 2) {
      strength = 'medium';
    }

    return { isValid, errors, strength, score: Math.max(0, score) };
  }

  // Enhanced text sanitization with SQL injection protection
  static sanitizeText(input: string, maxLength: number = 1000): string {
    if (!input) return '';
    
    // Remove dangerous SQL injection patterns
    const sqlPatterns = [
      /(\bUNION\b|\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b|\bCREATE\b|\bALTER\b)/gi,
      /(\bOR\b|\bAND\b)\s+\d+\s*=\s*\d+/gi,
      /[';"](\s*(OR|AND)\s*)?[';"]?\s*=\s*[';"]?/gi
    ];
    
    let sanitized = input;
    sqlPatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });
    
    // Remove script tags and dangerous HTML
    sanitized = sanitized
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/vbscript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .substring(0, maxLength);
    
    return this.sanitizeHtml(sanitized);
  }

  // Enhanced rate limiting with IP tracking simulation
  private static submissionTimes = new Map<string, number[]>();
  private static blockedIdentifiers = new Set<string>();
  
  static checkRateLimit(identifier: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
    const now = Date.now();
    
    // Check if identifier is blocked
    if (this.blockedIdentifiers.has(identifier)) {
      toast.error("Access temporarily blocked due to suspicious activity.");
      return false;
    }
    
    const attempts = this.submissionTimes.get(identifier) || [];
    
    // Filter out attempts outside the time window
    const recentAttempts = attempts.filter(time => now - time < windowMs);
    
    if (recentAttempts.length >= maxAttempts) {
      // Block identifier for extended period on repeated violations
      if (recentAttempts.length >= maxAttempts * 2) {
        this.blockedIdentifiers.add(identifier);
        setTimeout(() => {
          this.blockedIdentifiers.delete(identifier);
        }, windowMs * 10); // Block for 10x the window time
      }
      
      toast.error("Too many attempts. Please wait before trying again.");
      return false;
    }
    
    // Add current attempt
    recentAttempts.push(now);
    this.submissionTimes.set(identifier, recentAttempts);
    
    return true;
  }

  // Enhanced numeric validation with overflow protection
  static validateNumericRange(value: number, min: number, max: number, fieldName: string): boolean {
    if (isNaN(value) || !isFinite(value)) {
      toast.error(`${fieldName} must be a valid number`);
      return false;
    }
    
    if (value < min || value > max) {
      toast.error(`${fieldName} must be between ${min} and ${max}`);
      return false;
    }
    
    return true;
  }

  // Enhanced date validation with security considerations
  static validateDate(dateString: string, fieldName: string = "Date"): boolean {
    if (!dateString || typeof dateString !== 'string') {
      toast.error(`${fieldName} is required`);
      return false;
    }
    
    // Check for SQL injection in date string
    if (/[';"]|union|select|insert|update|delete|drop/i.test(dateString)) {
      toast.error(`${fieldName} contains invalid characters`);
      return false;
    }
    
    const date = new Date(dateString);
    const now = new Date();
    
    if (isNaN(date.getTime())) {
      toast.error(`${fieldName} format is invalid`);
      return false;
    }
    
    // Security: Prevent extremely old or future dates
    const hundredYearsAgo = new Date(now.getFullYear() - 100, now.getMonth(), now.getDate());
    const tenYearsFromNow = new Date(now.getFullYear() + 10, now.getMonth(), now.getDate());
    
    if (date < hundredYearsAgo || date > tenYearsFromNow) {
      toast.error(`${fieldName} must be within a reasonable range (last 100 years to next 10 years)`);
      return false;
    }
    
    return true;
  }

  // New method: Validate file uploads
  static validateFileUpload(file: File, allowedTypes: string[], maxSizeBytes: number = 5 * 1024 * 1024): boolean {
    if (!file) {
      toast.error("No file selected");
      return false;
    }
    
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      toast.error(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
      return false;
    }
    
    // Check file size
    if (file.size > maxSizeBytes) {
      const maxSizeMB = maxSizeBytes / (1024 * 1024);
      toast.error(`File size too large. Maximum size: ${maxSizeMB}MB`);
      return false;
    }
    
    // Check for dangerous file names
    if (/[<>:"/\\|?*]/.test(file.name) || file.name.startsWith('.')) {
      toast.error("Invalid file name");
      return false;
    }
    
    return true;
  }

  // New method: Validate URLs
  static validateUrl(url: string): boolean {
    if (!url) return false;
    
    try {
      const urlObject = new URL(url);
      
      // Only allow HTTP and HTTPS
      if (!['http:', 'https:'].includes(urlObject.protocol)) {
        toast.error("Only HTTP and HTTPS URLs are allowed");
        return false;
      }
      
      // Block localhost and private IPs for security
      const hostname = urlObject.hostname;
      if (hostname === 'localhost' || 
          hostname.startsWith('127.') || 
          hostname.startsWith('192.168.') || 
          hostname.startsWith('10.') || 
          hostname.startsWith('172.')) {
        toast.error("Local and private network URLs are not allowed");
        return false;
      }
      
      return true;
    } catch {
      toast.error("Invalid URL format");
      return false;
    }
  }
}

// Enhanced password strength component with better security indicators
interface PasswordStrengthProps {
  password: string;
  showErrors?: boolean;
}

export function PasswordStrength({ password, showErrors = true }: PasswordStrengthProps) {
  const validation = InputValidator.validatePassword(password);
  
  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong': return 'text-green-600 bg-green-100 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      default: return 'text-red-600 bg-red-100 border-red-200';
    }
  };

  const getStrengthIcon = (strength: string) => {
    switch (strength) {
      case 'strong': return '🔒';
      case 'medium': return '🔐';
      default: return '🔓';
    }
  };

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className={`text-xs px-3 py-2 rounded border ${getStrengthColor(validation.strength)}`}>
        <div className="flex items-center justify-between">
          <span className="font-medium">
            {getStrengthIcon(validation.strength)} Password strength: {validation.strength}
          </span>
          <span className="text-xs">
            Score: {validation.score}/6
          </span>
        </div>
      </div>
      
      {showErrors && validation.errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded p-2">
          <p className="text-xs font-medium text-red-600 mb-1">Requirements not met:</p>
          <ul className="text-xs text-red-600 space-y-1">
            {validation.errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}
      
      {validation.isValid && (
        <div className="bg-green-50 border border-green-200 rounded p-2">
          <p className="text-xs text-green-600">✓ Password meets all security requirements</p>
        </div>
      )}
    </div>
  );
}
