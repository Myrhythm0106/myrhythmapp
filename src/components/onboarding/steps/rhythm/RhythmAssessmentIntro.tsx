
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { UserType } from "../UserTypeStep";

interface RhythmAssessmentIntroProps {
  onBeginAssessment: () => void;
  userType: UserType | null;
}

export function RhythmAssessmentIntro({ onBeginAssessment, userType }: RhythmAssessmentIntroProps) {
  const isRecoveryUser = userType === "brain-injury-recovery";

  return (
    <div className="space-y-6">
      {/* Info section */}
      <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-5 w-5 text-blue-600" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">This assessment will help us understand your unique rhythm and create a personalized experience just for you.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div>
          <h3 className="font-medium text-blue-900">
            {isRecoveryUser ? "Rhythm Assessment" : "Personal Rhythm Discovery"}
          </h3>
          <p className="text-sm text-blue-700">
            {isRecoveryUser 
              ? "Discover your unique rhythm to personalize your MyRhythm experience." 
              : "Understand your natural patterns to optimize your personal operating system."
            }
          </p>
        </div>
      </div>

      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">
            {isRecoveryUser 
              ? "Your journey is unique, and so is your rhythm." 
              : "Every high performer has their own rhythm."
            }
          </h3>
          <div className="space-y-3 text-gray-700">
            <p>
              {isRecoveryUser 
                ? "We believe in the power of your story, not to dwell on what was, but to illuminate the path forward."
                : "We believe in understanding your patterns to unlock your highest potential."
              }
            </p>
            <p>
              {isRecoveryUser 
                ? "You're about to take a small, yet powerful step towards a more personalized experience. We'll ask a few gentle questions that will help us understand your unique beat."
                : "You're about to discover your optimal operating rhythm. We'll ask questions that reveal your natural patterns and peak performance zones."
              }
            </p>
            <p className="font-medium">
              There are no right or wrong answers, only your truth.
            </p>
            <p className="text-lg font-semibold text-blue-700">
              {isRecoveryUser 
                ? "Let's begin to build your future, together."
                : "Let's unlock your optimal rhythm."
              }
            </p>
          </div>
        </div>
      </Card>
      
      <div className="flex justify-center">
        <Button 
          onClick={onBeginAssessment}
          size="lg"
          className="px-8 py-3"
        >
          Begin Assessment
        </Button>
      </div>
    </div>
  );
}
