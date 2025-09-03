import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Clock, ArrowRight } from 'lucide-react';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
  estimated_time?: string;
}

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
  steps: OnboardingStep[];
  className?: string;
  showTimeEstimate?: boolean;
}

export function OnboardingProgress({ 
  currentStep, 
  totalSteps, 
  steps, 
  className = "",
  showTimeEstimate = true 
}: OnboardingProgressProps) {
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
  const completedSteps = steps.filter(step => step.completed).length;
  const remainingSteps = steps.filter(step => !step.completed && !step.current).length;
  
  // Calculate estimated time remaining
  const remainingTime = remainingSteps * 2; // Rough estimate: 2 minutes per step
  
  return (
    <Card className={`border-brain-health-200 bg-gradient-to-r from-brain-health-50/50 to-memory-emerald-50/50 ${className}`}>
      <CardContent className="p-4 space-y-4">
        {/* Header with Progress */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-brain-health-900">
              Setup Progress
            </h3>
            <p className="text-sm text-brain-health-600">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
          
          <div className="text-right space-y-1">
            <Badge className="bg-memory-emerald-100 text-memory-emerald-700">
              {completedSteps}/{totalSteps} Complete
            </Badge>
            {showTimeEstimate && remainingTime > 0 && (
              <p className="text-xs text-brain-health-500 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                ~{remainingTime} min remaining
              </p>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress 
            value={progressPercentage} 
            className="h-3 bg-brain-health-100"
          />
          <div className="flex justify-between text-xs text-brain-health-500">
            <span>Started</span>
            <span>{Math.round(progressPercentage)}% complete</span>
            <span>Ready to use!</span>
          </div>
        </div>

        {/* Step List */}
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {steps.map((step, index) => (
            <div 
              key={step.id}
              className={`flex items-start gap-3 p-2 rounded-lg transition-all duration-200 ${
                step.current 
                  ? 'bg-brain-health-100 border border-brain-health-200' 
                  : step.completed 
                    ? 'bg-memory-emerald-50 border border-memory-emerald-200' 
                    : 'bg-white/50 border border-gray-200'
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {step.completed ? (
                  <CheckCircle className="h-5 w-5 text-memory-emerald-500" />
                ) : step.current ? (
                  <ArrowRight className="h-5 w-5 text-brain-health-500 animate-pulse" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-400" />
                )}
              </div>
              
              <div className="flex-grow space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className={`text-sm font-medium ${
                    step.current 
                      ? 'text-brain-health-900' 
                      : step.completed 
                        ? 'text-memory-emerald-800' 
                        : 'text-gray-600'
                  }`}>
                    {step.title}
                  </h4>
                  
                  {step.current && step.estimated_time && (
                    <Badge variant="outline" className="text-xs py-0 px-2 border-brain-health-300 text-brain-health-600">
                      {step.estimated_time}
                    </Badge>
                  )}
                </div>
                
                <p className={`text-xs ${
                  step.current 
                    ? 'text-brain-health-700' 
                    : step.completed 
                      ? 'text-memory-emerald-600' 
                      : 'text-gray-500'
                }`}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Encouragement Message */}
        <div className="bg-gradient-to-r from-sunrise-amber-50 to-memory-emerald-50 p-3 rounded-lg border border-sunrise-amber-200">
          <p className="text-sm text-brain-health-700 text-center">
            <strong>You're doing great!</strong> Each step brings you closer to your personalized MyRhythm experience.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}