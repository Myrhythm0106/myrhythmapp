
import React, { useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  HeartPulse, 
  ChevronRight,
  Users,
  Home,
  Info,
  Calendar,
  BookOpen,
  Video
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const tutorialSteps = [
  {
    title: "Welcome to MyRhythm",
    description: "Your personal brain health companion. Let's explore how MyRhythm can help support your journey.",
    icon: <Heart className="h-12 w-12 text-primary" />,
    video: "welcome-intro.mp4"
  },
  {
    title: "Dashboard",
    description: "Your personalized hub shows your key health metrics, upcoming events, and quick access to resources when you need them most.",
    icon: <Home className="h-12 w-12 text-primary" />,
    video: "dashboard-overview.mp4"
  },
  {
    title: "Symptom Tracking",
    description: "Record symptoms daily to identify patterns. Get insights into triggers and share reports with your healthcare team.",
    icon: <HeartPulse className="h-12 w-12 text-primary" />,
    video: "symptom-tracking.mp4"
  },
  {
    title: "Calendar",
    description: "Never miss an appointment or medication. Set reminders, manage your schedule, and keep your support team informed.",
    icon: <Calendar className="h-12 w-12 text-primary" />,
    video: "calendar-usage.mp4"
  },
  {
    title: "Community",
    description: "Connect with others on similar journeys. Share experiences, ask questions, and learn from both peers and experts.",
    icon: <Users className="h-12 w-12 text-primary" />,
    video: "community-connections.mp4"
  },
  {
    title: "My Support Circle",
    description: "Add family members, friends, or caregivers to your personal network. Share updates and coordinate care seamlessly.",
    icon: <Heart className="h-12 w-12 text-primary" />,
    video: "support-circle.mp4"
  },
  {
    title: "Ready to Begin?",
    description: "You can revisit these tutorials anytime in the 'Useful Info' section. We're excited to be part of your health journey!",
    icon: <Info className="h-12 w-12 text-primary" />,
    video: "getting-started.mp4"
  }
];

interface TutorialModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export function TutorialModal({ isOpen, onComplete }: TutorialModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [tutorialMode, setTutorialMode] = useState<'read' | 'watch'>('read');
  const isMobile = useIsMobile();
  
  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkipTutorial = () => {
    onComplete();
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[700px] p-0" onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-center text-2xl font-bold">Welcome to MyRhythm</DialogTitle>
        </DialogHeader>
        
        <Tabs value={tutorialMode} onValueChange={(value) => setTutorialMode(value as 'read' | 'watch')} className="w-full">
          <div className="flex justify-center pt-2 pb-4">
            <TabsList>
              <TabsTrigger value="read" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Read Tutorial
              </TabsTrigger>
              <TabsTrigger value="watch" className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                Watch Tutorial
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="read" className="mt-0">
            <Carousel className="w-full" setApi={(api) => {
              if (api) {
                api.on('select', () => {
                  setCurrentStep(api.selectedScrollSnap());
                });
              }
            }}>
              <CarouselContent>
                {tutorialSteps.map((step, index) => (
                  <CarouselItem key={index}>
                    <Card className="border-none shadow-none">
                      <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-6">
                        <div className="bg-primary/10 p-6 rounded-full">
                          {step.icon}
                        </div>
                        <h3 className="text-2xl font-semibold">{step.title}</h3>
                        <p className="text-lg text-muted-foreground max-w-md">{step.description}</p>
                        <div className="flex justify-center space-x-2 pt-4">
                          {tutorialSteps.map((_, i) => (
                            <div 
                              key={i} 
                              className={`h-2 w-2 rounded-full transition-all ${i === currentStep ? 'bg-primary w-4' : 'bg-muted'}`}
                            />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              
              {!isMobile && (
                <>
                  <CarouselPrevious 
                    className={`${currentStep === 0 ? 'invisible' : 'visible'}`} 
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevious();
                    }}
                  />
                  <CarouselNext 
                    className={`${currentStep === tutorialSteps.length - 1 ? 'invisible' : 'visible'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                  />
                </>
              )}
            </Carousel>
          </TabsContent>
          
          <TabsContent value="watch" className="mt-0">
            <div className="p-6">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-6 overflow-hidden">
                <div className="relative w-full h-full flex items-center justify-center bg-black/5">
                  {/* In a real app, this would be a video player */}
                  <div className="text-primary">
                    <Video className="h-16 w-16 opacity-70" />
                  </div>
                  <div className="absolute bottom-0 left-0 w-full bg-black/30 text-white p-3">
                    <p className="font-semibold">{tutorialSteps[currentStep].title}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{tutorialSteps[currentStep].title}</h3>
                <p className="text-muted-foreground">{tutorialSteps[currentStep].description}</p>
              </div>

              <div className="flex justify-center space-x-2 mt-6">
                {tutorialSteps.map((_, i) => (
                  <Button 
                    key={i}
                    variant={i === currentStep ? "default" : "outline"}
                    size="sm"
                    className="w-8 h-8 p-0 rounded-full"
                    onClick={() => setCurrentStep(i)}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="p-6 pt-2">
          <div className="w-full flex justify-between">
            {currentStep === 0 ? (
              <Button variant="outline" onClick={handleSkipTutorial}>
                Skip Tutorial
              </Button>
            ) : (
              <Button variant="outline" onClick={handlePrevious}>
                Previous
              </Button>
            )}
            <Button onClick={handleNext} className="animate-pulse">
              {currentStep < tutorialSteps.length - 1 ? (
                <>
                  Next
                  <ChevronRight className="ml-1 h-4 w-4" />
                </>
              ) : (
                "Get Started"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
