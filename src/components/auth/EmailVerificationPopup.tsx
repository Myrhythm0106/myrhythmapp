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
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-sm border-border/50 shadow-2xl">
        <DialogHeader className="text-center">
          <motion.div 
            className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-brain-health-500 to-clarity-teal-500 flex items-center justify-center mb-4 shadow-lg"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <Mail className="w-10 h-10 text-white" />
          </motion.div>
          
          <DialogTitle className="text-2xl font-bold text-foreground">
            Verification Email Sent!
          </DialogTitle>
          
          <DialogDescription className="text-base text-muted-foreground">
            We've sent a verification email to:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Email display - Premium styling */}
          <div className="bg-brain-health-50 rounded-xl p-4 text-center border border-brain-health-200/50">
            <span className="font-semibold text-lg text-foreground">{email}</span>
          </div>

          {/* Instructions - Larger text for brain-health */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-memory-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <span className="text-base text-foreground">Check your inbox (and spam folder)</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-memory-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <span className="text-base text-foreground">Click the verification link in the email</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-memory-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <span className="text-base text-foreground">Verify within 24 hours</span>
            </div>
          </div>

          {/* Didn't receive email section */}
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <span className="text-base text-muted-foreground">Didn't receive it?</span>
              <Button
                variant="outline"
                size="lg"
                onClick={handleResend}
                disabled={isResending || resendSuccess}
                className="h-12 px-6 text-brain-health-600 border-brain-health-300 hover:bg-brain-health-50"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : resendSuccess ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2 text-memory-emerald-500" />
                    Sent!
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Resend Email
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Important note - Softer warning */}
          <div className="bg-clarity-teal-50 border border-clarity-teal-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-clarity-teal-600 mt-0.5 shrink-0" />
            <p className="text-sm text-clarity-teal-700">
              You can continue setting up your account now. Some features will unlock after verification.
            </p>
          </div>
        </div>

        {/* Actions - Large Touch Targets */}
        <div className="flex flex-col gap-3 pt-2">
          <Button
            onClick={handleContinue}
            className="w-full h-16 text-lg font-semibold rounded-xl bg-gradient-to-r from-brain-health-500 to-clarity-teal-500 hover:from-brain-health-600 hover:to-clarity-teal-600 text-white shadow-lg"
          >
            Continue to Setup
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
          <Button
            variant="ghost"
            onClick={onClose}
            className="w-full h-12 text-base text-muted-foreground hover:text-foreground"
          >
            I'll verify first
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
