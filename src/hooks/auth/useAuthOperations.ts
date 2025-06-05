
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { validatePasswordStrength } from "@/utils/auth/passwordValidation";
import { sanitizeEmail, sanitizeName, validateEmail, validateNameLength } from "@/utils/auth/inputValidation";
import { SessionManager } from "@/utils/auth/sessionManager";
import { useLoginAttempts } from "./useLoginAttempts";

export function useAuthOperations() {
  const { isEmailLocked, recordFailedAttempt, clearAttempts } = useLoginAttempts();

  const secureSignIn = async (email: string, password: string) => {
    // Input sanitization
    email = sanitizeEmail(email);
    
    if (!email || !password) {
      toast.error("Email and password are required");
      return { error: { message: "Invalid input" } };
    }

    // Email validation
    if (!validateEmail(email)) {
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

  const secureSignUp = async (email: string, password: string, name: string) => {
    // Input sanitization
    email = sanitizeEmail(email);
    name = sanitizeName(name);
    
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
    if (!validateNameLength(name)) {
      toast.error("Name must be between 2 and 50 characters");
      return { error: { message: "Invalid name" } };
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

  const secureSignOut = async () => {
    await SessionManager.endSession();
    toast.success("Successfully signed out");
  };

  return {
    secureSignIn,
    secureSignUp,
    secureSignOut,
    isEmailLocked,
    validatePasswordStrength
  };
}
