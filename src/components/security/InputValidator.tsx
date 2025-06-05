
import React from "react";
import { toast } from "sonner";

// Input validation utilities
export class InputValidator {
  // Sanitize HTML input to prevent XSS
  static sanitizeHtml(input: string): string {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }

  // Validate email format
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate password strength
  static validatePassword(password: string): {
    isValid: boolean;
    errors: string[];
    strength: 'weak' | 'medium' | 'strong';
  } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push("Must be at least 8 characters long");
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push("Must contain at least one lowercase letter");
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push("Must contain at least one uppercase letter");
    }
    
    if (!/\d/.test(password)) {
      errors.push("Must contain at least one number");
    }
    
    if (!/[@$!%*?&]/.test(password)) {
      errors.push("Must contain at least one special character");
    }

    const isValid = errors.length === 0;
    
    let strength: 'weak' | 'medium' | 'strong' = 'weak';
    if (password.length >= 12 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password) && /[@$!%*?&]/.test(password)) {
      strength = 'strong';
    } else if (password.length >= 8 && errors.length <= 2) {
      strength = 'medium';
    }

    return { isValid, errors, strength };
  }

  // Validate and sanitize text input
  static sanitizeText(input: string, maxLength: number = 1000): string {
    if (!input) return '';
    
    // Remove dangerous characters and limit length
    const sanitized = input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/javascript:/gi, '') // Remove javascript: protocols
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .substring(0, maxLength);
    
    return this.sanitizeHtml(sanitized);
  }

  // Rate limiting for form submissions
  private static submissionTimes = new Map<string, number[]>();
  
  static checkRateLimit(identifier: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
    const now = Date.now();
    const attempts = this.submissionTimes.get(identifier) || [];
    
    // Filter out attempts outside the time window
    const recentAttempts = attempts.filter(time => now - time < windowMs);
    
    if (recentAttempts.length >= maxAttempts) {
      toast.error("Too many attempts. Please wait before trying again.");
      return false;
    }
    
    // Add current attempt
    recentAttempts.push(now);
    this.submissionTimes.set(identifier, recentAttempts);
    
    return true;
  }

  // Validate numeric input ranges
  static validateNumericRange(value: number, min: number, max: number, fieldName: string): boolean {
    if (value < min || value > max) {
      toast.error(`${fieldName} must be between ${min} and ${max}`);
      return false;
    }
    return true;
  }

  // Validate date input
  static validateDate(dateString: string): boolean {
    const date = new Date(dateString);
    const now = new Date();
    
    if (isNaN(date.getTime())) {
      toast.error("Invalid date format");
      return false;
    }
    
    // Check if date is too far in the past or future
    const hundredYearsAgo = new Date(now.getFullYear() - 100, now.getMonth(), now.getDate());
    const tenYearsFromNow = new Date(now.getFullYear() + 10, now.getMonth(), now.getDate());
    
    if (date < hundredYearsAgo || date > tenYearsFromNow) {
      toast.error("Date must be within a reasonable range");
      return false;
    }
    
    return true;
  }
}

// React component for password strength indicator
interface PasswordStrengthProps {
  password: string;
  showErrors?: boolean;
}

export function PasswordStrength({ password, showErrors = true }: PasswordStrengthProps) {
  const validation = InputValidator.validatePassword(password);
  
  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-red-600 bg-red-100';
    }
  };

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className={`text-xs px-2 py-1 rounded ${getStrengthColor(validation.strength)}`}>
        Password strength: {validation.strength}
      </div>
      
      {showErrors && validation.errors.length > 0 && (
        <ul className="text-xs text-red-600 space-y-1">
          {validation.errors.map((error, index) => (
            <li key={index}>• {error}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
