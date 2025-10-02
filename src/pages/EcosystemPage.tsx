import React, { useEffect, useState } from 'react';
import { EcosystemNavigationHub } from '@/components/ecosystem/EcosystemNavigationHub';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Search } from "lucide-react";
import { GlobalSearch } from '@/components/search/GlobalSearch';

export default function EcosystemPage() {
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Check if this is the first visit after completing onboarding
    const onboardingComplete = localStorage.getItem('onboarding_complete');
    const hasSeenEcosystemWelcome = localStorage.getItem('ecosystem_welcome_shown');
    
    if (onboardingComplete && !hasSeenEcosystemWelcome) {
      setShowWelcome(true);
    }
  }, []);

  const handleCloseWelcome = () => {
    localStorage.setItem('ecosystem_welcome_shown', 'true');
    setShowWelcome(false);
  };

  return (
    <>
      <GlobalSearch />
      
      {/* Prominent Search Hint */}
      <div className="fixed top-4 right-4 z-40 hidden md:flex items-center gap-2 bg-background/80 backdrop-blur-sm border border-border rounded-lg px-4 py-2 shadow-lg">
        <Search className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Press <kbd className="px-2 py-1 text-xs font-semibold bg-muted border border-border rounded">Ctrl+K</kbd> to search
        </span>
      </div>
      
      <EcosystemNavigationHub />
      
      <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-memory-emerald-600 to-brain-health-600 bg-clip-text text-transparent">
              <Sparkles className="h-6 w-6 inline-block mr-2 text-memory-emerald-500" />
              Welcome to Your Ecosystem
            </DialogTitle>
            <DialogDescription className="text-center text-base text-brain-health-700 pt-2">
              This is your command center for cognitive health and daily organization.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <p className="text-brain-health-700">
              You now have access to all four core features:
            </p>
            <ul className="space-y-3 text-brain-health-700">
              <li className="flex items-start">
                <span className="mr-2">🧠</span>
                <span><strong>Memory Bridge:</strong> Capture and organize important conversations</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">📅</span>
                <span><strong>Smart Calendar:</strong> Never miss tasks and appointments</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">👥</span>
                <span><strong>Support Circle:</strong> Stay connected with your care team</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">📊</span>
                <span><strong>Progress Tracking:</strong> Monitor your cognitive health journey</span>
              </li>
            </ul>
            <p className="text-brain-health-700 mt-4">
              Start exploring and make MyRhythm work for you!
            </p>
          </div>

          <Button
            onClick={handleCloseWelcome}
            className="w-full bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 hover:from-memory-emerald-600 hover:to-brain-health-600 text-white"
          >
            Let's Begin
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}