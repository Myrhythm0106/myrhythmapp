import { supabase } from '@/integrations/supabase/client';
import { SecureLogger } from '@/utils/security/secureLogger';
import { EnhancedRateLimit } from '@/utils/security/enhancedRateLimit';
import { UnifiedValidator } from '@/utils/security/unifiedValidator';
import { SessionSecurity } from '@/utils/security/sessionSecurity';

export interface SecureAuthResult {
  success: boolean;
  error?: any;
  requiresMFA?: boolean;
  lockoutTimeRemaining?: number;
}

export class SecureAuthOperations {
  static async secureSignUp(email: string, password: string, name: string): Promise<SecureAuthResult> {
    try {
      // Input validation
      const emailValidation = UnifiedValidator.validateEmail(email);
      if (!emailValidation.isValid) {
        SecureLogger.warn('Sign up failed: Invalid email', { errors: emailValidation.errors });
        return { success: false, error: new Error(emailValidation.errors[0]) };
      }

      const passwordValidation = UnifiedValidator.validatePassword(password);
      if (!passwordValidation.isValid) {
        SecureLogger.warn('Sign up failed: Weak password', { errors: passwordValidation.errors });
        return { success: false, error: new Error(passwordValidation.errors[0]) };
      }

      // Rate limiting
      const rateLimitResult = EnhancedRateLimit.checkAuthLimit(email);
      if (!rateLimitResult.allowed) {
        SecureLogger.warn('Sign up blocked: Rate limit exceeded', { email: email.substring(0, 3) + '***' });
        return { 
          success: false, 
          error: new Error('Too many attempts. Please wait before trying again.'),
          lockoutTimeRemaining: rateLimitResult.retryAfter 
        };
      }

      SecureLogger.info('Secure sign up attempt', { email: email.substring(0, 3) + '***' });

      const { data, error } = await supabase.auth.signUp({
        email: emailValidation.sanitizedValue,
        password,
        options: {
          data: { name: UnifiedValidator.sanitizeHtml(name) },
          emailRedirectTo: `${window.location.origin}/auth`
        }
      });

      if (error) {
        SecureLogger.error('Sign up failed', error, data?.user?.id);
        return { success: false, error };
      }

      // Clear rate limit on success
      EnhancedRateLimit.recordSuccess(`auth:${email}`);
      
      SecureLogger.info('Sign up successful', { userId: data.user?.id });
      return { success: true };

    } catch (error) {
      SecureLogger.error('Sign up exception', error);
      return { success: false, error };
    }
  }

  static async secureSignIn(email: string, password: string): Promise<SecureAuthResult> {
    try {
      // Input validation
      const emailValidation = UnifiedValidator.validateEmail(email);
      if (!emailValidation.isValid) {
        SecureLogger.warn('Sign in failed: Invalid email format', { errors: emailValidation.errors });
        return { success: false, error: new Error('Invalid email format') };
      }

      // Rate limiting
      const rateLimitResult = EnhancedRateLimit.checkAuthLimit(email);
      if (!rateLimitResult.allowed) {
        SecureLogger.warn('Sign in blocked: Rate limit exceeded', { 
          email: email.substring(0, 3) + '***',
          retryAfter: rateLimitResult.retryAfter 
        });
        return { 
          success: false, 
          error: new Error(`Too many attempts. Please wait ${rateLimitResult.retryAfter} seconds.`),
          lockoutTimeRemaining: rateLimitResult.retryAfter 
        };
      }

      SecureLogger.info('Secure sign in attempt', { email: email.substring(0, 3) + '***' });

      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailValidation.sanitizedValue,
        password,
      });

      if (error) {
        SecureLogger.warn('Sign in failed', { 
          error: error.message, 
          email: email.substring(0, 3) + '***' 
        });
        
        // Check if user needs MFA
        if (error.message.includes('mfa')) {
          return { success: false, error, requiresMFA: true };
        }
        
        return { success: false, error };
      }

      // Clear rate limit on success
      EnhancedRateLimit.recordSuccess(`auth:${email}`);
      
      // Start secure session
      SessionSecurity.startSession();
      
      SecureLogger.info('Sign in successful', { userId: data.user?.id });
      return { success: true };

    } catch (error) {
      SecureLogger.error('Sign in exception', error);
      return { success: false, error };
    }
  }

  static async secureSignOut(): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      SecureLogger.info('Secure sign out', { userId: user?.id });
      
      // End secure session
      await SessionSecurity.endSession('USER_LOGOUT');
      
    } catch (error) {
      SecureLogger.error('Sign out error', error);
      throw error;
    }
  }

  static async isEmailLocked(email: string): Promise<boolean> {
    const rateLimitResult = EnhancedRateLimit.checkAuthLimit(email);
    return !rateLimitResult.allowed;
  }

  static async checkPasswordStrength(password: string): Promise<{ score: number; feedback: string[] }> {
    const validation = UnifiedValidator.validatePassword(password);
    return {
      score: validation.isValid ? 100 : Math.max(0, 100 - (validation.errors.length * 20)),
      feedback: validation.errors
    };
  }
}