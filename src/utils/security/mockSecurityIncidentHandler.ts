interface SecurityIncident {
  type: 'token_leak' | 'unauthorized_access' | 'suspicious_activity' | 'mfa_failure';
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
  details: any;
  reason: string;
}

export class MockSecurityIncidentHandler {
  static async handleIncident(incident: SecurityIncident): Promise<void> {
    console.log('🛡️ [MOCK] Security Incident Handled:', {
      type: incident.type,
      severity: incident.severity,
      userId: incident.userId,
      reason: incident.reason
    });

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 800));

    if (incident.severity === 'critical') {
      console.log('🚨 [MOCK] Emergency lockout executed for user:', incident.userId);
    }
  }

  private static async executeEmergencyLockout(userId: string, reason: string): Promise<void> {
    console.log('🔒 [MOCK] Emergency lockout executed:', { userId, reason });
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  static async auditUserActivity(userId: string): Promise<any> {
    console.log('📊 [MOCK] Auditing user activity for:', userId);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Return fake audit data
    return {
      user_id: userId,
      total_events: 47,
      suspicious_events: 2,
      last_login: new Date(Date.now() - 3600000).toISOString(),
      recent_events: [
        {
          event_type: 'LOGIN_SUCCESS',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          ip_address: '192.168.1.100',
          user_agent: 'Chrome/120.0.0.0'
        },
        {
          event_type: 'MFA_VERIFICATION_SUCCESS',
          timestamp: new Date(Date.now() - 1740000).toISOString(),
          factor_type: 'totp'
        },
        {
          event_type: 'PROFILE_UPDATE',
          timestamp: new Date(Date.now() - 900000).toISOString(),
          changes: ['email_verified']
        }
      ],
      risk_score: 0.15,
      recommendations: [
        'Enable additional MFA factors',
        'Review recent login locations',
        'Update password if suspicious activity detected'
      ]
    };
  }

  static clearClientSession(): void {
    console.log('🧹 [MOCK] Client session data cleared');
    // Actually clear the data for demo purposes
    localStorage.clear();
    sessionStorage.clear();
    document.cookie.split(";").forEach(cookie => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    });
  }

  static async handleTokenLeak(leakedToken: string, userId?: string): Promise<void> {
    await this.handleIncident({
      type: 'token_leak',
      severity: 'critical',
      userId,
      details: { token_type: 'jwt', leaked_token: '[REDACTED]' },
      reason: 'JWT token detected in URL parameters'
    });
  }

  private static async auditIncident(incident: SecurityIncident): Promise<void> {
    console.log('📝 [MOCK] Security incident logged:', incident.type);
  }
}