
export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validatePasswordStrength = (password: string): PasswordValidationResult => {
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
    errors.push("Must contain at least one special character (@$!%*?&)");
  }

  // Check for common patterns
  if (/(.)\1{2,}/.test(password)) {
    errors.push("Cannot contain repeated characters");
  }

  if (/123|abc|password|qwerty/i.test(password)) {
    errors.push("Cannot contain common patterns");
  }

  return { isValid: errors.length === 0, errors };
};
