import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ThreeStepWarmOnboarding } from '@/components/onboarding/warm/ThreeStepWarmOnboarding';
import { BackButton } from '@/components/ui/BackButton';
import { X } from 'lucide-react';

interface MVPOnboardingModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MVPOnboardingModal({ isOpen, onOpenChange }: MVPOnboardingModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-screen h-screen max-w-none max-h-none bg-gradient-to-br from-memory-emerald-50 via-brain-health-50/40 to-clarity-teal-50 border-0 p-0 overflow-y-auto">
        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors flex items-center justify-center text-brain-health-700 hover:text-brain-health-900"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>
        <ThreeStepWarmOnboarding variant="mvp" />
      </DialogContent>
    </Dialog>
  );
}