import { supabase } from "@/integrations/supabase/client";

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  userId?: string;
  timestamp: string;
}

export class SecureLogger {
  private static isProduction = import.meta.env.PROD;
  
  static debug(message: string, data?: any, userId?: string): void {
    this.log('debug', message, data, userId);
  }
  
  static info(message: string, data?: any, userId?: string): void {
    this.log('info', message, data, userId);
  }
  
  static warn(message: string, data?: any, userId?: string): void {
    this.log('warn', message, data, userId);
  }
  
  static error(message: string, data?: any, userId?: string): void {
    this.log('error', message, data, userId);
  }
  
  static critical(message: string, data?: any, userId?: string): void {
    this.log('critical', message, data, userId);
  }
  
  private static log(level: LogLevel, message: string, data?: any, userId?: string): void {
    const entry: LogEntry = {
      level,
      message,
      data: this.sanitizeData(data),
      userId,
      timestamp: new Date().toISOString()
    };
    
    // Only log to console in development
    if (!this.isProduction) {
      console.log(`[${level.toUpperCase()}] ${message}`, data);
    }
    
    // Log security events to database
    if (this.isSecurityEvent(level, message)) {
      this.logSecurityEvent(entry);
    }
  }
  
  private static sanitizeData(data: any): any {
    if (!data) return data;
    
    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'credit_card', 'ssn'];
    
    if (typeof data === 'object') {
      const sanitized = { ...data };
      for (const key in sanitized) {
        if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
          sanitized[key] = '[REDACTED]';
        }
      }
      return sanitized;
    }
    
    return data;
  }
  
  private static isSecurityEvent(level: LogLevel, message: string): boolean {
    const securityKeywords = [
      'login', 'logout', 'authentication', 'mfa', 'failed', 'attempt', 
      'blocked', 'security', 'unauthorized', 'breach', 'suspicious'
    ];
    
    return level === 'critical' || level === 'error' || 
           securityKeywords.some(keyword => message.toLowerCase().includes(keyword));
  }
  
  private static async logSecurityEvent(entry: LogEntry): Promise<void> {
    try {
      await supabase.rpc('log_security_event', {
        p_user_id: entry.userId || null,
        p_event_type: `LOG_${entry.level.toUpperCase()}`,
        p_event_data: {
          message: entry.message,
          data: entry.data,
          timestamp: entry.timestamp
        }
      });
    } catch (error) {
      // Fallback to console if database logging fails
      if (!this.isProduction) {
        console.error('Failed to log security event:', error);
      }
    }
  }
}