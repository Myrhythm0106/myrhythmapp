
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { validatePasswordStrength, isLeakedPasswordError, getLeakedPasswordMessage } from "@/utils/auth/passwordValidation";
import { sanitizeEmail, sanitizeName, validateEmail, validateNameLength } from "@/utils/auth/inputValidation";

export function useAuthOperations() {

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

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        // Don't reveal whether email exists
        toast.error("Invalid email or password");
        return { error: { message: "Authentication failed" } };
      }

      toast.success("Successfully signed in");
      return { data, error: null };
    } catch (error) {
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
        // Check if this is a leaked password error
        if (isLeakedPasswordError(error)) {
          toast.error(getLeakedPasswordMessage());
          return { error: { message: "Leaked password detected" } };
        }
        return { error };
      }

      toast.success("Account created! Please check your email for verification.");
      return { data, error: null };
    } catch (error) {
      return { error: { message: "Signup failed" } };
    }
  };

  const secureSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      toast.success("Successfully signed out");
    }
  };

  return {
    secureSignIn,
    secureSignUp,
    secureSignOut,
    validatePasswordStrength
  };
}
