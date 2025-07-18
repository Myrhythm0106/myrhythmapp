import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  Brain,
  Heart,
  Zap,
  Target,
  Clock,
  Users,
  BookOpen,
  PlayCircle
} from "lucide-react";

interface InteractiveUserGuideProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function InteractiveUserGuide({ onComplete, onSkip }: InteractiveUserGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const guideSteps = [
    {
      id: 'memory-first',
      title: 'Memory1st: Your Brain-Friendly Foundation',
      icon: Brain,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      content: {
        overview: 'Your brain is like a garden that needs gentle care to heal and grow.',
        keyPoints: [
          'We start with what your brain can handle today, not what it "should" do',
          'Small, consistent steps create lasting change without overwhelm',
          'Rest and recovery are just as important as action',
          'Your memory and focus will improve as we build gentle structure'
        ],
        actionable: 'This means we\'ll never ask you to do more than feels manageable, and we\'ll celebrate every small win.'
      }
    },
    {
      id: 'myrhythm-process',
      title: 'MYRHYTHM: Your Personal 8-Step Journey',
      icon: Heart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      content: {
        overview: 'MYRHYTHM is your personalized roadmap to discovering and living your unique rhythm.',
        keyPoints: [
          'M - Memory1st foundation (start where you are)',
          'Y - Your unique patterns and preferences',
          'R - Routine that works with your brain, not against it',
          'H - Habits that stick because they feel natural',
          'Y - Yes to what matters, gentle no to overwhelm',
          'T - Time awareness without time pressure',
          'H - Hope and healing through small daily wins',
          'M - Meaningful life that feels authentic to you'
        ],
        actionable: 'Each letter represents a gentle step in building your Life Operating Model.'
      }
    },
    {
      id: 'leap-outcome',
      title: 'LEAP: Live Empowered, Authentic & Productive',
      icon: Zap,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      content: {
        overview: 'LEAP is the meaningful life that awaits when you live in harmony with your MYRHYTHM.',
        keyPoints: [
          'Live: Present-moment awareness and gentle action',
          'Empowered: Confident in your abilities and supported by others',
          'Authentic: True to your values and natural rhythms',
          'Productive: Accomplishing what matters without burnout'
        ],
        actionable: 'This isn\'t about being "perfect" - it\'s about finding your sustainable way of thriving.'
      }
    },
    {
      id: 'daily-integration',
      title: 'How It Works in Daily Life',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      content: {
        overview: 'See how Memory1st, MYRHYTHM, and LEAP work together in your everyday routine.',
        keyPoints: [
          'Morning: Gentle wake-up aligned with your natural rhythm',
          'Work time: Focused sessions that match your energy patterns',
          'Breaks: Restorative activities that actually refresh you',
          'Evening: Wind-down routine that supports tomorrow\'s success'
        ],
        actionable: 'We\'ll help you discover YOUR optimal daily flow, not force you into someone else\'s.'
      }
    },
    {
      id: 'support-system',
      title: 'Your Support Network',
      icon: Users,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      content: {
        overview: 'Healing and growth happen best in community. We help you build gentle accountability.',
        keyPoints: [
          'Family members who understand your journey',
          'Healthcare team that sees your progress',
          'Trusted friends who celebrate your wins',
          'Professional support when you need it'
        ],
        actionable: 'You choose who to include and how much to share. Your privacy and comfort come first.'
      }
    }
  ];

  const currentStepData = guideSteps[currentStep];
  const isLastStep = currentStep === guideSteps.length - 1;

  const handleNext = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const Icon = currentStepData.icon;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <Badge className="bg-primary/10 text-primary mb-4">
          <BookOpen className="h-3 w-3 mr-1" />
          Interactive Guide
        </Badge>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Understanding Your MYRHYTHM Foundation
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Learn the brain-friendly approach that makes lasting change possible
        </p>
      </div>

      {/* Progress Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted-foreground">
              Step {currentStep + 1} of {guideSteps.length}
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onSkip}
              className="text-muted-foreground hover:text-foreground"
            >
              Skip Guide
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            {guideSteps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <button
                  key={step.id}
                  onClick={() => handleStepClick(index)}
                  className={`flex-1 p-2 rounded-lg text-center transition-all ${
                    index === currentStep
                      ? 'bg-primary/10 border border-primary/20'
                      : completedSteps.includes(index)
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-muted/30 hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center justify-center mb-1">
                    {completedSteps.includes(index) ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <StepIcon className={`h-4 w-4 ${
                        index === currentStep ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                    )}
                  </div>
                  <span className="text-xs font-medium">
                    {step.title.split(':')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Current Step Content */}
      <Card className={`${currentStepData.bgColor} border border-opacity-20`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full bg-background/80 flex items-center justify-center`}>
              <Icon className={`h-5 w-5 ${currentStepData.color}`} />
            </div>
            {currentStepData.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-background/80 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Core Concept</h3>
            <p className="text-muted-foreground">{currentStepData.content.overview}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Key Points</h3>
            <div className="space-y-2">
              {currentStepData.content.keyPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-muted-foreground">{point}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary/10 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-primary">What This Means for You</h3>
            <p className="text-sm text-muted-foreground">{currentStepData.content.actionable}</p>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          variant="outline"
          className="disabled:opacity-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="text-center">
          <div className="text-sm text-muted-foreground">
            {completedSteps.length} of {guideSteps.length} concepts explored
          </div>
          <div className="w-32 h-1 bg-muted rounded-full mt-1">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${(completedSteps.length / guideSteps.length) * 100}%` }}
            />
          </div>
        </div>

        <Button
          onClick={handleNext}
          className="bg-primary hover:bg-primary/90"
        >
          {isLastStep ? (
            <>
              Complete Guide
              <CheckCircle className="h-4 w-4 ml-2" />
            </>
          ) : (
            <>
              Next Concept
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>

      {/* Next Steps Preview */}
      {isLastStep && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Ready for the next step?</p>
                <p className="text-sm text-muted-foreground">
                  Now let's set up your Life Operating Model using these principles
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}