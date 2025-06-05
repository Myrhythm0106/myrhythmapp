
export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
  score: number;
}

export class PasswordValidator {
  static validatePassword(password: string): PasswordValidationResult {
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
}
