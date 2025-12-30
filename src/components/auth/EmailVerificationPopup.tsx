import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle, RefreshCw, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';

interface EmailVerificationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onContinue: () => void;
}

export const EmailVerificationPopup: React.FC<EmailVerificationPopupProps> = ({
  isOpen,
  onClose,
  email,
  onContinue
}) => {
  const { resendVerification } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleResend = async () => {
    setIsResending(true);
    setResendSuccess(false);
    
    const { error } = await resendVerification(email);
    
    if (!error) {
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 3000);
    }
    
    setIsResending(false);
  };

  const handleContinue = () => {
    onContinue();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader className="text-center">
          <motion.div 
            className="mx-auto w-16 h-16 rounded-full bg-brand-teal/20 flex items-center justify-center mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <Mail className="w-8 h-8 text-brand-teal" />
          </motion.div>
          
          <DialogTitle className="text-xl font-semibold text-foreground">
            Verification Email Sent!
          </DialogTitle>
          
          <DialogDescription className="text-muted-foreground">
            We've sent a verification email to:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Email display */}
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <span className="font-medium text-foreground">{email}</span>
          </div>

          {/* Instructions */}
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-brand-teal mt-0.5 shrink-0" />
              <span>Check your inbox (and spam folder)</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-brand-teal mt-0.5 shrink-0" />
              <span>Click the verification link in the email</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-brand-teal mt-0.5 shrink-0" />
              <span>Verify within 24 hours to unlock all features</span>
            </div>
          </div>

          {/* Didn't receive email section */}
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Didn't receive it?</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResend}
                disabled={isResending || resendSuccess}
                className="text-brand-teal hover:text-brand-teal/80"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                    Sending...
                  </>
                ) : resendSuccess ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Sent!
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Resend Email
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Important note */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-600 dark:text-amber-400">
              You can continue setting up your account, but some features will be limited until you verify your email.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <Button
            onClick={handleContinue}
            className="w-full bg-brand-teal hover:bg-brand-teal/90 text-white"
          >
            Continue to Setup
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          
          <Button
            variant="ghost"
            onClick={onClose}
            className="w-full text-muted-foreground"
          >
            I'll verify first
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
