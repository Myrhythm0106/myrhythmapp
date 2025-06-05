
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

  const MAX_ATTEMPTS = 3; // Reduced from 5 for better security
  const LOCKOUT_DURATION = 30 * 60 * 1000; // Increased to 30 minutes
  const ATTEMPT_WINDOW = 60 * 60 * 1000; // 1 hour

  // Enhanced password validation
  const validatePasswordStrength = (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push("Must be at least 8 characters long");
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push("Must contain at least one lowercase letter");
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push("Must contain at least one uppercase letter");
    }
    
    if (!/\d/.test(password)) {
      errors.push("Must contain at least one number");
    }
    
    if (!/[@$!%*?&]/.test(password)) {
      errors.push("Must contain at least one special character (@$!%*?&)");
    }

    // Check for common patterns
    if (/(.)\1{2,}/.test(password)) {
      errors.push("Cannot contain repeated characters");
    }

    if (/123|abc|password|qwerty/i.test(password)) {
      errors.push("Cannot contain common patterns");
    }

    return { isValid: errors.length === 0, errors };
  };

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

  // Record failed login attempt with enhanced security
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

    // Progressive lockout times
    if (currentAttempt.attempts >= MAX_ATTEMPTS) {
      const lockoutMultiplier = Math.min(currentAttempt.attempts - MAX_ATTEMPTS + 1, 5);
      currentAttempt.lockedUntil = now + (LOCKOUT_DURATION * lockoutMultiplier);
      
      toast.error(`Too many failed attempts. Account locked for ${Math.ceil((LOCKOUT_DURATION * lockoutMultiplier) / 60000)} minutes.`);
      
      // Log security event
      console.warn(`Security: Account lockout for email: ${email.substring(0, 3)}***`);
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

  // Enhanced secure login function
  const secureSignIn = async (email: string, password: string) => {
    // Input sanitization
    email = email.toLowerCase().trim();
    
    if (!email || !password) {
      toast.error("Email and password are required");
      return { error: { message: "Invalid input" } };
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return { error: { message: "Invalid email format" } };
    }

    // Check if account is locked
    if (isEmailLocked(email)) {
      return { error: { message: "Account temporarily locked" } };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        recordFailedAttempt(email);
        // Don't reveal whether email exists
        toast.error("Invalid email or password");
        return { error: { message: "Authentication failed" } };
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

  // Enhanced sign up with stronger validation
  const secureSignUp = async (email: string, password: string, name: string) => {
    // Input sanitization
    email = email.toLowerCase().trim();
    name = name.trim();
    
    if (!email || !password || !name) {
      toast.error("All fields are required");
      return { error: { message: "Invalid input" } };
    }

    // Enhanced password validation
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      toast.error("Password requirements not met:");
      passwordValidation.errors.forEach(error => {
        toast.error(`• ${error}`);
      });
      return { error: { message: "Password does not meet requirements" } };
    }

    // Name validation
    if (name.length < 2 || name.length > 50) {
      toast.error("Name must be between 2 and 50 characters");
      return { error: { message: "Invalid name" } };
    }

    // Sanitize name input
    const sanitizedName = name.replace(/[<>\"'&]/g, '');

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: sanitizedName
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

  // Enhanced secure logout with complete cleanup
  const secureSignOut = async () => {
    try {
      await supabase.auth.signOut();
      SecureStorage.clearSensitiveData();
      SessionManager.endSession();
      
      // Clear any cached data
      setLoginAttempts(new Map());
      
      toast.success("Successfully signed out");
    } catch (error) {
      console.error("Logout error:", error);
      // Force cleanup even if logout fails
      SecureStorage.clearSensitiveData();
      SessionManager.endSession();
    }
  };

  // Enhanced activity monitoring with privacy protection
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
    validatePasswordStrength,
    loginAttempts: Array.from(loginAttempts.values())
  };
}
