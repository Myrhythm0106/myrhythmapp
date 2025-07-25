import { supabase } from '@/integrations/supabase/client';
import { SecureLogger } from './secureLogger';

export interface SecurityAuditResult {
  score: number;
  maxScore: number;
  issues: SecurityIssue[];
  recommendations: string[];
}

export interface SecurityIssue {
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  description: string;
  fix?: string;
}

export class SecurityAudit {
  static async performAudit(userId: string): Promise<SecurityAuditResult> {
    const issues: SecurityIssue[] = [];
    const recommendations: string[] = [];
    let score = 0;
    const maxScore = 100;

    try {
      // Check MFA status
      const mfaScore = await this.checkMFAStatus(userId, issues, recommendations);
      score += mfaScore;

      // Check password strength
      const passwordScore = await this.checkPasswordPolicy(userId, issues, recommendations);
      score += passwordScore;

      // Check session security
      const sessionScore = await this.checkSessionSecurity(issues, recommendations);
      score += sessionScore;

      // Check trusted devices
      const deviceScore = await this.checkTrustedDevices(userId, issues, recommendations);
      score += deviceScore;

      // Check recent security events
      const eventsScore = await this.checkSecurityEvents(userId, issues, recommendations);
      score += eventsScore;

      SecureLogger.info('Security audit completed', { 
        userId, 
        score, 
        issueCount: issues.length 
      });

    } catch (error) {
      SecureLogger.error('Security audit failed', error, userId);
      issues.push({
        severity: 'critical',
        category: 'Audit',
        description: 'Security audit could not be completed',
        fix: 'Contact support for assistance'
      });
    }

    return {
      score: Math.max(0, score),
      maxScore,
      issues,
      recommendations
    };
  }

  private static async checkMFAStatus(userId: string, issues: SecurityIssue[], recommendations: string[]): Promise<number> {
    let score = 30; // Max score for MFA

    try {
      const { data: factors } = await supabase
        .from('mfa_factors')
        .select('*')
        .eq('user_id', userId)
        .eq('is_enabled', true);

      if (!factors || factors.length === 0) {
        issues.push({
          severity: 'high',
          category: 'Authentication',
          description: 'Multi-factor authentication is not enabled',
          fix: 'Enable MFA in Security Settings'
        });
        recommendations.push('Enable multi-factor authentication for enhanced security');
        score = 0;
      } else {
        const hasTotp = factors.some(f => f.factor_type === 'totp');
        const hasBackup = factors.some(f => f.factor_type === 'backup_codes');
        
        if (!hasTotp) {
          issues.push({
            severity: 'medium',
            category: 'Authentication',
            description: 'TOTP authenticator app is not configured',
            fix: 'Set up an authenticator app for stronger security'
          });
          score -= 10;
        }
        
        if (!hasBackup) {
          issues.push({
            severity: 'medium',
            category: 'Authentication',
            description: 'Backup codes are not generated',
            fix: 'Generate backup codes for account recovery'
          });
          score -= 10;
        }
      }
    } catch (error) {
      SecureLogger.error('MFA status check failed', error, userId);
      score = 0;
    }

    return score;
  }

  private static async checkPasswordPolicy(userId: string, issues: SecurityIssue[], recommendations: string[]): Promise<number> {
    let score = 20; // Max score for password

    // Note: We can't check actual password strength without the password
    // but we can check last password change, etc.
    try {
      const { data: user } = await supabase.auth.getUser();
      if (user.user) {
        const lastSignIn = new Date(user.user.last_sign_in_at || '');
        const daysSinceLastSignIn = (Date.now() - lastSignIn.getTime()) / (1000 * 60 * 60 * 24);
        
        if (daysSinceLastSignIn > 90) {
          issues.push({
            severity: 'medium',
            category: 'Authentication',
            description: 'Password may be outdated (no recent sign-in)',
            fix: 'Consider changing your password regularly'
          });
          recommendations.push('Change your password every 90 days');
          score -= 5;
        }
      }
    } catch (error) {
      SecureLogger.error('Password policy check failed', error, userId);
    }

    return score;
  }

  private static async checkSessionSecurity(issues: SecurityIssue[], recommendations: string[]): Promise<number> {
    let score = 20; // Max score for session

    // Check if secure storage is being used
    const hasSecureStorage = typeof(Storage) !== 'undefined';
    if (!hasSecureStorage) {
      issues.push({
        severity: 'medium',
        category: 'Session',
        description: 'Browser storage may not be secure',
        fix: 'Use a modern browser with secure storage support'
      });
      score -= 10;
    }

    // Check if HTTPS is being used
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      issues.push({
        severity: 'high',
        category: 'Session',
        description: 'Connection is not encrypted',
        fix: 'Always use HTTPS for secure communication'
      });
      score -= 15;
    }

    return Promise.resolve(score);
  }

  private static async checkTrustedDevices(userId: string, issues: SecurityIssue[], recommendations: string[]): Promise<number> {
    let score = 15; // Max score for devices

    try {
      const { data: devices } = await supabase
        .from('trusted_devices')
        .select('*')
        .eq('user_id', userId);

      if (devices && devices.length > 5) {
        issues.push({
          severity: 'medium',
          category: 'Devices',
          description: 'Too many trusted devices',
          fix: 'Review and remove unused trusted devices'
        });
        recommendations.push('Regularly review and clean up trusted devices');
        score -= 5;
      }

      // Check for expired devices
      const expiredDevices = devices?.filter(d => new Date(d.expires_at) < new Date()) || [];
      if (expiredDevices.length > 0) {
        issues.push({
          severity: 'low',
          category: 'Devices',
          description: 'Some trusted devices have expired',
          fix: 'Clean up expired devices automatically'
        });
        score -= 2;
      }
    } catch (error) {
      SecureLogger.error('Trusted devices check failed', error, userId);
    }

    return score;
  }

  private static async checkSecurityEvents(userId: string, issues: SecurityIssue[], recommendations: string[]): Promise<number> {
    let score = 15; // Max score for events

    try {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      
      const { data: events } = await supabase
        .from('security_events')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: false });

      if (events) {
        const failedLogins = events.filter(e => e.event_type.includes('FAILED'));
        const suspiciousActivity = events.filter(e => 
          e.event_type.includes('SUSPICIOUS') || 
          e.event_type.includes('BLOCKED')
        );

        if (failedLogins.length > 10) {
          issues.push({
            severity: 'medium',
            category: 'Activity',
            description: 'High number of failed login attempts detected',
            fix: 'Review recent login activity and secure your account'
          });
          score -= 5;
        }

        if (suspiciousActivity.length > 0) {
          issues.push({
            severity: 'high',
            category: 'Activity',
            description: 'Suspicious activity detected on your account',
            fix: 'Review security logs and change password if necessary'
          });
          recommendations.push('Monitor account activity regularly');
          score -= 10;
        }
      }
    } catch (error) {
      SecureLogger.error('Security events check failed', error, userId);
    }

    return score;
  }

  static getSecurityScore(issues: SecurityIssue[]): number {
    let deduction = 0;
    
    issues.forEach(issue => {
      switch (issue.severity) {
        case 'critical':
          deduction += 25;
          break;
        case 'high':
          deduction += 15;
          break;
        case 'medium':
          deduction += 10;
          break;
        case 'low':
          deduction += 5;
          break;
      }
    });

    return Math.max(0, 100 - deduction);
  }

  static getScoreColor(score: number): string {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  }

  static getScoreLabel(score: number): string {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  }
}