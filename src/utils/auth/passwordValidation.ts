
export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  isLeaked?: boolean;
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

export const isLeakedPasswordError = (error: any): boolean => {
  if (!error || !error.message) return false;
  
  const message = error.message.toLowerCase();
  return message.includes('password found in breach') || 
         message.includes('password has been found in data breaches') ||
         message.includes('compromised password') ||
         message.includes('leaked password');
};

export const getLeakedPasswordMessage = (): string => {
  return "This password has been found in data breaches and cannot be used. Please choose a different password for your security.";
};
