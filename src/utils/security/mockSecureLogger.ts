type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  userId?: string;
  timestamp: string;
}

export class MockSecureLogger {
  private static getLogColor(level: LogLevel): string {
    const colors = {
      debug: '#6B7280',
      info: '#3B82F6',
      warn: '#F59E0B',
      error: '#EF4444',
      critical: '#DC2626'
    };
    return colors[level];
  }

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
    
    const color = this.getLogColor(level);
    const emoji = level === 'critical' ? '🚨' : level === 'error' ? '❌' : level === 'warn' ? '⚠️' : level === 'info' ? 'ℹ️' : '🐛';
    
    console.log(
      `%c${emoji} [MOCK SECURITY LOG - ${level.toUpperCase()}] ${message}`,
      `color: ${color}; font-weight: bold;`,
      data || ''
    );

    if (this.isSecurityEvent(level, message)) {
      console.log(
        `%c🛡️ [MOCK] Security event would be logged to database:`,
        'color: #8B5CF6; font-weight: bold;',
        entry
      );
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
}