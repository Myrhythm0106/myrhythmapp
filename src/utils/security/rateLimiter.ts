
import { toast } from "sonner";

export class RateLimiter {
  private static submissionTimes = new Map<string, number[]>();
  private static blockedIdentifiers = new Set<string>();
  
  static checkRateLimit(identifier: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
    const now = Date.now();
    
    // Check if identifier is blocked
    if (this.blockedIdentifiers.has(identifier)) {
      toast.error("Access temporarily blocked due to suspicious activity.");
      return false;
    }
    
    const attempts = this.submissionTimes.get(identifier) || [];
    
    // Filter out attempts outside the time window
    const recentAttempts = attempts.filter(time => now - time < windowMs);
    
    if (recentAttempts.length >= maxAttempts) {
      // Block identifier for extended period on repeated violations
      if (recentAttempts.length >= maxAttempts * 2) {
        this.blockedIdentifiers.add(identifier);
        setTimeout(() => {
          this.blockedIdentifiers.delete(identifier);
        }, windowMs * 10); // Block for 10x the window time
      }
      
      toast.error("Too many attempts. Please wait before trying again.");
      return false;
    }
    
    // Add current attempt
    recentAttempts.push(now);
    this.submissionTimes.set(identifier, recentAttempts);
    
    return true;
  }
}
