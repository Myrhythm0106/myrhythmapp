
import { errorHandler } from "@/utils/errorHandler";

export class DataProtection {
  // Encrypt sensitive data before storing
  static encryptData(data: string, key?: string): string {
    try {
      // Simple XOR encryption for client-side protection
      // In production, use proper encryption libraries
      const encryptionKey = key || this.getEncryptionKey();
      let encrypted = '';
      
      for (let i = 0; i < data.length; i++) {
        encrypted += String.fromCharCode(
          data.charCodeAt(i) ^ encryptionKey.charCodeAt(i % encryptionKey.length)
        );
      }
      
      return btoa(encrypted);
    } catch (error) {
      errorHandler.handleError(
        errorHandler.createError(
          'Data encryption failed',
          'error',
          'ENCRYPTION_ERROR',
          { error }
        )
      );
      return data; // Return unencrypted as fallback
    }
  }

  static decryptData(encryptedData: string, key?: string): string {
    try {
      const encryptionKey = key || this.getEncryptionKey();
      const decoded = atob(encryptedData);
      let decrypted = '';
      
      for (let i = 0; i < decoded.length; i++) {
        decrypted += String.fromCharCode(
          decoded.charCodeAt(i) ^ encryptionKey.charCodeAt(i % encryptionKey.length)
        );
      }
      
      return decrypted;
    } catch (error) {
      errorHandler.handleError(
        errorHandler.createError(
          'Data decryption failed',
          'error',
          'DECRYPTION_ERROR',
          { error }
        )
      );
      return encryptedData; // Return as-is as fallback
    }
  }

  private static getEncryptionKey(): string {
    // Generate a simple key based on session info
    // In production, use proper key management
    return `myrhythm-${Date.now().toString().slice(-8)}`;
  }

  // Sanitize data before database operations
  static sanitizeInput(input: any): any {
    if (typeof input === 'string') {
      return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .trim();
    }
    
    if (Array.isArray(input)) {
      return input.map(item => this.sanitizeInput(item));
    }
    
    if (typeof input === 'object' && input !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(input)) {
        sanitized[key] = this.sanitizeInput(value);
      }
      return sanitized;
    }
    
    return input;
  }

  // Validate user permissions
  static validatePermission(userRole: string, requiredPermission: string): boolean {
    const rolePermissions: Record<string, string[]> = {
      'admin': ['read', 'write', 'delete', 'manage'],
      'user': ['read', 'write'],
      'viewer': ['read'],
      'guest': []
    };

    const permissions = rolePermissions[userRole] || [];
    return permissions.includes(requiredPermission);
  }

  // Log security events
  static logSecurityEvent(event: string, details: Record<string, any>): void {
    const securityEvent = errorHandler.createError(
      `Security Event: ${event}`,
      'warning',
      'SECURITY_EVENT',
      {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        ...details
      }
    );
    
    errorHandler.logError(securityEvent);
  }
}
