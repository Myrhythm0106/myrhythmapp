
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { validatePasswordStrength, isLeakedPasswordError, getLeakedPasswordMessage } from "@/utils/auth/passwordValidation";
import { sanitizeEmail, sanitizeName, validateEmail, validateNameLength } from "@/utils/auth/inputValidation";

export function useAuthOperations() {

  const secureSignIn = async (email: string, password: string) => {
    // Input sanitization
    email = sanitizeEmail(email);
    
    console.log("SignIn Debug - Attempting login for:", email);
    
    if (!email || !password) {
      console.log("SignIn Debug - Missing email or password");
      toast.error("Email and password are required");
      return { error: { message: "Invalid input" } };
    }

    // Email validation
    if (!validateEmail(email)) {
      console.log("SignIn Debug - Invalid email format:", email);
      toast.error("Please enter a valid email address");
      return { error: { message: "Invalid email format" } };
    }

    try {
      console.log("SignIn Debug - Calling Supabase signInWithPassword");
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      console.log("SignIn Debug - Supabase response:", { data: !!data, error: error?.message });

      if (error) {
        console.error("SignIn Debug - Supabase error:", error);
        
        // More specific error messages for debugging
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Email or password is incorrect. Try 'Forgot Password' if needed.");
        } else if (error.message.includes("Email not confirmed")) {
          toast.error("Please check your email and confirm your account before signing in.");
        } else {
          toast.error(`Sign in failed: ${error.message}`);
        }
        
        return { error: { message: error.message } };
      }

      console.log("SignIn Debug - Login successful for user:", data.user?.email);
      toast.success("Successfully signed in");
      return { data, error: null };
    } catch (error) {
      console.error("SignIn Debug - Unexpected error:", error);
      toast.error("An unexpected error occurred. Please try again.");
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
