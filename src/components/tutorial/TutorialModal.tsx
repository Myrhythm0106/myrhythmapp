
import React from 'react';
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
import { 
  Calendar, 
  Heart, 
  HeartPulse, 
  ChevronRight,
  Users,
  Home,
  Info 
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const tutorialSteps = [
  {
    title: "Welcome to MyRhythm",
    description: "Your personalized brain health companion. Let's explore the key features to help you on your journey.",
    icon: <Heart className="h-12 w-12 text-primary" />,
  },
  {
    title: "Dashboard",
    description: "Your home screen provides a quick overview of everything important - symptoms, resources, and community updates.",
    icon: <Home className="h-12 w-12 text-primary" />,
  },
  {
    title: "Symptom Tracking",
    description: "Keep track of your symptoms over time, identify patterns, and share reports with healthcare providers.",
    icon: <HeartPulse className="h-12 w-12 text-primary" />,
  },
  {
    title: "Calendar",
    description: "Manage appointments, medication schedules, and set reminders all in one place.",
    icon: <Calendar className="h-12 w-12 text-primary" />,
  },
  {
    title: "Community",
    description: "Connect with others on similar journeys, join support groups, and access expert advice.",
    icon: <Users className="h-12 w-12 text-primary" />,
  },
  {
    title: "My Support Circle",
    description: "Stay connected with your personal network of family, friends, and caregivers who support you.",
    icon: <Heart className="h-12 w-12 text-primary" />,
  },
  {
    title: "Useful Info",
    description: "Access guides, tutorials and helpful information about using the app and managing your condition.",
    icon: <Info className="h-12 w-12 text-primary" />,
  }
];

interface TutorialModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export function TutorialModal({ isOpen, onComplete }: TutorialModalProps) {
  const [currentStep, setCurrentStep] = React.useState(0);
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

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[600px]" onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">How to Use MyRhythm</DialogTitle>
        </DialogHeader>
        
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
                  <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-4">
                    <div className="bg-primary/10 p-4 rounded-full">
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                    <div className="flex justify-center space-x-2 pt-4">
                      {tutorialSteps.map((_, i) => (
                        <div 
                          key={i} 
                          className={`h-2 w-2 rounded-full ${i === currentStep ? 'bg-primary' : 'bg-muted'}`}
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
        
        <DialogFooter>
          <div className="w-full flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            <Button onClick={handleNext}>
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
