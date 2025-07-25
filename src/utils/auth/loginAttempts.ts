
import { toast } from "sonner";
import { SecureLogger } from '@/utils/security/secureLogger';

export interface AuthAttempt {
  email: string;
  attempts: number;
  lastAttempt: number;
  lockedUntil?: number;
}

export class LoginAttemptsManager {
  private attempts = new Map<string, AuthAttempt>();
  private readonly MAX_ATTEMPTS = 3;
  private readonly LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes
  private readonly ATTEMPT_WINDOW = 60 * 60 * 1000; // 1 hour

  isEmailLocked(email: string): boolean {
    const attempt = this.attempts.get(email);
    if (!attempt) return false;

    const now = Date.now();
    
    // Clear old attempts
    if (now - attempt.lastAttempt > this.ATTEMPT_WINDOW) {
      this.attempts.delete(email);
      return false;
    }

    // Check if still locked
    if (attempt.lockedUntil && now < attempt.lockedUntil) {
      const remainingTime = Math.ceil((attempt.lockedUntil - now) / 60000);
      toast.error(`Account locked. Try again in ${remainingTime} minutes.`);
      return true;
    }

    // Clear lockout if time has passed
    if (attempt.lockedUntil && now >= attempt.lockedUntil) {
      attempt.lockedUntil = undefined;
      attempt.attempts = 0;
    }

    return false;
  }

  recordFailedAttempt(email: string): void {
    const now = Date.now();
    const currentAttempt = this.attempts.get(email) || {
      email,
      attempts: 0,
      lastAttempt: now
    };

    // Reset attempts if outside window
    if (now - currentAttempt.lastAttempt > this.ATTEMPT_WINDOW) {
      currentAttempt.attempts = 0;
    }

    currentAttempt.attempts += 1;
    currentAttempt.lastAttempt = now;

    // Progressive lockout times
    if (currentAttempt.attempts >= this.MAX_ATTEMPTS) {
      const lockoutMultiplier = Math.min(currentAttempt.attempts - this.MAX_ATTEMPTS + 1, 5);
      currentAttempt.lockedUntil = now + (this.LOCKOUT_DURATION * lockoutMultiplier);
      
      toast.error(`Too many failed attempts. Account locked for ${Math.ceil((this.LOCKOUT_DURATION * lockoutMultiplier) / 60000)} minutes.`);
      
      // Log security event
      SecureLogger.warn(`Security: Account lockout for email: ${email.substring(0, 3)}***`);
    } else {
      const remaining = this.MAX_ATTEMPTS - currentAttempt.attempts;
      toast.error(`Invalid credentials. ${remaining} attempts remaining.`);
    }

    this.attempts.set(email, currentAttempt);
  }

  clearAttempts(email: string): void {
    this.attempts.delete(email);
  }

  getAttempts(): AuthAttempt[] {
    return Array.from(this.attempts.values());
  }
}
