import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Zap, 
  Settings, 
  Users, 
  Calendar,
  Bell,
  Mic,
  CheckCircle,
  ArrowRight,
  Brain,
  Heart,
  Target,
  Play
} from 'lucide-react';
import { toast } from 'sonner';

interface MemoryBridgeSetupHubProps {
  onComplete: () => void;
}

interface SetupOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  category: 'core' | 'social' | 'integration';
  estimatedTime: string;
}

export function MemoryBridgeSetupHub({ onComplete }: MemoryBridgeSetupHubProps) {
  const [setupMode, setSetupMode] = useState<'choose' | 'quick' | 'step-by-step'>('choose');
  const [setupOptions, setSetupOptions] = useState<SetupOption[]>([
    {
      id: 'support-circle',
      title: 'Support Circle Setup',
      description: 'Invite family, friends, and caregivers to join your journey',
      icon: <Users className="h-5 w-5" />,
      enabled: true,
      category: 'social',
      estimatedTime: '5 min'
    },
    {
      id: 'calendar-integration',
      title: 'Calendar Integration',
      description: 'Connect your calendar for seamless action scheduling',
      icon: <Calendar className="h-5 w-5" />,
      enabled: true,
      category: 'integration',
      estimatedTime: '3 min'
    },
    {
      id: 'notification-preferences',
      title: 'Smart Notifications',
      description: 'Set up gentle reminders and progress updates',
      icon: <Bell className="h-5 w-5" />,
      enabled: true,
      category: 'core',
      estimatedTime: '2 min'
    },
    {
      id: 'recording-quality',
      title: 'Recording Settings',
      description: 'Optimize audio quality and transcription accuracy',
      icon: <Mic className="h-5 w-5" />,
      enabled: false,
      category: 'core',
      estimatedTime: '2 min'
    }
  ]);

  const handleToggleOption = (optionId: string) => {
    setSetupOptions(prev => prev.map(option => 
      option.id === optionId 
        ? { ...option, enabled: !option.enabled }
        : option
    ));
  };

  const handleQuickStart = async () => {
    toast.success('Quick setup complete! 🚀', {
      description: 'All Memory Bridge features are ready to use'
    });
    setTimeout(onComplete, 1000);
  };

  const handleStepByStep = () => {
    setSetupMode('step-by-step');
  };

  const enabledOptions = setupOptions.filter(option => option.enabled);
  const totalEstimatedTime = enabledOptions.reduce((total, option) => {
    const minutes = parseInt(option.estimatedTime);
    return total + minutes;
  }, 0);

  if (setupMode === 'choose') {
    return (
      <div className="space-y-8">
        {/* Hero Section */}
        <Card className="bg-gradient-to-r from-purple-50 via-blue-50 to-teal-50 border-purple-200">
          <CardContent className="py-12">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                  <Brain className="h-10 w-10 text-white" />
                </div>
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl font-bold text-purple-800">
                  Memory Bridge Setup
                </h1>
                <p className="text-lg text-purple-600 max-w-2xl mx-auto">
                  Transform your conversations into empowering actions. 
                  Choose how you'd like to set up your Memory Bridge experience.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Setup Mode Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Quick Start */}
          <Card className="cursor-pointer transition-all hover:shadow-lg hover:border-purple-300 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-green-800">Quick Start</h3>
                    <p className="text-sm text-green-600 font-normal">Set up everything at once</p>
                  </div>
                </CardTitle>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  Recommended
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-green-700">
                Get started immediately with all Memory Bridge features enabled. 
                Perfect if you want to jump right into recording conversations and tracking actions.
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Support Circle invitations ready</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Calendar integration active</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Smart notifications enabled</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Recording optimized</span>
                </div>
              </div>

              <Button 
                onClick={handleQuickStart}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium"
                size="lg"
              >
                <Zap className="h-4 w-4 mr-2" />
                Quick Start (30 seconds)
              </Button>
            </CardContent>
          </Card>

          {/* Step-by-Step */}
          <Card className="cursor-pointer transition-all hover:shadow-lg hover:border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-blue-800">Step-by-Step</h3>
                  <p className="text-sm text-blue-600 font-normal">Choose what to configure</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-blue-700">
                Customize your Memory Bridge setup by choosing exactly which features you want to configure. 
                Perfect if you prefer more control over your setup process.
              </p>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Target className="h-4 w-4" />
                  <span>Configure only what you need</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Heart className="h-4 w-4" />
                  <span>Detailed setup options</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Settings className="h-4 w-4" />
                  <span>Advanced customization</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Play className="h-4 w-4" />
                  <span>Skip unwanted features</span>
                </div>
              </div>

              <Button 
                onClick={handleStepByStep}
                variant="outline"
                className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                size="lg"
              >
                <Settings className="h-4 w-4 mr-2" />
                Customize Setup
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Feature Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500" />
              What You'll Get
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mic className="h-6 w-6 text-purple-500" />
                </div>
                <h4 className="font-medium text-purple-800">Voice Recording</h4>
                <p className="text-xs text-purple-600 mt-1">
                  Capture conversations with crystal-clear audio processing
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Brain className="h-6 w-6 text-blue-500" />
                </div>
                <h4 className="font-medium text-blue-800">AI Action Extraction</h4>
                <p className="text-xs text-blue-600 mt-1">
                  Smart AI identifies commitments and actionable items
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="h-6 w-6 text-green-500" />
                </div>
                <h4 className="font-medium text-green-800">Calendar Integration</h4>
                <p className="text-xs text-green-600 mt-1">
                  Schedule actions directly to your calendar
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-orange-500" />
                </div>
                <h4 className="font-medium text-orange-800">Support Circle</h4>
                <p className="text-xs text-orange-600 mt-1">
                  Share progress with family and caregivers
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (setupMode === 'step-by-step') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                onClick={() => setSetupMode('choose')}
                className="p-2"
              >
                <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                Back to Setup Options
              </Button>
              <div className="text-center">
                <CardTitle className="text-xl font-bold text-blue-800">
                  Customize Your Setup
                </CardTitle>
                <p className="text-sm text-blue-600">
                  Choose which features to configure (~{totalEstimatedTime} min total)
                </p>
              </div>
              <div></div>
            </div>
          </CardHeader>
        </Card>

        {/* Setup Options */}
        <div className="space-y-4">
          {setupOptions.map(option => (
            <Card 
              key={option.id} 
              className={`transition-all ${
                option.enabled 
                  ? 'border-purple-300 bg-purple-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      option.enabled 
                        ? 'bg-purple-100 text-purple-600' 
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {option.icon}
                    </div>
                    <div className="space-y-1">
                      <h3 className={`font-medium ${
                        option.enabled ? 'text-purple-800' : 'text-gray-600'
                      }`}>
                        {option.title}
                      </h3>
                      <p className={`text-sm ${
                        option.enabled ? 'text-purple-600' : 'text-gray-500'
                      }`}>
                        {option.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${
                            option.category === 'core' ? 'bg-blue-100 text-blue-700' :
                            option.category === 'social' ? 'bg-green-100 text-green-700' :
                            'bg-orange-100 text-orange-700'
                          }`}
                        >
                          {option.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {option.estimatedTime}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Switch 
                    checked={option.enabled}
                    onCheckedChange={() => handleToggleOption(option.id)}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Continue Button */}
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-purple-800">
                  Ready to configure {enabledOptions.length} features
                </h4>
                <p className="text-sm text-purple-600">
                  Estimated time: ~{totalEstimatedTime} minutes
                </p>
              </div>
              <Button 
                onClick={() => {
                  toast.success('Custom setup complete! 🎯', {
                    description: `${enabledOptions.length} features configured successfully`
                  });
                  setTimeout(onComplete, 1000);
                }}
                disabled={enabledOptions.length === 0}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Start Configuration
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}