import React from 'react';
import { ArrowLeft, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { JourneyProgressDots } from './JourneyProgressDots';

interface JourneyLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
  showBack?: boolean;
  title?: string;
}

export function JourneyLayout({
  children,
  currentStep,
  totalSteps,
  onBack,
  showBack = true,
  title = "MyRhythm"
}: JourneyLayoutProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brain-health-50 via-clarity-teal-50/40 to-memory-emerald-50/30">
      {/* Premium Header */}
      <motion.header 
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-lg mx-auto px-6 h-16 flex items-center justify-between">
          {/* Back Button */}
          {showBack && currentStep > 1 ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="h-12 w-12 rounded-full hover:bg-brain-health-100 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </Button>
          ) : (
            <div className="w-12" />
          )}

          {/* Logo & Title */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brain-health-500 to-clarity-teal-500 flex items-center justify-center">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-foreground">{title}</span>
          </div>

          {/* Progress Dots */}
          <div className="w-12 flex justify-end">
            <JourneyProgressDots currentStep={currentStep} totalSteps={totalSteps} />
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="pt-20 pb-8 min-h-screen">
        <motion.div
          className="max-w-lg mx-auto px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
