import { useAuth } from '@/hooks/useAuth';
import { useCallback } from 'react';
import { toast } from 'sonner';

interface UseVerificationGateReturn {
  isVerified: boolean;
  isPending: boolean;
  isUnknown: boolean;
  requireVerification: (action: string) => boolean;
  gatedAction: <T>(action: () => T | Promise<T>, featureName?: string) => T | Promise<T> | undefined;
}

/**
 * Hook to manage verification-gated features
 * Use this to check if a user can access certain features
 * or to show prompts when they try to access locked features
 */
export const useVerificationGate = (): UseVerificationGateReturn => {
  const { emailVerificationStatus, user } = useAuth();

  const isVerified = emailVerificationStatus === 'verified';
  const isPending = emailVerificationStatus === 'pending';
  const isUnknown = emailVerificationStatus === 'unknown';

  /**
   * Check if a feature requires verification and show a toast if not verified
   * Returns true if user IS verified (can proceed), false if not
   */
  const requireVerification = useCallback((action: string): boolean => {
    if (isVerified) {
      return true;
    }

    if (isPending) {
      toast.warning(`Please verify your email to ${action}`, {
        description: 'Check your inbox for the verification link.',
        action: {
          label: 'Resend',
          onClick: () => {
            // This will be handled by the parent component
            window.dispatchEvent(new CustomEvent('resend-verification'));
          }
        }
      });
      return false;
    }

    // Unknown status - likely not logged in
    toast.error('Please sign in to continue');
    return false;
  }, [isVerified, isPending]);

  /**
   * Wrap an action to only execute if user is verified
   * Shows appropriate message if not verified
   */
  const gatedAction = useCallback(<T>(
    action: () => T | Promise<T>,
    featureName: string = 'use this feature'
  ): T | Promise<T> | undefined => {
    if (requireVerification(featureName)) {
      return action();
    }
    return undefined;
  }, [requireVerification]);

  return {
    isVerified,
    isPending,
    isUnknown,
    requireVerification,
    gatedAction
  };
};

/**
 * Features that are available without verification (limited mode)
 */
export const UNVERIFIED_ALLOWED_FEATURES = [
  'view_onboarding',
  'view_vision_board',
  'basic_settings',
  'view_dashboard'
] as const;

/**
 * Features that require verification
 */
export const VERIFIED_ONLY_FEATURES = [
  'save_data',
  'share_content',
  'export_data',
  'invite_members',
  'premium_features',
  'create_goals',
  'create_actions'
] as const;

export type UnverifiedAllowedFeature = typeof UNVERIFIED_ALLOWED_FEATURES[number];
export type VerifiedOnlyFeature = typeof VERIFIED_ONLY_FEATURES[number];
