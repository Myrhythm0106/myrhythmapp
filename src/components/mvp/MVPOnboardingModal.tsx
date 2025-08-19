import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ThreeStepWarmOnboarding } from '@/components/onboarding/warm/ThreeStepWarmOnboarding';

interface MVPOnboardingModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MVPOnboardingModal({ isOpen, onOpenChange }: MVPOnboardingModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-screen h-screen max-w-none max-h-none bg-gradient-to-br from-memory-emerald-50 via-brain-health-50/40 to-clarity-teal-50 border-0 p-0 overflow-y-auto">
        <ThreeStepWarmOnboarding variant="mvp" />
      </DialogContent>
    </Dialog>
  );
}