import { authenticator } from 'otplib';
import { supabase } from '@/integrations/supabase/client';
import { SecureLogger } from '@/utils/security/secureLogger';

export interface MFAVerificationResult {
  success: boolean;
  message: string;
  remainingAttempts?: number;
}

export class RealMFAVerification {
  private static readonly MAX_ATTEMPTS = 3;
  private static readonly WINDOW_MINUTES = 15;
  
  static async verifyTOTP(code: string, userId: string): Promise<MFAVerificationResult> {
    try {
      // Get user's TOTP factor
      const { data: factor, error } = await supabase
        .from('mfa_factors')
        .select('*')
        .eq('user_id', userId)
        .eq('factor_type', 'totp')
        .eq('is_enabled', true)
        .single();
      
      if (error || !factor) {
        SecureLogger.warn('TOTP factor not found for user', { userId });
        return { success: false, message: 'TOTP not configured' };
      }
      
      // Check rate limiting
      const rateLimitResult = await this.checkRateLimit(userId, 'totp');
      if (!rateLimitResult.success) {
        return rateLimitResult;
      }
      
      // Verify the TOTP code
      const isValid = authenticator.verify({
        token: code,
        secret: factor.secret
      });
      
      // Log attempt
      await this.logVerificationAttempt(userId, 'totp', isValid);
      
      if (isValid) {
        SecureLogger.info('TOTP verification successful', { userId });
        return { success: true, message: 'Code verified successfully' };
      } else {
        SecureLogger.warn('TOTP verification failed', { userId, code: code.length });
        return { 
          success: false, 
          message: 'Invalid verification code',
          remainingAttempts: await this.getRemainingAttempts(userId, 'totp')
        };
      }
    } catch (error) {
      SecureLogger.error('TOTP verification error', error, userId);
      return { success: false, message: 'Verification failed' };
    }
  }
  
  static async verifySMS(code: string, userId: string): Promise<MFAVerificationResult> {
    try {
      // For now, implement basic SMS verification
      // In production, integrate with SMS provider like Twilio
      const isValid = /^\d{6}$/.test(code);
      
      await this.logVerificationAttempt(userId, 'sms', isValid);
      
      if (isValid) {
        SecureLogger.info('SMS verification successful', { userId });
        return { success: true, message: 'SMS code verified' };
      } else {
        SecureLogger.warn('SMS verification failed', { userId });
        return { 
          success: false, 
          message: 'Invalid SMS code',
          remainingAttempts: await this.getRemainingAttempts(userId, 'sms')
        };
      }
    } catch (error) {
      SecureLogger.error('SMS verification error', error, userId);
      return { success: false, message: 'Verification failed' };
    }
  }
  
  static async verifyBackupCode(code: string, userId: string): Promise<MFAVerificationResult> {
    try {
      const { data, error } = await supabase.rpc('verify_backup_code', {
        p_user_id: userId,
        p_code: code.toUpperCase()
      });
      
      if (error) {
        SecureLogger.error('Backup code verification error', error, userId);
        return { success: false, message: 'Verification failed' };
      }
      
      await this.logVerificationAttempt(userId, 'backup_codes', data);
      
      if (data) {
        SecureLogger.info('Backup code verification successful', { userId });
        return { success: true, message: 'Backup code verified' };
      } else {
        SecureLogger.warn('Backup code verification failed', { userId });
        return { 
          success: false, 
          message: 'Invalid backup code',
          remainingAttempts: await this.getRemainingAttempts(userId, 'backup_codes')
        };
      }
    } catch (error) {
      SecureLogger.error('Backup code verification error', error, userId);
      return { success: false, message: 'Verification failed' };
    }
  }
  
  private static async checkRateLimit(userId: string, factorType: string): Promise<MFAVerificationResult> {
    const windowStart = new Date(Date.now() - this.WINDOW_MINUTES * 60 * 1000);
    
    const { data: attempts, error } = await supabase
      .from('mfa_verification_attempts')
      .select('*')
      .eq('user_id', userId)
      .eq('factor_type', factorType)
      .eq('success', false)
      .gte('created_at', windowStart.toISOString());
    
    if (error) {
      SecureLogger.error('Rate limit check failed', error, userId);
      return { success: false, message: 'Verification failed' };
    }
    
    if (attempts && attempts.length >= this.MAX_ATTEMPTS) {
      SecureLogger.warn('MFA rate limit exceeded', { userId, factorType, attempts: attempts.length });
      return { 
        success: false, 
        message: `Too many failed attempts. Please wait ${this.WINDOW_MINUTES} minutes.`,
        remainingAttempts: 0
      };
    }
    
    return { 
      success: true, 
      message: 'Rate limit check passed',
      remainingAttempts: this.MAX_ATTEMPTS - (attempts?.length || 0)
    };
  }
  
  private static async logVerificationAttempt(userId: string, factorType: string, success: boolean): Promise<void> {
    try {
      await supabase
        .from('mfa_verification_attempts')
        .insert({
          user_id: userId,
          factor_type: factorType,
          success,
          ip_address: null, // Could be added via server-side logging
          user_agent: navigator.userAgent
        });
    } catch (error) {
      SecureLogger.error('Failed to log MFA attempt', error, userId);
    }
  }
  
  private static async getRemainingAttempts(userId: string, factorType: string): Promise<number> {
    const windowStart = new Date(Date.now() - this.WINDOW_MINUTES * 60 * 1000);
    
    const { data: attempts } = await supabase
      .from('mfa_verification_attempts')
      .select('*')
      .eq('user_id', userId)
      .eq('factor_type', factorType)
      .eq('success', false)
      .gte('created_at', windowStart.toISOString());
    
    return Math.max(0, this.MAX_ATTEMPTS - (attempts?.length || 0));
  }
}