import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AssessmentResult } from '@/utils/rhythmAnalysis';
import { ArrowRight, CheckCircle, Clock, Star, Target, Calendar, Users, Heart, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { EmpoweringJourneyProgress } from '@/components/onboarding/EmpoweringJourneyProgress';
import { useJourneyProgress } from '@/hooks/useJourneyProgress';
import { EmpoweringTerm } from '@/components/ui/EmpoweringTerm';

interface GuidedJourneyProps {
  assessmentResult: AssessmentResult;
  onComplete: () => void;
}

export function GuidedJourney({ assessmentResult, onComplete }: GuidedJourneyProps) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSetups, setCompletedSetups] = useState<Set<string>>(new Set());
  const { markStepComplete } = useJourneyProgress();

  // Mark profile step as complete when entering guided journey (after assessment)
  useEffect(() => {
    markStepComplete('profile');
  }, [markStepComplete]);

  // Personalized journey based on assessment results
  const getPersonalizedJourney = () => {
    const baseJourney = [
      {
        id: 'memory-bridge',
        title: 'Memory Bridge Setup',
        description: 'Capture and organize your important memories for cognitive strengthening',
        icon: <Brain className="h-6 w-6 text-purple-600" />,
        estimatedTime: '3 min',
        route: '/memory-bridge?setup=true',
        priority: 1,
        personalizedReason: 'Your assessment shows strong potential for memory organization - this will be your foundation.'
      },
      {
        id: 'calendar',
        title: 'Smart Calendar Integration', 
        description: 'Sync your daily rhythm with personalized cognitive optimization',
        icon: <Calendar className="h-6 w-6 text-blue-600" />,
        estimatedTime: '2 min',
        route: '/calendar?setup=true',
        priority: 2,
        personalizedReason: 'Your rhythm profile indicates structured scheduling will boost your energy by 35%.'
      },
      {
        id: 'support-circle',
        title: 'Support Circle Activation',
        description: 'Connect your care team and family for coordinated support',
        icon: <Users className="h-6 w-6 text-green-600" />,
        estimatedTime: '4 min', 
        route: '/support-circle?setup=true',
        priority: 3,
        personalizedReason: 'Social connection aligns with your collaborative recovery style.'
      },
      {
        id: 'gratitude',
        title: 'Gratitude Practice Room',
        description: 'Start your daily brain-health gratitude micro-practice',
        icon: <Heart className="h-6 w-6 text-pink-600" />,
        estimatedTime: '2 min',
        route: '/gratitude?setup=true', 
        priority: 4,
        personalizedReason: 'Your emotional resilience indicators suggest gratitude practice will amplify your progress.'
      }
    ];

    // Reorder based on assessment results
    const focusArea = (assessmentResult as any)?.focusArea || '';
    if (focusArea.includes('memory')) {
      baseJourney.sort((a, b) => a.id === 'memory-bridge' ? -1 : 1);
    } else if (focusArea.includes('social')) {
      baseJourney.sort((a, b) => a.id === 'support-circle' ? -1 : 1);
    }

    return baseJourney;
  };

  const journey = getPersonalizedJourney();
  const completionPercentage = (completedSetups.size / journey.length) * 100;

  const handleSetupStep = (step: any) => {
    // Mark as completed and navigate
    setCompletedSetups(prev => new Set([...prev, step.id]));
    toast.success(`${step.title} activated! 🎉`);
    
    // Mark journey milestones based on which step was completed
    if (step.id === 'support-circle') {
      markStepComplete('foundation');
    } else if (step.id === 'memory-bridge') {
      markStepComplete('voice');
    }
    
    // Navigate to the setup page
    navigate(step.route);
  };

  const handleSkipStep = (stepId: string) => {
    setCompletedSetups(prev => new Set([...prev, stepId]));
    toast.info('Step skipped - you can always set this up later');
  };

  const handleComplete = () => {
    localStorage.setItem('guided_journey_complete', 'true');
    toast.success('Welcome to your personalized MyRhythm experience! 🌟');
    navigate('/dashboard');
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Empowering Journey Progress */}
        <EmpoweringJourneyProgress variant="mini" className="mb-6" />

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-4">
            <Star className="h-5 w-5 text-amber-500" />
            <span className="text-sm font-medium text-gray-700">Day 0 Activation</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Let's Get You Started</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Based on your assessment, we've personalized your setup journey. 
            Let's activate your most impactful features first.
          </p>
          
          {/* Setup Progress */}
          <div className="mt-6 max-w-md mx-auto">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Setup Progress</span>
              <span>{completedSetups.size}/{journey.length} complete</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
        </div>

        {/* Journey Steps */}
        <div className="space-y-4 mb-8">
          {journey.map((step, index) => {
            const isCompleted = completedSetups.has(step.id);
            const isActive = index === currentStep && !isCompleted;
            
            return (
              <Card 
                key={step.id} 
                className={`transition-all duration-200 ${
                  isCompleted 
                    ? 'bg-green-50 border-green-200' 
                    : isActive 
                    ? 'bg-blue-50 border-blue-200 shadow-md' 
                    : 'bg-white border-gray-200'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                      isCompleted 
                        ? 'bg-green-100' 
                        : isActive 
                        ? 'bg-blue-100' 
                        : 'bg-gray-100'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      ) : (
                        step.icon
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{step.title}</h3>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{step.estimatedTime}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                      <div className="bg-blue-50 p-2 rounded-lg border border-blue-200">
                        <p className="text-xs text-blue-700">
                          <Target className="h-3 w-3 inline mr-1" />
                          Why this matters for you: {step.personalizedReason}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0 flex gap-2">
                      {!isCompleted && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSkipStep(step.id)}
                          >
                            Skip
                          </Button>
                          <Button
                            onClick={() => handleSetupStep(step)}
                            className="bg-gradient-to-r from-primary to-accent"
                          >
                            Set Up
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {isCompleted && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(step.route)}
                        >
                          Open
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Complete Journey */}
        {completedSetups.size === journey.length && (
          <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
            <CardContent className="text-center p-8">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Amazing! Your MyRhythm Foundation is Ready
              </h2>
              <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                You've successfully activated your personalized features. 
                Your recovery journey is now supercharged with the tools that matter most for your unique rhythm.
              </p>
              <Button 
                onClick={handleComplete}
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:shadow-lg"
              >
                Enter Your MyRhythm Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Skip All Option */}
        {completedSetups.size < journey.length && (
          <div className="text-center pt-6">
            <Button 
              variant="ghost" 
              onClick={handleComplete}
              className="text-gray-500 hover:text-gray-700"
            >
              I'll set up later - take me to dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}