import { SecureAuthOperations } from '@/utils/auth/secureAuthOperations';
import { EnhancedRateLimit } from '@/utils/security/enhancedRateLimit';
import { UnifiedValidator } from '@/utils/security/unifiedValidator';
import { validatePasswordStrength } from "@/utils/auth/passwordValidation";

export function useEnhancedSecureAuth() {
  const secureSignIn = async (email: string, password: string) => {
    return await SecureAuthOperations.secureSignIn(email, password);
  };

  const secureSignUp = async (email: string, password: string, name: string) => {
    return await SecureAuthOperations.secureSignUp(email, password, name);
  };

  const secureSignOut = async () => {
    return await SecureAuthOperations.secureSignOut();
  };

  const isEmailLocked = async (email: string) => {
    return await SecureAuthOperations.isEmailLocked(email);
  };

  const checkPasswordStrength = async (password: string) => {
    return await SecureAuthOperations.checkPasswordStrength(password);
  };

  const validateInput = (value: any, rules: any) => {
    return UnifiedValidator.validateInput(value, rules);
  };

  const validateEmail = (email: string) => {
    return UnifiedValidator.validateEmail(email);
  };

  const validatePassword = (password: string) => {
    return UnifiedValidator.validatePassword(password);
  };

  const sanitizeHtml = (input: string) => {
    return UnifiedValidator.sanitizeHtml(input);
  };

  const checkRateLimit = (identifier: string, maxAttempts?: number, windowMs?: number) => {
    return EnhancedRateLimit.checkLimit(identifier, maxAttempts, windowMs);
  };

  const recordSuccess = (identifier: string) => {
    return EnhancedRateLimit.recordSuccess(identifier);
  };

  const clearLimits = (identifier: string) => {
    return EnhancedRateLimit.clearLimits(identifier);
  };

  return {
    secureSignIn,
    secureSignUp,
    secureSignOut,
    isEmailLocked,
    validatePasswordStrength,
    checkPasswordStrength,
    validateInput,
    validateEmail,
    validatePassword,
    sanitizeHtml,
    checkRateLimit,
    recordSuccess,
    clearLimits,
    // Legacy compatibility
    loginAttempts: []
  };
}