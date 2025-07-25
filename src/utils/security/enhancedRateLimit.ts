import { SecureLogger } from './secureLogger';

interface RateLimitEntry {
  attempts: number[];
  blocked: boolean;
  blockUntil?: number;
}

export class EnhancedRateLimit {
  private static limits = new Map<string, RateLimitEntry>();
  private static readonly DEFAULT_WINDOW_MS = 60000; // 1 minute
  private static readonly DEFAULT_MAX_ATTEMPTS = 5;
  private static readonly PROGRESSIVE_DELAYS = [60000, 300000, 900000, 3600000]; // 1min, 5min, 15min, 1hr
  
  static checkLimit(
    identifier: string, 
    maxAttempts: number = this.DEFAULT_MAX_ATTEMPTS,
    windowMs: number = this.DEFAULT_WINDOW_MS,
    useProgressiveDelay: boolean = true
  ): { allowed: boolean; retryAfter?: number; remainingAttempts?: number } {
    const now = Date.now();
    const entry = this.limits.get(identifier) || { attempts: [], blocked: false };
    
    // Check if currently blocked
    if (entry.blocked && entry.blockUntil && now < entry.blockUntil) {
      const retryAfter = Math.ceil((entry.blockUntil - now) / 1000);
      SecureLogger.warn('Rate limit: Request blocked', { 
        identifier: this.hashIdentifier(identifier), 
        retryAfter 
      });
      return { allowed: false, retryAfter };
    }
    
    // Clear block if time has passed
    if (entry.blocked && entry.blockUntil && now >= entry.blockUntil) {
      entry.blocked = false;
      entry.blockUntil = undefined;
      entry.attempts = [];
    }
    
    // Remove old attempts outside the window
    entry.attempts = entry.attempts.filter(timestamp => now - timestamp < windowMs);
    
    // Check if limit exceeded
    if (entry.attempts.length >= maxAttempts) {
      const violationCount = this.getViolationCount(identifier);
      const delayIndex = Math.min(violationCount, this.PROGRESSIVE_DELAYS.length - 1);
      const blockDuration = useProgressiveDelay ? this.PROGRESSIVE_DELAYS[delayIndex] : windowMs;
      
      entry.blocked = true;
      entry.blockUntil = now + blockDuration;
      
      this.recordViolation(identifier);
      
      SecureLogger.critical('Rate limit exceeded with progressive delay', {
        identifier: this.hashIdentifier(identifier),
        attempts: entry.attempts.length,
        blockDuration: blockDuration / 1000,
        violationCount: violationCount + 1
      });
      
      return { 
        allowed: false, 
        retryAfter: Math.ceil(blockDuration / 1000) 
      };
    }
    
    // Record this attempt
    entry.attempts.push(now);
    this.limits.set(identifier, entry);
    
    const remainingAttempts = maxAttempts - entry.attempts.length;
    
    return { 
      allowed: true, 
      remainingAttempts 
    };
  }
  
  static checkAuthLimit(email: string): { allowed: boolean; retryAfter?: number; remainingAttempts?: number } {
    return this.checkLimit(`auth:${email}`, 3, 900000); // 3 attempts per 15 minutes
  }
  
  static checkMFALimit(userId: string, factorType: string): { allowed: boolean; retryAfter?: number; remainingAttempts?: number } {
    return this.checkLimit(`mfa:${userId}:${factorType}`, 5, 300000); // 5 attempts per 5 minutes
  }
  
  static checkAPILimit(identifier: string): { allowed: boolean; retryAfter?: number; remainingAttempts?: number } {
    return this.checkLimit(`api:${identifier}`, 100, 3600000); // 100 requests per hour
  }
  
  static recordSuccess(identifier: string): void {
    // Clear attempts on successful action
    const entry = this.limits.get(identifier);
    if (entry) {
      entry.attempts = [];
      this.limits.set(identifier, entry);
    }
    
    // Clear violation count
    this.clearViolations(identifier);
  }
  
  static clearLimits(identifier: string): void {
    this.limits.delete(identifier);
    this.clearViolations(identifier);
  }
  
  private static getViolationCount(identifier: string): number {
    const key = `violations:${identifier}`;
    const violations = localStorage.getItem(key);
    return violations ? parseInt(violations) : 0;
  }
  
  private static recordViolation(identifier: string): void {
    const key = `violations:${identifier}`;
    const current = this.getViolationCount(identifier);
    localStorage.setItem(key, (current + 1).toString());
    
    // Auto-expire violation records after 24 hours
    setTimeout(() => {
      this.clearViolations(identifier);
    }, 86400000);
  }
  
  private static clearViolations(identifier: string): void {
    const key = `violations:${identifier}`;
    localStorage.removeItem(key);
  }
  
  private static hashIdentifier(identifier: string): string {
    // Simple hash for logging (don't expose actual identifiers)
    let hash = 0;
    for (let i = 0; i < identifier.length; i++) {
      const char = identifier.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }
  
  static getStats(): { [key: string]: { attempts: number; blocked: boolean; blockUntil?: number } } {
    const stats: { [key: string]: { attempts: number; blocked: boolean; blockUntil?: number } } = {};
    
    for (const [identifier, entry] of this.limits.entries()) {
      stats[this.hashIdentifier(identifier)] = {
        attempts: entry.attempts.length,
        blocked: entry.blocked,
        blockUntil: entry.blockUntil
      };
    }
    
    return stats;
  }
}