
import { useAuthOperations } from "./auth/useAuthOperations";
import { useLoginAttempts } from "./auth/useLoginAttempts";
import { useActivityMonitor } from "./auth/useActivityMonitor";
import { validatePasswordStrength } from "@/utils/auth/passwordValidation";

export function useSecureAuth() {
  const { secureSignIn, secureSignUp, secureSignOut, isEmailLocked } = useAuthOperations();
  const { getAttempts } = useLoginAttempts();
  
  // Set up activity monitoring
  useActivityMonitor();

  return {
    secureSignIn,
    secureSignUp,
    secureSignOut,
    isEmailLocked,
    validatePasswordStrength,
    loginAttempts: getAttempts()
  };
}
