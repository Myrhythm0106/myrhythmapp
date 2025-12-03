import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Compass, Calendar, Mic, Users, Gamepad2, Heart, 
  CheckCircle, ChevronLeft, ChevronRight, Sparkles, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

interface LaunchAppTourProps {
  isOpen: boolean;
  onClose: () => void;
}

const tourSteps = [
  {
    icon: Sparkles,
    iconBg: 'bg-gradient-to-br from-brand-emerald-400 to-brand-teal-500',
    title: 'Welcome to MyRhythm!',
    description: "Let me show you around. This will only take a moment.",
    tip: "Take your time — you can revisit this tour anytime."
  },
  {
    icon: Compass,
    iconBg: 'bg-gradient-to-br from-brand-emerald-500 to-brand-teal-500',
    title: 'Compass Navigation',
    description: "See the compass button? Tap it anytime to quickly jump to any feature.",
    tip: "It's always in the bottom-right corner."
  },
  {
    icon: CheckCircle,
    iconBg: 'bg-gradient-to-br from-blue-400 to-blue-600',
    title: "Today's Focus",
    description: "Set your Core, Key, and Stretch commitments each day. Small wins add up!",
    tip: "Start with just one thing — that's enough."
  },
  {
    icon: Mic,
    iconBg: 'bg-gradient-to-br from-brand-emerald-400 to-brand-emerald-600',
    title: 'Memory Bridge',
    description: "Record conversations and we'll extract the action items for you automatically.",
    tip: "Great for appointments and important chats."
  },
  {
    icon: Users,
    iconBg: 'bg-gradient-to-br from-amber-400 to-amber-600',
    title: 'Support Circle',
    description: "Your support circle is just a tap away. Friends, family, and professionals — all in one place.",
    tip: "They can help you stay on track."
  },
  {
    icon: Calendar,
    iconBg: 'bg-gradient-to-br from-blue-400 to-indigo-500',
    title: 'Calendar & Tasks',
    description: "Mark tasks as Done, Cancel them, or Carry Over to tomorrow. You're in control.",
    tip: "Swipe on tasks for quick actions."
  },
  {
    icon: Gamepad2,
    iconBg: 'bg-gradient-to-br from-purple-400 to-purple-600',
    title: 'Brain Games',
    description: "Keep your mind sharp with daily exercises. Fun and beneficial!",
    tip: "Even 5 minutes helps."
  },
  {
    icon: Heart,
    iconBg: 'bg-gradient-to-br from-rose-400 to-rose-600',
    title: "You're Ready!",
    description: "Start with what feels right. There's no pressure here — this is your journey.",
    tip: "You've got this. We're here to help."
  }
];

export function LaunchAppTour({ isOpen, onClose }: LaunchAppTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Celebrate!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    localStorage.setItem('myrhythm-launch-tour-completed', 'true');
    setCurrentStep(0);
    onClose();
  };

  const handleSkip = () => {
    localStorage.setItem('myrhythm-launch-tour-completed', 'true');
    setCurrentStep(0);
    onClose();
  };

  // Swipe handling for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    
    setTouchStart(null);
  };

  const step = tourSteps[currentStep];
  const StepIcon = step.icon;
  const isLastStep = currentStep === tourSteps.length - 1;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleSkip()}>
      <DialogContent 
        className="sm:max-w-md p-0 overflow-hidden border-0 bg-white rounded-3xl"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Skip button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          aria-label="Skip tour"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>

        {/* Content */}
        <div className="px-8 py-10 text-center">
          {/* Icon */}
          <div className={cn(
            "w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6 shadow-lg",
            step.iconBg
          )}>
            <StepIcon className="h-10 w-10 text-white" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {step.title}
          </h2>

          {/* Description */}
          <p className="text-lg text-gray-600 mb-4 leading-relaxed">
            {step.description}
          </p>

          {/* Tip */}
          <div className="bg-brand-emerald-50 rounded-xl px-4 py-3 mb-8">
            <p className="text-sm text-brand-emerald-700 font-medium">
              💡 {step.tip}
            </p>
          </div>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {tourSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  index === currentStep 
                    ? "w-6 bg-brand-emerald-500" 
                    : "w-2 bg-gray-200 hover:bg-gray-300"
                )}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>

          {/* Step counter */}
          <p className="text-xs text-gray-400 mb-6">
            Step {currentStep + 1} of {tourSteps.length}
          </p>

          {/* Navigation buttons */}
          <div className="flex items-center justify-center gap-3">
            {currentStep > 0 && (
              <Button
                variant="outline"
                size="lg"
                onClick={handlePrev}
                className="min-w-[120px] h-12 rounded-xl border-gray-200"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            )}
            
            <Button
              size="lg"
              onClick={handleNext}
              className={cn(
                "min-w-[140px] h-12 rounded-xl font-semibold",
                isLastStep 
                  ? "bg-gradient-to-r from-brand-emerald-500 to-brand-teal-500 hover:from-brand-emerald-600 hover:to-brand-teal-600"
                  : "bg-brand-emerald-500 hover:bg-brand-emerald-600"
              )}
            >
              {isLastStep ? (
                <>
                  Let's Go!
                  <Sparkles className="h-4 w-4 ml-2" />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </div>

          {/* Swipe hint on mobile */}
          <p className="text-xs text-gray-400 mt-4 md:hidden">
            ← Swipe to navigate →
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
