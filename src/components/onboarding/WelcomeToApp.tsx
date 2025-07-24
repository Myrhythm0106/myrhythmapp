import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Sparkles, 
  MapPin, 
  ArrowRight, 
  Clock,
  Target,
  Heart,
  Users,
  BookOpen,
  CheckCircle
} from "lucide-react";
import { PersonalCoachGuide } from "@/components/guide/PersonalCoachGuide";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface WelcomeToAppProps {
  showOnMount?: boolean;
  onClose?: () => void;
}

export function WelcomeToApp({ showOnMount = false, onClose }: WelcomeToAppProps) {
  const [isOpen, setIsOpen] = useState(showOnMount);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has seen the welcome screen before
    const seen = localStorage.getItem('myrhythm-welcome-seen');
    setHasSeenWelcome(!!seen);
    
    // Show welcome automatically for new users who just completed onboarding
    if (showOnMount && !seen) {
      setIsOpen(true);
    }
  }, [showOnMount]);

  const handleStartJourney = () => {
    localStorage.setItem('myrhythm-welcome-seen', 'true');
    setIsOpen(false);
    setShowGuide(true);
    toast.success("Welcome to MyRhythm! Let's explore your features together.");
    onClose?.();
  };

  const handleSkipForNow = () => {
    localStorage.setItem('myrhythm-welcome-seen', 'true');
    setIsOpen(false);
    onClose?.();
  };

  const handleOpenFullGuide = () => {
    setShowGuide(false);
    navigate('/user-guide-view');
  };

  const quickFeatures = [
    {
      icon: Target,
      title: "Smart Goals",
      description: "Set and track goals that adapt to your brain health journey",
      time: "2 min setup"
    },
    {
      icon: MapPin,
      title: "Calendar Planning",
      description: "Plan your future with brain-friendly scheduling",
      time: "3 min tour"
    },
    {
      icon: Users,
      title: "Support Circle",
      description: "Connect with family and care team for accountability",
      time: "5 min setup"
    },
    {
      icon: Heart,
      title: "Daily Check-ins",
      description: "Track your mood, energy, and progress each day",
      time: "1 min daily"
    }
  ];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Sparkles className="w-6 h-6 text-primary" />
              Welcome to Your MyRhythm Journey!
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="text-center">
              <Badge variant="secondary" className="mb-4">
                Your personalized brain health companion is ready
              </Badge>
              <p className="text-lg text-muted-foreground">
                You've completed the setup! Now let's explore how MyRhythm will support your daily recovery and growth.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickFeatures.map((feature, index) => (
                <Card key={index} className="border-primary/20 hover:border-primary/40 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <feature.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{feature.description}</p>
                        <div className="flex items-center gap-1 text-xs text-primary">
                          <Clock className="w-3 h-3" />
                          {feature.time}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-primary">Your Personal Coach is Ready</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                We've created a step-by-step guide tailored to your needs. It will help you get the most out of every feature 
                and build the habits that support your recovery journey.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Personalized to your assessment results</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Progress tracking and celebrations</span>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <Button onClick={handleStartJourney} className="gap-2">
                <MapPin className="w-4 h-4" />
                Start My Guided Journey
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" onClick={handleSkipForNow}>
                Explore on My Own
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Personal Coach Guide Dialog */}
      <Dialog open={showGuide} onOpenChange={setShowGuide}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Your Personal Empowerment Coach
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
            <PersonalCoachGuide />
          </div>
          <div className="flex justify-center p-4 border-t">
            <Button onClick={handleOpenFullGuide} variant="outline">
              Open Full Guide Page
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}