import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, CheckCircle, Users, Calendar, Brain, Settings } from 'lucide-react';

export default function SetupWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const fromAssessment = searchParams.get('from') === 'assessment';

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const steps = [
    {
      id: 1,
      title: 'Dashboard Setup',
      icon: Settings,
      description: 'Customize your dashboard layout and preferences'
    },
    {
      id: 2,
      title: 'Support Circle',
      icon: Users,
      description: 'Connect with your support network (3 members included)'
    },
    {
      id: 3,
      title: 'Calendar Integration',
      icon: Calendar,
      description: 'Sync your calendars and set up smart scheduling'
    },
    {
      id: 4,
      title: 'Community Access',
      icon: Brain,
      description: 'Join the MyRhythm community and find your tribe'
    }
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    navigate('/dashboard?setup_complete=true');
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  const currentStepData = steps[currentStep - 1];
  const StepIcon = currentStepData.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Setup Your MyRhythm Experience</h1>
          <p className="text-slate-600">
            {fromAssessment 
              ? 'Great job completing your assessment! Now let\'s set up your personalized experience.'
              : 'Let\'s get you set up for success with MyRhythm.'
            }
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-slate-600 mb-2">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Current Step Card */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
              <StepIcon className="h-8 w-8 text-teal-600" />
            </div>
            <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
            <p className="text-slate-600">{currentStepData.description}</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Step Content */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h4 className="font-semibold">Customize Your Dashboard</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-slate-200 rounded-lg bg-white">
                    <h5 className="font-medium mb-2">Memory-First Layout</h5>
                    <p className="text-sm text-slate-600">Prioritizes memory tools and cognitive tracking</p>
                  </div>
                  <div className="p-4 border border-slate-200 rounded-lg bg-white">
                    <h5 className="font-medium mb-2">Empowerment Layout</h5>
                    <p className="text-sm text-slate-600">Focuses on goals, progress, and achievements</p>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <h4 className="font-semibold">Connect Your Support Circle</h4>
                <p className="text-slate-600">Your subscription includes 3 free support circle members who can:</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Receive progress updates and insights</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Help with reminders and encouragement</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Access shared calendar and plans</span>
                  </li>
                </ul>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <h4 className="font-semibold">Calendar Integration</h4>
                <p className="text-slate-600">Connect your calendars for smart scheduling and conflict detection:</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 border border-slate-200 rounded-lg text-center">
                    <span className="text-sm font-medium">Google Calendar</span>
                  </div>
                  <div className="p-3 border border-slate-200 rounded-lg text-center">
                    <span className="text-sm font-medium">Apple Calendar</span>
                  </div>
                  <div className="p-3 border border-slate-200 rounded-lg text-center">
                    <span className="text-sm font-medium">Outlook</span>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <h4 className="font-semibold">Join the Community</h4>
                <p className="text-slate-600">
                  Connect with others who understand your journey. The MyRhythm community provides:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Peer support and shared experiences</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Expert-led discussions and tips</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Accountability partners and motivation</span>
                  </li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={handleSkip}
            className="text-slate-500"
          >
            Skip Setup
          </Button>

          <Button 
            onClick={handleNext}
            className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white gap-2"
          >
            {currentStep === totalSteps ? 'Complete Setup' : 'Next Step'}
            {currentStep < totalSteps && <ArrowRight className="h-4 w-4" />}
          </Button>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`w-3 h-3 rounded-full ${
                currentStep >= step.id ? 'bg-teal-600' : 'bg-slate-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}