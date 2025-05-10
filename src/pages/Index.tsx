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
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [isNewRegistration, setIsNewRegistration] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [welcomeTimer, setWelcomeTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check if the user is logged in
    const loggedIn = localStorage.getItem('myrhythm_logged_in') === 'true';
    setIsLoggedIn(loggedIn);

    // Check if this is the first visit
    const hasVisited = localStorage.getItem('hasVisitedBefore');
    const justRegistered = sessionStorage.getItem('justRegistered');
    
    if (justRegistered === 'true') {
      setIsNewRegistration(true);
      // Show welcome message first for 5 seconds
      setShowWelcomeMessage(true);
      sessionStorage.removeItem('justRegistered');
      
      // Set a timer to automatically show the tutorial after 5 seconds
      const timer = setTimeout(() => {
        setShowWelcomeMessage(false);
        setShowTutorial(true);
      }, 5000);
      setWelcomeTimer(timer);
    }
    else if (!hasVisited) {
      setIsFirstVisit(true);
      // Set flag for tutorial
      setShowTutorial(true);
      // Set the flag in localStorage for future visits
      localStorage.setItem('hasVisitedBefore', 'true');
    }

    // Cleanup timer on unmount
    return () => {
      if (welcomeTimer) {
        clearTimeout(welcomeTimer);
      }
    };
  }, []);

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    
    // Navigate to Useful Info tab
    navigate('/useful-info');
  };

  // If not logged in, redirect to landing page
  if (!isLoggedIn && !isNewRegistration) {
    return <Navigate to="/" replace />;
  }

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
      <Dialog open={showWelcomeMessage} onOpenChange={(open) => {
        setShowWelcomeMessage(open);
        if (!open && isNewRegistration) {
          setShowTutorial(true);
        }
      }}>
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
            <Button onClick={() => {
              setShowWelcomeMessage(false);
              if (isNewRegistration) {
                setShowTutorial(true);
              }
            }} className="w-full sm:w-auto">
              Get Started
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Index;
