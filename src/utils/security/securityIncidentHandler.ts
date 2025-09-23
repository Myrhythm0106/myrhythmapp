import { supabase } from "@/integrations/supabase/client";
import { SecureLogger } from "./secureLogger";

export interface SecurityIncident {
  type: 'token_leak' | 'unauthorized_access' | 'suspicious_activity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
  details: Record<string, any>;
  reason: string;
}

export class SecurityIncidentHandler {
  /**
   * Handle immediate security incident with containment actions
   */
  static async handleIncident(incident: SecurityIncident): Promise<void> {
    SecureLogger.critical(
      `Security incident detected: ${incident.type}`,
      {
        severity: incident.severity,
        userId: incident.userId,
        details: incident.details
      },
      incident.userId
    );

    if (incident.severity === 'critical' && incident.userId) {
      await this.executeEmergencyLockout(incident.userId, incident.reason);
    }

    // Always audit the incident
    await this.auditIncident(incident);
  }

  /**
   * Execute emergency lockout for compromised user
   */
  private static async executeEmergencyLockout(userId: string, reason: string): Promise<void> {
    try {
      const { data, error } = await supabase.functions.invoke('security-incident-response', {
        body: {
          action: 'emergency_lockout',
          userId,
          reason
        }
      });

      if (error) {
        throw error;
      }

      SecureLogger.info(
        'Emergency lockout completed',
        {
          userId,
          actionsCompleted: data.actions_completed
        },
        userId
      );

      // Force password reset
      await supabase.functions.invoke('security-incident-response', {
        body: {
          action: 'force_password_reset',
          userId,
          reason: 'Security incident - forced password reset'
        }
      });

    } catch (error) {
      SecureLogger.error(
        'Failed to execute emergency lockout',
        { error: error.message, userId },
        userId
      );
      throw error;
    }
  }

  /**
   * Audit user activity for security review
   */
  static async auditUserActivity(userId: string): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('security-incident-response', {
        body: {
          action: 'audit_user_activity',
          userId,
          reason: 'Security audit'
        }
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      SecureLogger.error(
        'Failed to audit user activity',
        { error: error.message, userId },
        userId
      );
      throw error;
    }
  }

  /**
   * Clear all client-side session data
   */
  static clearClientSession(): void {
    try {
      // Clear localStorage
      localStorage.clear();
      
      // Clear sessionStorage
      sessionStorage.clear();
      
      // Clear any cookies (if any)
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });

      SecureLogger.info('Client session cleared completely');
    } catch (error) {
      SecureLogger.error('Failed to clear client session', { error: error.message });
    }
  }

  /**
   * Handle token leak incident
   */
  static async handleTokenLeak(leakedToken: string, userId?: string): Promise<void> {
    const incident: SecurityIncident = {
      type: 'token_leak',
      severity: 'critical',
      userId,
      details: {
        tokenType: 'access_token',
        leakSource: 'url_fragment',
        tokenPrefix: leakedToken.substring(0, 10) + '...'
      },
      reason: 'JWT access token exposed in URL fragment'
    };

    await this.handleIncident(incident);
  }

  private static async auditIncident(incident: SecurityIncident): Promise<void> {
    try {
      // Log to our security system
      await supabase.rpc('log_security_event', {
        p_user_id: incident.userId || null,
        p_event_type: `INCIDENT_${incident.type.toUpperCase()}`,
        p_event_data: {
          severity: incident.severity,
          details: incident.details,
          reason: incident.reason,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      SecureLogger.error('Failed to audit security incident', { error: error.message });
    }
  }
}