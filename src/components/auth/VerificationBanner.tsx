import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Shield, Mail, CheckCircle, X, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VerificationBannerProps {
  /** If true, the banner can be dismissed for this session */
  dismissible?: boolean;
  /** Variant style for the banner */
  variant?: 'default' | 'compact' | 'floating';
}

export const VerificationBanner: React.FC<VerificationBannerProps> = ({ 
  dismissible = true,
  variant = 'default'
}) => {
  const { user, emailVerificationStatus, resendVerification } = useAuth();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Reset dismissed state on new session
  useEffect(() => {
    const sessionKey = `verification_banner_dismissed_${user?.id}`;
    const wasDismissed = sessionStorage.getItem(sessionKey);
    if (wasDismissed) {
      setIsDismissed(true);
    }
  }, [user?.id]);

  const handleDismiss = () => {
    setIsDismissed(true);
    if (user?.id) {
      sessionStorage.setItem(`verification_banner_dismissed_${user.id}`, 'true');
    }
  };

  const handleResend = async () => {
    if (!user?.email) return;
    
    setIsResending(true);
    setResendSuccess(false);
    
    const { error } = await resendVerification(user.email);
    
    if (!error) {
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 3000);
    }
    
    setIsResending(false);
  };

  if (!user || emailVerificationStatus === 'verified' || isDismissed) {
    return null;
  }

  if (emailVerificationStatus !== 'pending') {
    return null;
  }

  // Floating variant - fixed at top of screen
  if (variant === 'floating') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-white px-4 py-2 shadow-lg"
        >
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4" />
              <span>
                <strong>Verify your email</strong> to unlock all features
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResend}
                disabled={isResending || resendSuccess}
                className="text-white hover:bg-white/20 h-7 px-2"
              >
                {isResending ? (
                  <RefreshCw className="h-3 w-3 animate-spin" />
                ) : resendSuccess ? (
                  <CheckCircle className="h-3 w-3" />
                ) : (
                  'Resend'
                )}
              </Button>
              {dismissible && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                  className="text-white hover:bg-white/20 h-7 w-7 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Compact variant - smaller inline banner
  if (variant === 'compact') {
    return (
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2 mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
          <Mail className="h-4 w-4 shrink-0" />
          <span>Verify email to unlock all features</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleResend}
          disabled={isResending || resendSuccess}
          className="text-amber-600 hover:text-amber-700 h-7 px-2 text-xs"
        >
          {isResending ? (
            <RefreshCw className="h-3 w-3 animate-spin" />
          ) : resendSuccess ? (
            <>
              <CheckCircle className="h-3 w-3 mr-1" />
              Sent!
            </>
          ) : (
            'Resend'
          )}
        </Button>
      </div>
    );
  }

  // Default variant - full alert banner
  return (
    <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-500/10 dark:border-amber-500/20 mb-4">
      <Shield className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      <AlertDescription className="flex items-center justify-between flex-wrap gap-2">
        <div className="text-amber-800 dark:text-amber-200">
          <strong>Email verification required.</strong> Check your inbox and spam folder to unlock all features.
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResend}
            disabled={isResending || resendSuccess}
            className="text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-500/30 hover:bg-amber-100 dark:hover:bg-amber-500/20"
          >
            {isResending ? (
              <>
                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                Sending...
              </>
            ) : resendSuccess ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                Sent!
              </>
            ) : (
              <>
                <Mail className="h-3 w-3 mr-1" />
                Resend
              </>
            )}
          </Button>
          {dismissible && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-500/20 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};
