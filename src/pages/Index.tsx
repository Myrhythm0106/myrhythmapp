
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import Dashboard from './Dashboard';
import { TutorialModal } from '@/components/tutorial/TutorialModal';
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  // In a real app, we would check if a user is authenticated and has completed onboarding
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [isNewRegistration, setIsNewRegistration] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);

  useEffect(() => {
    // Check if this is the first visit
    const hasVisited = localStorage.getItem('hasVisitedBefore');
    const justRegistered = sessionStorage.getItem('justRegistered');
    
    if (justRegistered === 'true') {
      setIsNewRegistration(true);
      setShowTutorial(true);
      toast.success("Registration successful! Welcome to MyRhythm.", {
        duration: 4000,
      });
      sessionStorage.removeItem('justRegistered');
    }
    else if (!hasVisited) {
      setIsFirstVisit(true);
      // Set flag for tutorial
      setShowTutorial(true);
      // Set the flag in localStorage for future visits
      localStorage.setItem('hasVisitedBefore', 'true');
    }
  }, []);

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    setShowWelcomeMessage(true);
    
    // Navigate to Useful Info tab if it's a new registration
    if (isNewRegistration) {
      setTimeout(() => {
        navigate('/useful-info');
      }, 2000);
    }
  };

  // If it's the first visit, redirect to landing page 
  if (isFirstVisit && !showTutorial && !isNewRegistration && !showWelcomeMessage) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, show the dashboard
  return (
    <MainLayout>
      <Dashboard />
      <TutorialModal isOpen={showTutorial} onComplete={handleTutorialComplete} />
      
      {/* Welcome message dialog */}
      <Dialog open={showWelcomeMessage} onOpenChange={setShowWelcomeMessage}>
        <DialogContent className="sm:max-w-md" onEscapeKeyDown={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center text-xl">
              <Sparkles className="h-6 w-6 mr-2 text-primary" />
              Welcome to MyRhythm!
            </DialogTitle>
            <DialogDescription className="text-center pt-2">
              Your journey to better brain health begins now. MyRhythm is here to support your every step with powerful tools and a caring community.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 text-center">
            <p className="mb-4">Ready to take control of your brain health journey?</p>
            <p className="font-semibold text-primary">Let's build your rhythm together!</p>
          </div>
          <DialogFooter className="flex sm:justify-center">
            <Button onClick={() => setShowWelcomeMessage(false)} className="w-full sm:w-auto">
              Get Started
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Index;
