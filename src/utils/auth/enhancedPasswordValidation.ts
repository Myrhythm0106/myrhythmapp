
import { z } from "zod";

// Enhanced password validation schema with stronger requirements
export const enhancedPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/\d/, "Password must contain at least one number")
  .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character");

export const passwordStrengthCheck = (password: string) => {
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const score = Object.values(checks).filter(Boolean).length;
  
  return {
    checks,
    score,
    strength: score < 3 ? 'weak' : score < 4 ? 'medium' : 'strong'
  };
};

export const validatePassword = (password: string) => {
  try {
    enhancedPasswordSchema.parse(password);
    return { isValid: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        isValid: false, 
        errors: error.errors.map(err => err.message) 
      };
    }
    return { isValid: false, errors: ["Password validation failed"] };
  }
};
