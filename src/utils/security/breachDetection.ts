import { SecureLogger } from './secureLogger';
import { supabase } from '@/integrations/supabase/client';

export interface BreachDetectionResult {
  isSuspicious: boolean;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  indicators: string[];
  recommendedActions: string[];
}

export interface SecurityMonitoringConfig {
  enableRealTimeMonitoring: boolean;
  failedLoginThreshold: number;
  suspiciousActivityWindow: number;
  autoBlockThreshold: number;
}

export class BreachDetection {
  private static config: SecurityMonitoringConfig = {
    enableRealTimeMonitoring: true,
    failedLoginThreshold: 5,
    suspiciousActivityWindow: 900000, // 15 minutes
    autoBlockThreshold: 10
  };

  static async analyzeUserActivity(userId: string): Promise<BreachDetectionResult> {
    try {
      const indicators: string[] = [];
      let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
      const recommendedActions: string[] = [];

      // Check for failed login attempts
      const recentFailedLogins = await this.getRecentFailedLogins(userId);
      if (recentFailedLogins >= this.config.failedLoginThreshold) {
        indicators.push(`${recentFailedLogins} failed login attempts in last 15 minutes`);
        riskLevel = recentFailedLogins >= this.config.autoBlockThreshold ? 'critical' : 'high';
        recommendedActions.push('Force password reset');
        recommendedActions.push('Enable additional MFA verification');
      }

      // Check for unusual access patterns
      const unusualAccess = await this.detectUnusualAccess(userId);
      if (unusualAccess.detected) {
        indicators.push(...unusualAccess.indicators);
        if (riskLevel === 'low') riskLevel = 'medium';
        recommendedActions.push('Review recent access logs');
      }

      // Check for concurrent sessions
      const concurrentSessions = await this.detectConcurrentSessions(userId);
      if (concurrentSessions > 3) {
        indicators.push(`${concurrentSessions} concurrent sessions detected`);
        if (riskLevel === 'low') riskLevel = 'medium';
        recommendedActions.push('Terminate suspicious sessions');
      }

      // Check for data access anomalies
      const dataAnomalies = await this.detectDataAccessAnomalies(userId);
      if (dataAnomalies.detected) {
        indicators.push(...dataAnomalies.indicators);
        if (riskLevel !== 'critical') riskLevel = 'high';
        recommendedActions.push('Audit data access permissions');
      }

      const isSuspicious = indicators.length > 0;

      if (isSuspicious) {
        SecureLogger.critical('Suspicious activity detected', {
          userId,
          riskLevel,
          indicators,
          timestamp: new Date().toISOString()
        });

        // Auto-trigger security response for critical threats
        if (riskLevel === 'critical') {
          await this.triggerSecurityResponse(userId, indicators);
        }
      }

      return {
        isSuspicious,
        riskLevel,
        indicators,
        recommendedActions
      };

    } catch (error) {
      SecureLogger.error('Breach detection analysis failed', error, userId);
      return {
        isSuspicious: false,
        riskLevel: 'low',
        indicators: ['Analysis failed - manual review required'],
        recommendedActions: ['Contact security team']
      };
    }
  }

  private static async getRecentFailedLogins(userId: string): Promise<number> {
    const windowStart = new Date(Date.now() - this.config.suspiciousActivityWindow);
    
    const { data } = await supabase
      .from('mfa_verification_attempts')
      .select('*')
      .eq('user_id', userId)
      .eq('success', false)
      .gte('created_at', windowStart.toISOString());

    return data?.length || 0;
  }

  private static async detectUnusualAccess(userId: string): Promise<{ detected: boolean; indicators: string[] }> {
    const indicators: string[] = [];
    
    try {
      // Check for access from multiple IP addresses
      const { data: events } = await supabase
        .from('security_events')
        .select('ip_address')
        .eq('user_id', userId)
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .not('ip_address', 'is', null);

      if (events) {
        const uniqueIPs = new Set(events.map(e => e.ip_address));
        if (uniqueIPs.size > 5) {
          indicators.push(`Access from ${uniqueIPs.size} different IP addresses`);
        }
      }

      // Check for unusual time patterns
      const { data: recentEvents } = await supabase
        .from('security_events')
        .select('created_at')
        .eq('user_id', userId)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      if (recentEvents) {
        const nightTimeAccess = recentEvents.filter(e => {
          const hour = new Date(e.created_at).getHours();
          return hour >= 23 || hour <= 5;
        });

        if (nightTimeAccess.length > 10) {
          indicators.push('Unusual access patterns during night hours');
        }
      }

    } catch (error) {
      SecureLogger.error('Failed to detect unusual access', error, userId);
    }

    return { detected: indicators.length > 0, indicators };
  }

