
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SecureStorage, SessionManager } from "@/utils/secureStorage";

interface AuthAttempt {
  email: string;
  attempts: number;
  lastAttempt: number;
  lockedUntil?: number;
}

export function useSecureAuth() {
  const [loginAttempts, setLoginAttempts] = useState<Map<string, AuthAttempt>>(new Map());
  const [isLocked, setIsLocked] = useState(false);

  const MAX_ATTEMPTS = 5;
  const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
  const ATTEMPT_WINDOW = 60 * 60 * 1000; // 1 hour

  // Check if email is locked out
  const isEmailLocked = useCallback((email: string): boolean => {
    const attempt = loginAttempts.get(email);
    if (!attempt) return false;

    const now = Date.now();
    
    // Clear old attempts
    if (now - attempt.lastAttempt > ATTEMPT_WINDOW) {
      loginAttempts.delete(email);
      setLoginAttempts(new Map(loginAttempts));
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
      setLoginAttempts(new Map(loginAttempts));
    }

    return false;
  }, [loginAttempts]);

  // Record failed login attempt
  const recordFailedAttempt = useCallback((email: string) => {
    const now = Date.now();
    const currentAttempt = loginAttempts.get(email) || {
      email,
      attempts: 0,
      lastAttempt: now
    };

    // Reset attempts if outside window
    if (now - currentAttempt.lastAttempt > ATTEMPT_WINDOW) {
      currentAttempt.attempts = 0;
    }

    currentAttempt.attempts += 1;
    currentAttempt.lastAttempt = now;

    // Lock account if max attempts reached
    if (currentAttempt.attempts >= MAX_ATTEMPTS) {
      currentAttempt.lockedUntil = now + LOCKOUT_DURATION;
      toast.error(`Too many failed attempts. Account locked for 15 minutes.`);
    } else {
      const remaining = MAX_ATTEMPTS - currentAttempt.attempts;
      toast.error(`Invalid credentials. ${remaining} attempts remaining.`);
    }

    loginAttempts.set(email, currentAttempt);
    setLoginAttempts(new Map(loginAttempts));
  }, [loginAttempts]);

  // Clear successful login attempts
  const clearAttempts = useCallback((email: string) => {
    loginAttempts.delete(email);
    setLoginAttempts(new Map(loginAttempts));
  }, [loginAttempts]);

  // Secure login function
  const secureSignIn = async (email: string, password: string) => {
    // Check if account is locked
    if (isEmailLocked(email)) {
      return { error: { message: "Account temporarily locked" } };
    }

    // Validate password strength
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return { error: { message: "Password too weak" } };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        recordFailedAttempt(email);
        return { error };
      }

      // Success - clear attempts and start session
      clearAttempts(email);
      SessionManager.startSession();
      toast.success("Successfully signed in");
      
      return { data, error: null };
    } catch (error) {
      recordFailedAttempt(email);
      return { error: { message: "Login failed" } };
    }
  };

  // Enhanced sign up with validation
  const secureSignUp = async (email: string, password: string, name: string) => {
    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    
    if (!passwordRegex.test(password)) {
      toast.error("Password must contain at least 8 characters, including uppercase, lowercase, number, and special character");
      return { error: { message: "Password does not meet requirements" } };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          }
        }
      });

      if (error) {
        return { error };
      }

      toast.success("Account created! Please check your email for verification.");
      return { data, error: null };
    } catch (error) {
      return { error: { message: "Signup failed" } };
    }
  };

  // Secure logout
  const secureSignOut = async () => {
    try {
      await supabase.auth.signOut();
      SecureStorage.clearSensitiveData();
      SessionManager.endSession();
      toast.success("Successfully signed out");
    } catch (error) {
      console.error("Logout error:", error);
      // Force cleanup even if logout fails
      SecureStorage.clearSensitiveData();
    }
  };

  // Monitor user activity for session extension
  useEffect(() => {
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    const handleActivity = () => {
      SessionManager.extendSession();
    };

    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, []);

  return {
    secureSignIn,
    secureSignUp,
    secureSignOut,
    isEmailLocked,
    loginAttempts: Array.from(loginAttempts.values())
  };
}
