import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Settings, 
  Users, 
  Calendar, 
  Brain, 
  CheckCircle, 
  Clock, 
  ArrowRight,
  Play,
  List,
  Zap
} from 'lucide-react';
import { useSetupProgress } from '@/contexts/SetupProgressContext';

interface SetupItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  estimatedTime: string;
  benefits: string[];
  completed: boolean;
}

export function SetupHub() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { steps, completedSteps, progressPercentage, setCurrentStep } = useSetupProgress();
  const [selectedMode, setSelectedMode] = useState<'landing' | 'individual' | 'bulk'>('landing');
  const fromAssessment = searchParams.get('from') === 'assessment';

  const setupItems: SetupItem[] = [
    {
      id: 'dashboard',
      title: 'Dashboard Setup',
      description: 'Customize your dashboard layout based on your assessment results',
      icon: Settings,
      estimatedTime: '2-3 minutes',
      benefits: ['Personalized layout', 'Quick access to key features', 'Better focus'],
      completed: steps.find(s => s.id === 'dashboard')?.isCompleted || false
    },
    {
      id: 'support-circle',
      title: 'Support Circle',
      description: 'Connect with family and friends who can support your journey',
      icon: Users,
      estimatedTime: '3-5 minutes',
      benefits: ['3 free members included', 'Progress sharing', 'Encouragement system'],
      completed: steps.find(s => s.id === 'support-circle')?.isCompleted || false
    },
    {
      id: 'calendar',
      title: 'Calendar Integration',
      description: 'Sync your calendars for smart scheduling and reminders',
      icon: Calendar,
      estimatedTime: '2-4 minutes',
      benefits: ['Conflict detection', 'Smart scheduling', 'Automatic reminders'],
      completed: steps.find(s => s.id === 'calendar')?.isCompleted || false
    },
    {
      id: 'community',
      title: 'Community Access',
      description: 'Join others who understand your journey and can offer support',
      icon: Brain,
      estimatedTime: '1-2 minutes',
      benefits: ['Peer support', 'Expert discussions', 'Accountability partners'],
      completed: steps.find(s => s.id === 'community')?.isCompleted || false
    }
  ];

  const completedItems = setupItems.filter(item => item.completed);
  const remainingItems = setupItems.filter(item => !item.completed);
  const totalEstimatedTime = remainingItems.reduce((total, item) => {
    const max = parseInt(item.estimatedTime.split('-')[1]);
    return total + max;
  }, 0);

  const handleIndividualSetupSelect = (itemId: string) => {
    setCurrentStep(itemId);
    navigate(`/setup/${itemId}`);
  };

  const handleBulkSetup = () => {
    setSelectedMode('bulk');
    navigate('/setup-wizard');
  };

  const handleContinueSetup = () => {
    if (remainingItems.length > 0) {
      handleIndividualSetupSelect(remainingItems[0].id);
    }
  };

  const handleSkipToApp = () => {
    navigate('/dashboard');
  };

  if (selectedMode === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-800 mb-4">
              {fromAssessment ? '🎉 Assessment Complete!' : '👋 Welcome to MyRhythm!'}
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              {fromAssessment 
                ? 'Great job! Now let\'s set up your personalized MyRhythm experience based on your results.'
                : 'Let\'s get you set up for success! You can customize everything at your own pace.'
              }
            </p>
          </div>

          {/* Progress Overview */}
          {completedItems.length > 0 && (
            <Card className="mb-8 border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div>
                      <h3 className="font-semibold text-green-800">
                        Great progress! {completedItems.length} of {setupItems.length} items complete
                      </h3>
                      <p className="text-sm text-green-700">
                        {remainingItems.length > 0 
                          ? `${remainingItems.length} items remaining (about ${totalEstimatedTime} minutes)`
                          : 'All setup items completed! 🎉'
                        }
                      </p>
                    </div>
                  </div>
                  <Progress value={progressPercentage} className="w-32" />
                </div>
                {remainingItems.length > 0 && (
                  <Button 
                    onClick={handleContinueSetup}
                    className="mt-4 bg-green-600 hover:bg-green-700"
                  >
                    Continue Setup
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Setup Options */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Quick Setup */}
            <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer group">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Quick Setup</CardTitle>
                <p className="text-muted-foreground">Set everything up in one go</p>
                <Badge variant="secondary" className="w-fit mx-auto mt-2">
                  <Clock className="h-3 w-3 mr-1" />
                  ~{totalEstimatedTime} minutes
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600 text-center">
                  Perfect if you want to get everything ready right now. We'll guide you through all {remainingItems.length || setupItems.length} setup items step by step.
                </p>
                <ul className="text-xs space-y-1 text-slate-500">
                  {setupItems.map(item => (
                    <li key={item.id} className="flex items-center gap-2">
                      {item.completed ? (
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      ) : (
                        <div className="h-3 w-3 rounded-full border border-slate-300" />
                      )}
                      <span className={item.completed ? 'line-through' : ''}>{item.title}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  onClick={handleBulkSetup}
                  className="w-full"
                  disabled={remainingItems.length === 0}
                >
                  {remainingItems.length === 0 ? 'All Items Complete!' : 'Start Quick Setup'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Step by Step */}
            <Card className="border-2 hover:border-secondary/50 transition-colors cursor-pointer group">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                  <List className="h-8 w-8 text-secondary" />
                </div>
                <CardTitle className="text-xl">Step-by-Step Setup</CardTitle>
                <p className="text-muted-foreground">Pick and choose what to set up</p>
                <Badge variant="outline" className="w-fit mx-auto mt-2">
                  <Play className="h-3 w-3 mr-1" />
                  At your pace
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600 text-center">
                  Perfect if you want to focus on specific items or set things up over time. You can always come back later.
                </p>
                <Button 
                  onClick={() => setSelectedMode('individual')}
                  variant="secondary"
                  className="w-full"
                >
                  Choose What to Set Up
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Or Skip */}
          <div className="text-center">
            <p className="text-slate-500 mb-4">
              You can always set these up later from your dashboard settings
            </p>
            <Button 
              variant="ghost" 
              onClick={handleSkipToApp}
              className="text-slate-600 hover:text-slate-800"
            >
              Skip Setup & Explore MyRhythm
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedMode === 'individual') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          {/* Header */}
          <div className="text-center mb-8">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedMode('landing')}
              className="mb-4"
            >
              ← Back to Setup Options
            </Button>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Choose What to Set Up</h1>
            <p className="text-slate-600">
              Select the items you'd like to configure. You can set up more later!
            </p>
          </div>

          {/* Progress */}
          {completedItems.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between text-sm text-slate-600 mb-2">
                <span>{completedItems.length} of {setupItems.length} items complete</span>
                <span>{Math.round(progressPercentage)}% done</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          )}

          {/* Setup Items Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {setupItems.map((item) => {
              const Icon = item.icon;
              return (
                <Card 
                  key={item.id}
                  className={`border-2 transition-all duration-200 ${
                    item.completed 
                      ? 'border-green-200 bg-green-50' 
                      : 'hover:border-primary/50 cursor-pointer hover:shadow-md'
                  }`}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          item.completed ? 'bg-green-100' : 'bg-primary/10'
                        }`}>
                          {item.completed ? (
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          ) : (
                            <Icon className="h-6 w-6 text-primary" />
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{item.title}</CardTitle>
                          <Badge variant="outline" className="text-xs mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            {item.estimatedTime}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-slate-600">{item.description}</p>
                    
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                        What you'll get:
                      </h4>
                      <ul className="space-y-1">
                        {item.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-center gap-2 text-xs text-slate-600">
                            <div className="w-1 h-1 rounded-full bg-primary" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button 
                      onClick={() => handleIndividualSetupSelect(item.id)}
                      className="w-full"
                      variant={item.completed ? "outline" : "default"}
                      disabled={item.completed}
                    >
                      {item.completed ? 'Already Set Up ✓' : 'Set Up Now'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {remainingItems.length > 0 && (
              <Button 
                onClick={handleBulkSetup}
                variant="outline"
                className="gap-2"
              >
                <Zap className="h-4 w-4" />
                Set Up All Remaining ({remainingItems.length})
              </Button>
            )}
            <Button 
              variant="ghost" 
              onClick={handleSkipToApp}
              className="text-slate-600"
            >
              {completedItems.length > 0 ? 'Continue to App' : 'Skip & Explore App'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}