  private static async detectConcurrentSessions(userId: string): Promise<number> {
    try {
      // This would need to be implemented with session tracking
      // For now, return a simulated value
      return 1;
    } catch (error) {
      SecureLogger.error('Failed to detect concurrent sessions', error, userId);
      return 0;
    }
  }

  private static async detectDataAccessAnomalies(userId: string): Promise<{ detected: boolean; indicators: string[] }> {
    const indicators: string[] = [];
    
    try {
      // Check for rapid data access
      const { data: accessEvents } = await supabase
        .from('security_events')
        .select('*')
        .eq('user_id', userId)
        .in('event_type', ['DATA_READ', 'DATA_WRITE'])
        .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      if (accessEvents && accessEvents.length > 100) {
        indicators.push(`${accessEvents.length} data access events in last hour`);
      }

      // Check for bulk data downloads
      const bulkDownloads = accessEvents?.filter(e => 
        e.event_data && 
        typeof e.event_data === 'object' && 
        'dataType' in e.event_data && 
        e.event_data.dataType === 'export'
      ) || [];

      if (bulkDownloads.length > 0) {
        indicators.push(`${bulkDownloads.length} bulk data export attempts`);
      }

    } catch (error) {
      SecureLogger.error('Failed to detect data access anomalies', error, userId);
    }

    return { detected: indicators.length > 0, indicators };
  }

  private static async triggerSecurityResponse(userId: string, indicators: string[]): Promise<void> {
    try {
      SecureLogger.critical('Auto-triggering security response', { userId, indicators });

      // Log the security incident
      await supabase.rpc('log_security_event', {
        p_user_id: userId,
        p_event_type: 'SECURITY_INCIDENT',
        p_event_data: {
          severity: 'critical',
          indicators,
          autoTriggered: true,
          timestamp: new Date().toISOString()
        }
      });

      // Could trigger additional automated responses here:
      // - Force logout
      // - Send security alerts
      // - Lock account temporarily
      // - Notify security team

    } catch (error) {
      SecureLogger.error('Failed to trigger security response', error, userId);
    }
  }

  static async generateSecurityReport(userId?: string): Promise<{
    summary: {
      totalEvents: number;
      suspiciousEvents: number;
      criticalEvents: number;
    };
    recentIncidents: any[];
    recommendations: string[];
  }> {
    try {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      
      let query = supabase
        .from('security_events')
        .select('*')
        .gte('created_at', sevenDaysAgo.toISOString());

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data: events } = await query.order('created_at', { ascending: false });

      const totalEvents = events?.length || 0;
      const suspiciousEvents = events?.filter(e => 
        e.event_type.includes('FAILED') || 
        e.event_type.includes('SUSPICIOUS') ||
        e.event_type.includes('BLOCKED')
      ).length || 0;
      
      const criticalEvents = events?.filter(e => 
        e.event_type.includes('CRITICAL') ||
        e.event_type.includes('BREACH') ||
        e.event_type.includes('INCIDENT')
      ).length || 0;

      const recentIncidents = events?.filter(e => 
        e.event_type.includes('INCIDENT') ||
        e.event_type.includes('BREACH')
      ).slice(0, 10) || [];

      const recommendations = this.generateRecommendations(suspiciousEvents, criticalEvents);

      return {
        summary: {
          totalEvents,
          suspiciousEvents,
          criticalEvents
        },
        recentIncidents,
        recommendations
      };

    } catch (error) {
      SecureLogger.error('Failed to generate security report', error, userId);
      throw new Error('Failed to generate security report');
    }
  }

  private static generateRecommendations(suspiciousEvents: number, criticalEvents: number): string[] {
    const recommendations: string[] = [];

    if (criticalEvents > 0) {
      recommendations.push('Immediate security review required');
      recommendations.push('Consider implementing additional access controls');
      recommendations.push('Review and update security policies');
    }

    if (suspiciousEvents > 10) {
      recommendations.push('Enable enhanced monitoring');
      recommendations.push('Implement stricter rate limiting');
      recommendations.push('Consider requiring MFA for all users');
    }

    if (suspiciousEvents === 0 && criticalEvents === 0) {
      recommendations.push('Security posture is good');
      recommendations.push('Continue regular security monitoring');
      recommendations.push('Consider periodic security training');
    }

    return recommendations;
  }

  static updateConfig(newConfig: Partial<SecurityMonitoringConfig>): void {
    this.config = { ...this.config, ...newConfig };
    SecureLogger.info('Security monitoring config updated', { config: this.config });
  }

  static getConfig(): SecurityMonitoringConfig {
    return { ...this.config };
  }
}