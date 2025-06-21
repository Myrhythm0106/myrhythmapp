
import { supabase } from "@/integrations/supabase/client";
import { SecureStorage } from "@/utils/secureStorage";
import { errorHandler } from "@/utils/errorHandler";

export class SessionSecurity {
  private static readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  private static readonly ACTIVITY_CHECK_INTERVAL = 60 * 1000; // 1 minute
  private static timeoutId: NodeJS.Timeout | null = null;
  private static activityCheckId: NodeJS.Timeout | null = null;
  private static lastActivity: number = Date.now();

  static startSession(): void {
    this.updateLastActivity();
    this.startActivityTracking();
    this.startTimeoutCheck();
    
    console.log('Secure session started with enhanced monitoring');
  }

  static updateLastActivity(): void {
    this.lastActivity = Date.now();
    SecureStorage.setItem('lastActivity', this.lastActivity.toString());
  }

  private static startActivityTracking(): void {
    // Track user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const activityHandler = () => {
      this.updateLastActivity();
    };

    events.forEach(event => {
      document.addEventListener(event, activityHandler, { passive: true });
    });
  }

  private static startTimeoutCheck(): void {
    if (this.activityCheckId) {
      clearInterval(this.activityCheckId);
    }

    this.activityCheckId = setInterval(() => {
      if (this.isSessionExpired()) {
        this.endSession('SESSION_TIMEOUT');
      }
    }, this.ACTIVITY_CHECK_INTERVAL);
  }

  static isSessionExpired(): boolean {
    const now = Date.now();
    return (now - this.lastActivity) > this.SESSION_TIMEOUT;
  }

  static async endSession(reason: string = 'USER_LOGOUT'): Promise<void> {
    try {
      console.log(`Ending session: ${reason}`);
      
      // Clear timeouts
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }
      if (this.activityCheckId) {
        clearInterval(this.activityCheckId);
        this.activityCheckId = null;
      }

      // Clear sensitive data
      SecureStorage.clearSensitiveData();
      
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Redirect to auth page
      window.location.href = '/auth';
      
    } catch (error) {
      errorHandler.handleError(
        errorHandler.createError(
          'Failed to end session securely',
          'critical',
          'SESSION_END_ERROR',
          { reason, error }
        )
      );
      
      // Force cleanup even if logout fails
      SecureStorage.clearAll();
      window.location.href = '/auth';
    }
  }

  static extendSession(): void {
    this.updateLastActivity();
  }

  static getSessionInfo(): {
    isActive: boolean;
    timeRemaining: number;
  } {
    const now = Date.now();
    const timeElapsed = now - this.lastActivity;
    const timeRemaining = Math.max(0, this.SESSION_TIMEOUT - timeElapsed);
    
    return {
      isActive: !this.isSessionExpired(),
      timeRemaining
    };
  }
}
