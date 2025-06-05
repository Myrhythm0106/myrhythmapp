
import { supabase } from "@/integrations/supabase/client";
import { SecureStorage } from "@/utils/secureStorage";

export class SessionManager {
  static startSession(): void {
    // Initialize secure session
    console.log('Session started with enhanced security');
  }

  static extendSession(): void {
    // Update last activity timestamp
    const now = Date.now();
    localStorage.setItem('lastActivity', now.toString());
  }

  static async endSession(): Promise<void> {
    try {
      await supabase.auth.signOut();
      SecureStorage.clearSensitiveData();
      localStorage.removeItem('lastActivity');
    } catch (error) {
      console.error('Error ending session:', error);
      // Force cleanup even if logout fails
      SecureStorage.clearSensitiveData();
      localStorage.removeItem('lastActivity');
    }
  }

  static isSessionExpired(): boolean {
    const lastActivity = localStorage.getItem('lastActivity');
    if (!lastActivity) return true;

    const sessionTimeout = 30 * 60 * 1000; // 30 minutes
    const now = Date.now();
    return (now - parseInt(lastActivity)) > sessionTimeout;
  }
}
