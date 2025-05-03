
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Video } from "lucide-react";
import { ReadTutorial } from './ReadTutorial';
import { WatchTutorial } from './WatchTutorial';
import { TutorialFooter } from './TutorialFooter';
import { tutorialSteps } from './tutorialData';

interface TutorialModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export function TutorialModal({ isOpen, onComplete }: TutorialModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [tutorialMode, setTutorialMode] = useState<'read' | 'watch'>('read');
  
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
            <ReadTutorial 
              tutorialSteps={tutorialSteps}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
            />
          </TabsContent>
          
          <TabsContent value="watch" className="mt-0">
            <WatchTutorial 
              tutorialSteps={tutorialSteps}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
            />
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="p-6 pt-2">
          <TutorialFooter 
            currentStep={currentStep}
            stepsCount={tutorialSteps.length}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSkip={handleSkipTutorial}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
