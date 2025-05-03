
import React from 'react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { TutorialStep } from './TutorialStep';
import { useIsMobile } from "@/hooks/use-mobile";
import { type TutorialStep as TutorialStepType } from './tutorialData';

interface ReadTutorialProps {
  tutorialSteps: TutorialStepType[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

export function ReadTutorial({ tutorialSteps, currentStep, setCurrentStep }: ReadTutorialProps) {
  const isMobile = useIsMobile();
  
  return (
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
            <TutorialStep 
              step={step} 
              currentStep={currentStep} 
              stepIndex={index} 
              stepsCount={tutorialSteps.length}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      
      {!isMobile && (
        <>
          <CarouselPrevious 
            className={`${currentStep === 0 ? 'invisible' : 'visible'}`} 
            onClick={(e) => {
              e.stopPropagation();
              if (currentStep > 0) {
                setCurrentStep(currentStep - 1);
              }
            }}
          />
          <CarouselNext 
            className={`${currentStep === tutorialSteps.length - 1 ? 'invisible' : 'visible'}`}
            onClick={(e) => {
              e.stopPropagation();
              if (currentStep < tutorialSteps.length - 1) {
                setCurrentStep(currentStep + 1);
              }
            }}
          />
        </>
      )}
    </Carousel>
  );
}
